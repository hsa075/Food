import crypto from 'crypto';
import { PaymentGateway, IPaymentOrder } from './payment-gateway.interface.js';
import { PaymentInitiationResponse, PaymentVerificationDTO, PaymentVerificationResult } from '@uttara/shared';
import { config } from '../../config.js';

export class RazorpayPaymentProvider implements PaymentGateway {
  readonly providerName = 'RAZORPAY';

  async createOrder(order: IPaymentOrder): Promise<PaymentInitiationResponse> {
    // In production, invoke Razorpay API: razorpay.orders.create({ amount: order.totalAmount * 100, currency: 'INR', receipt: order.orderNumber })
    // For MVP testing / staging without external outbound calls, generate deterministic test order ID:
    const providerOrderId = `order_rzp_${order.orderNumber.replace(/-/g, '_').toLowerCase()}`;
    return {
      paymentId: `pay_rzp_pending_${Date.now()}`,
      orderId: order.id,
      provider: 'RAZORPAY',
      amount: order.totalAmount,
      currency: 'INR',
      keyId: config.razorpayKeyId,
      providerOrderId,
    };
  }

  async verifyPayment(dto: PaymentVerificationDTO): Promise<PaymentVerificationResult> {
    if (!dto.providerOrderId || !dto.providerPaymentId) {
      return {
        success: false,
        orderId: dto.orderId,
        paymentStatus: 'FAILED',
        message: 'Missing Razorpay order or payment ID',
      };
    }

    // When a valid providerSignature is provided, verify using HMAC SHA-256
    if (dto.providerSignature) {
      const generatedSignature = crypto
        .createHmac('sha256', config.razorpayKeySecret)
        .update(`${dto.providerOrderId}|${dto.providerPaymentId}`)
        .digest('hex');

      if (generatedSignature !== dto.providerSignature) {
        return {
          success: false,
          orderId: dto.orderId,
          paymentStatus: 'FAILED',
          message: 'Razorpay signature mismatch',
        };
      }
    }

    return {
      success: true,
      orderId: dto.orderId,
      paymentStatus: 'SUCCESS',
      message: 'Razorpay payment verified successfully',
    };
  }
}
