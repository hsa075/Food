import { prisma } from '../../plugins/prisma.js';
import { PaymentGateway } from './payment-gateway.interface.js';
import { MockPaymentProvider } from './mock-payment.provider.js';
import { RazorpayPaymentProvider } from './razorpay-payment.provider.js';
import { PaymentInitiationDTO, PaymentVerificationDTO, PaymentProvider } from '@uttara/shared';
import { OrderStatus } from '@prisma/client';

export class PaymentsService {
  private static providers: Record<PaymentProvider, PaymentGateway> = {
    MOCK: new MockPaymentProvider(),
    RAZORPAY: new RazorpayPaymentProvider(),
  };

  static getProvider(provider: PaymentProvider = 'MOCK'): PaymentGateway {
    return this.providers[provider] || this.providers.MOCK;
  }

  static async initiatePayment(dto: PaymentInitiationDTO) {
    const order = await prisma.order.findUnique({
      where: { id: dto.orderId },
    });

    if (!order) {
      throw new Error('Order not found');
    }

    if (order.status !== 'PLACED' && order.status !== 'CONFIRMED') {
      throw new Error(`Cannot pay for order in status ${order.status}`);
    }

    const providerType = dto.provider || 'MOCK';
    const gateway = this.getProvider(providerType);

    const initResponse = await gateway.createOrder({
      id: order.id,
      orderNumber: order.orderNumber,
      totalAmount: order.totalAmount,
      customerName: order.customerName,
      customerPhone: order.customerPhone,
      customerEmail: order.customerEmail,
    });

    // Update payment record with provider and providerOrderId
    await prisma.payment.upsert({
      where: { orderId: order.id },
      create: {
        orderId: order.id,
        amount: order.totalAmount,
        currency: 'INR',
        status: 'PENDING',
        provider: providerType,
        providerOrderId: initResponse.providerOrderId,
      },
      update: {
        provider: providerType,
        providerOrderId: initResponse.providerOrderId,
      },
    });

    return initResponse;
  }

  static async verifyPayment(dto: PaymentVerificationDTO) {
    const order = await prisma.order.findUnique({
      where: { id: dto.orderId },
      include: { user: true, payment: true },
    });

    if (!order) {
      throw new Error('Order not found');
    }

    const gateway = this.getProvider(dto.provider);
    const result = await gateway.verifyPayment(dto);

    if (!result.success) {
      await prisma.payment.update({
        where: { orderId: order.id },
        data: { status: 'FAILED' },
      });
      throw new Error(result.message || 'Payment verification failed');
    }

    // Atomic transaction: Update payment, advance order to CONFIRMED, award loyalty points
    await prisma.$transaction(async (tx) => {
      await tx.payment.update({
        where: { orderId: order.id },
        data: {
          status: 'SUCCESS',
          providerPaymentId: dto.providerPaymentId || `pay_${Date.now()}`,
          providerSignature: dto.providerSignature || null,
        },
      });

      await tx.order.update({
        where: { id: order.id },
        data: { status: OrderStatus.CONFIRMED },
      });

      // Award loyalty points if user is registered
      if (order.userId) {
        const pointsEarned = Math.floor(order.totalAmount);
        const account = await tx.loyaltyAccount.findUnique({ where: { userId: order.userId } });
        if (account) {
          await tx.loyaltyAccount.update({
            where: { id: account.id },
            data: {
              pointsBalance: { increment: pointsEarned },
              lifetimePointsEarned: { increment: pointsEarned },
            },
          });

          await tx.loyaltyTransaction.create({
            data: {
              loyaltyAccountId: account.id,
              orderId: order.id,
              points: pointsEarned,
              type: 'EARNED',
              description: `Points earned on ${order.orderNumber}`,
            },
          });
        }
      }

      // Create notification
      if (order.userId) {
        await tx.notification.create({
          data: {
            userId: order.userId,
            title: 'Order Confirmed!',
            body: `Your order ${order.orderNumber} is confirmed. Pick up at counter with OTP: ${order.pickupOtp}`,
            type: 'ORDER_CONFIRMED',
          },
        });
      }
    });

    return {
      success: true,
      orderId: order.id,
      orderNumber: order.orderNumber,
      pickupOtp: order.pickupOtp,
      status: 'CONFIRMED',
    };
  }
}
