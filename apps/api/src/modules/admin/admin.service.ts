import { prisma } from '../../plugins/prisma.js';
import { CreateOutletDTO, UpdateOutletDTO, UpdateDailyPalyaDTO } from '@uttara/shared';
import { OrderStatus } from '@prisma/client';

export class AdminService {
  static async getDashboardMetrics() {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const [
      todayOrders,
      activeOutletsCount,
      allOrders,
      topOutletData,
    ] = await Promise.all([
      prisma.order.findMany({
        where: { createdAt: { gte: todayStart } },
        include: { outlet: true, payment: true },
      }),
      prisma.outlet.count({ where: { isActive: true } }),
      prisma.order.findMany({
        select: { totalAmount: true, status: true, quantity: true, outlet: { select: { name: true, locality: true } } },
      }),
      prisma.order.groupBy({
        by: ['outletId'],
        _count: { id: true },
        _sum: { totalAmount: true },
        orderBy: { _count: { id: 'desc' } },
        take: 1,
      }),
    ]);

    const completedToday = todayOrders.filter((o) => o.status === OrderStatus.COMPLETED);
    const pendingToday = todayOrders.filter((o) => o.status !== OrderStatus.COMPLETED && o.status !== OrderStatus.CANCELLED);
    
    const todayRevenue = todayOrders
      .filter((o) => o.payment?.status === 'SUCCESS')
      .reduce((acc, o) => acc + o.totalAmount, 0);

    const averageOrderValue = todayOrders.length > 0
      ? Math.round((todayRevenue / (todayOrders.length || 1)) * 10) / 10
      : 0;

    let topOutletName = 'Indiranagar';
    if (topOutletData.length > 0) {
      const outlet = await prisma.outlet.findUnique({ where: { id: topOutletData[0].outletId } });
      if (outlet) topOutletName = `${outlet.locality} (${topOutletData[0]._count.id} orders)`;
    }

    const totalMealsSoldToday = todayOrders.reduce((acc, o) => acc + o.quantity, 0);

    return {
      todayOrdersCount: todayOrders.length,
      todayRevenue: Math.round(todayRevenue * 100) / 100,
      activeOutlets: activeOutletsCount,
      pendingOrdersCount: pendingToday.length,
      completedOrdersCount: completedToday.length,
      averageOrderValue,
      topOutlet: topOutletName,
      totalMealsSoldToday,
      recentOrders: todayOrders.slice(0, 10),
    };
  }

  static async updateDailyPalya(dto: UpdateDailyPalyaDTO) {
    const todayStr = new Date().toISOString().split('T')[0];

    return prisma.dailyMenu.upsert({
      where: {
        outletId_date: {
          outletId: dto.outletId || '',
          date: todayStr,
        },
      },
      create: {
        outletId: dto.outletId || null,
        date: todayStr,
        palya1Name: dto.palya1Name,
        palya1KannadaName: dto.palya1KannadaName || null,
        palya1Description: dto.palya1Description,
        palya2Name: dto.palya2Name,
        palya2KannadaName: dto.palya2KannadaName || null,
        palya2Description: dto.palya2Description,
        isAvailable: true,
      },
      update: {
        palya1Name: dto.palya1Name,
        palya1KannadaName: dto.palya1KannadaName || null,
        palya1Description: dto.palya1Description,
        palya2Name: dto.palya2Name,
        palya2KannadaName: dto.palya2KannadaName || null,
        palya2Description: dto.palya2Description,
      },
    });
  }

  static async createOutlet(dto: CreateOutletDTO) {
    return prisma.outlet.create({
      data: {
        name: dto.name,
        slug: dto.slug,
        code: dto.code,
        address: dto.address,
        locality: dto.locality,
        landmark: dto.landmark || null,
        latitude: dto.latitude,
        longitude: dto.longitude,
        phone: dto.phone,
        email: dto.email,
        opensAt: dto.opensAt || '11:30',
        closesAt: dto.closesAt || '22:30',
        averagePrepTimeMinutes: dto.averagePrepTimeMinutes || 8,
      },
    });
  }

  static async updateOutlet(id: string, dto: UpdateOutletDTO) {
    return prisma.outlet.update({
      where: { id },
      data: dto,
    });
  }

  static async listOrders(limit = 50) {
    return prisma.order.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: { outlet: true, payment: true, user: true },
    });
  }

  static async createCoupon(data: any) {
    return prisma.coupon.create({ data });
  }

  static async listCoupons() {
    return prisma.coupon.findMany({ orderBy: { createdAt: 'desc' } });
  }
}
