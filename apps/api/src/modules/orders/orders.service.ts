import { prisma } from '../../plugins/prisma.js';
import { CreateOrderDTO, PriceBreakdown, OrderType } from '@uttara/shared';
import { OrderStatus } from '@prisma/client';
import { BASE_OOTA_PRICE, PACKAGING_FEE, GST_RATE } from '@uttara/shared';

export class OrdersService {
  /**
   * Always calculate pricing server-side. Never trust client totals.
   */
  static async calculatePrice(quantity: number, orderType: OrderType, couponCode?: string): Promise<PriceBreakdown> {
    if (quantity < 1 || quantity > 50) {
      throw new Error('Quantity must be between 1 and 50');
    }

    const unitPrice = BASE_OOTA_PRICE;
    const subtotal = Math.round(unitPrice * quantity * 100) / 100;
    const packagingFee = orderType === 'TAKEAWAY' ? PACKAGING_FEE * quantity : 0;

    let discountAmount = 0;
    let validCouponCode: string | null = null;

    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({
        where: { code: couponCode.trim().toUpperCase() },
      });

      const now = new Date();
      if (coupon && coupon.isActive && coupon.validUntil > now && subtotal >= coupon.minOrderValue) {
        if (coupon.discountType === 'PERCENTAGE') {
          const rawDiscount = (subtotal * coupon.discountValue) / 100;
          discountAmount = coupon.maxDiscount ? Math.min(rawDiscount, coupon.maxDiscount) : rawDiscount;
        } else {
          discountAmount = coupon.discountValue;
        }
        discountAmount = Math.min(discountAmount, subtotal); // cannot exceed subtotal
        discountAmount = Math.round(discountAmount * 100) / 100;
        validCouponCode = coupon.code;
      }
    }

    const taxableAmount = Math.max(0, subtotal - discountAmount);
    const taxAmount = Math.round(taxableAmount * GST_RATE * 100) / 100;
    const totalAmount = Math.round((taxableAmount + packagingFee + taxAmount) * 100) / 100;

    return {
      quantity,
      unitPrice,
      subtotal,
      discountAmount,
      packagingFee,
      taxAmount,
      totalAmount,
      couponApplied: validCouponCode,
    };
  }

  static async createOrder(dto: CreateOrderDTO, userId?: string) {
    const outlet = await prisma.outlet.findUnique({ where: { id: dto.outletId } });
    if (!outlet || !outlet.isActive) {
      throw new Error('Selected outlet is currently unavailable');
    }

    const pricing = await this.calculatePrice(dto.quantity, dto.orderType, dto.couponCode);

    // Generate unique order number (e.g. UTT-1055)
    const count = await prisma.order.count();
    const orderNumber = `UTT-${1044 + count}`;
    const pickupOtp = Math.floor(1000 + Math.random() * 9000).toString();

    const estimatedReadyAt = new Date();
    estimatedReadyAt.setMinutes(estimatedReadyAt.getMinutes() + (outlet.averagePrepTimeMinutes || 8));

    const coreItem = await prisma.menuItem.findFirst({ where: { isDefaultOota: true } });

    // Database transaction for atomic order creation
    const order = await prisma.$transaction(async (tx) => {
      const createdOrder = await tx.order.create({
        data: {
          orderNumber,
          userId: userId || null,
          outletId: outlet.id,
          customerName: dto.customerName,
          customerPhone: dto.customerPhone,
          customerEmail: dto.customerEmail,
          status: OrderStatus.PLACED,
          orderType: dto.orderType,
          pickupOtp,
          notes: dto.notes,
          quantity: pricing.quantity,
          unitPrice: pricing.unitPrice,
          subtotal: pricing.subtotal,
          discountAmount: pricing.discountAmount,
          packagingFee: pricing.packagingFee,
          taxAmount: pricing.taxAmount,
          totalAmount: pricing.totalAmount,
          couponCode: pricing.couponApplied,
          estimatedReadyAt,
          items: {
            create: {
              menuItemId: coreItem?.id,
              name: 'North Karnataka Oota',
              quantity: pricing.quantity,
              unitPrice: pricing.unitPrice,
              totalPrice: pricing.subtotal,
            },
          },
          payment: {
            create: {
              amount: pricing.totalAmount,
              currency: 'INR',
              status: 'PENDING',
              provider: 'MOCK',
            },
          },
        },
        include: {
          items: true,
          payment: true,
          outlet: true,
        },
      });

      if (pricing.couponApplied) {
        await tx.coupon.update({
          where: { code: pricing.couponApplied },
          data: { usageCount: { increment: 1 } },
        });
      }

      return createdOrder;
    });

    return order;
  }

  static async getOrderById(idOrNumber: string) {
    const order = await prisma.order.findFirst({
      where: {
        OR: [
          { id: idOrNumber },
          { orderNumber: idOrNumber.toUpperCase() },
        ],
      },
      include: {
        outlet: true,
        items: true,
        payment: true,
      },
    });

    if (!order) {
      throw new Error('Order not found');
    }

    // Get today's palya details for context
    const todayStr = order.createdAt.toISOString().split('T')[0];
    const dailyMenu = await prisma.dailyMenu.findFirst({
      where: { date: todayStr, isAvailable: true },
    });

    return {
      ...order,
      palya1Name: dailyMenu?.palya1Name || 'Yennegayi Badanekayi',
      palya2Name: dailyMenu?.palya2Name || 'Hesaru Kalu Usli',
    };
  }

  static async getMyOrders(userId: string) {
    return prisma.order.findMany({
      where: { userId },
      include: {
        outlet: true,
        payment: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });
  }

  static async cancelOrder(orderId: string, userId?: string) {
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) {
      throw new Error('Order not found');
    }

    if (userId && order.userId !== userId) {
      throw new Error('Unauthorized to cancel this order');
    }

    if (order.status !== 'PLACED' && order.status !== 'CONFIRMED') {
      throw new Error(`Order in status '${order.status}' cannot be cancelled`);
    }

    return prisma.order.update({
      where: { id: orderId },
      data: { status: 'CANCELLED' },
      include: { outlet: true, payment: true },
    });
  }
}
