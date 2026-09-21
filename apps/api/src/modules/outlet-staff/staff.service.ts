import { prisma } from '../../plugins/prisma.js';
import { OrderStatus } from '@prisma/client';

export class StaffService {
  static async getOutletOrders(outletId: string, status?: OrderStatus) {
    return prisma.order.findMany({
      where: {
        outletId,
        ...(status ? { status } : {
          status: {
            in: [OrderStatus.PLACED, OrderStatus.CONFIRMED, OrderStatus.PREPARING, OrderStatus.READY],
          }
        }),
      },
      include: {
        items: true,
        payment: true,
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  static async updateOrderStatus(orderId: string, status: OrderStatus, staffOutletId?: string) {
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) {
      throw new Error('Order not found');
    }

    if (staffOutletId && order.outletId !== staffOutletId) {
      throw new Error('Unauthorized for this outlet');
    }

    const updated = await prisma.order.update({
      where: { id: orderId },
      data: { status },
      include: { items: true, payment: true, outlet: true },
    });

    // Notify user if registered
    if (updated.userId) {
      let title = 'Order Update';
      let body = `Your order ${updated.orderNumber} is now ${status.toLowerCase()}`;
      if (status === 'READY') {
        title = 'Oota Ready for Pickup! 🍲';
        body = `Order ${updated.orderNumber} is ready at the counter. Show OTP: ${updated.pickupOtp}`;
      } else if (status === 'COMPLETED') {
        title = 'Oota Picked Up!';
        body = `Thank you for dining with Uttara. Enjoy your meal!`;
      }

      await prisma.notification.create({
        data: {
          userId: updated.userId,
          title,
          body,
          type: `ORDER_${status}`,
        },
      });
    }

    return updated;
  }

  static async verifyPickupOtp(orderId: string, otp: string) {
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) {
      throw new Error('Order not found');
    }

    if (order.pickupOtp !== otp.trim()) {
      throw new Error('Invalid pickup OTP');
    }

    return this.updateOrderStatus(orderId, OrderStatus.COMPLETED);
  }
}
