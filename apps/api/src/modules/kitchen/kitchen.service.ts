import { prisma } from '../../plugins/prisma.js';
import { ProductionStatus, DispatchStatus } from '@prisma/client';

export class KitchenService {
  static async getDashboard() {
    const todayStr = new Date().toISOString().split('T')[0];

    // Find or create today's kitchen production batch
    let batch = await prisma.kitchenProduction.findFirst({
      where: { date: todayStr },
      include: {
        dispatches: {
          include: { outlet: true },
        },
      },
    });

    const allOutlets = await prisma.outlet.findMany({
      where: { isActive: true },
      include: {
        orders: {
          where: {
            createdAt: {
              gte: new Date(new Date().setHours(0, 0, 0, 0)),
            },
          },
        },
      },
    });

    if (!batch) {
      // Calculate initial forecast (baseline 120-150 meals per outlet)
      const plannedMeals = allOutlets.length * 125;
      batch = await prisma.kitchenProduction.create({
        data: {
          date: todayStr,
          batchNumber: `BATCH-${todayStr.replace(/-/g, '')}-01`,
          plannedMeals,
          cookedMeals: plannedMeals,
          dispatchedMeals: 0,
          wastageMeals: 0,
          status: ProductionStatus.PLANNED,
        },
        include: {
          dispatches: { include: { outlet: true } },
        },
      });

      // Create initial dispatch targets per outlet
      for (const outlet of allOutlets) {
        await prisma.kitchenOutletDispatch.create({
          data: {
            kitchenProductionId: batch.id,
            outletId: outlet.id,
            expectedMeals: 125,
            dispatchedMeals: 0,
            receivedMeals: 0,
            status: DispatchStatus.DISPATCHED,
          },
        });
      }

      // Reload with created dispatches
      batch = await prisma.kitchenProduction.findUnique({
        where: { id: batch.id },
        include: { dispatches: { include: { outlet: true } } },
      });
    }

    // Today's palya details
    const dailyMenu = await prisma.dailyMenu.findFirst({
      where: { date: todayStr, isAvailable: true },
    });

    const outletsDemand = allOutlets.map((outlet) => {
      const dispatch = batch?.dispatches.find((d) => d.outletId === outlet.id);
      const actualOrders = outlet.orders.length;
      return {
        outletId: outlet.id,
        outletName: outlet.name,
        outletLocality: outlet.locality,
        expectedMeals: dispatch?.expectedMeals ?? 120,
        actualOrders,
        dispatchedMeals: dispatch?.dispatchedMeals ?? 0,
        receivedMeals: dispatch?.receivedMeals ?? 0,
        dispatchStatus: dispatch?.status ?? 'DISPATCHED',
      };
    });

    const totalPlannedMeals = batch?.plannedMeals ?? outletsDemand.reduce((acc, o) => acc + o.expectedMeals, 0);
    const totalDispatched = outletsDemand.reduce((acc, o) => acc + o.dispatchedMeals, 0);

    return {
      todayDate: todayStr,
      batchId: batch?.id,
      batchNumber: batch?.batchNumber,
      totalBatches: 1,
      totalPlannedMeals,
      totalCookedMeals: batch?.cookedMeals ?? totalPlannedMeals,
      totalDispatchedMeals: totalDispatched,
      totalWastageMeals: batch?.wastageMeals ?? 0,
      activeBatchStatus: batch?.status ?? 'PLANNED',
      palya1Name: dailyMenu?.palya1Name || 'Yennegayi Badanekayi',
      palya2Name: dailyMenu?.palya2Name || 'Hesaru Kalu Usli',
      nextDispatchTime: '11:15 AM IST',
      outletsDemand,
    };
  }

  static async updateBatchStatus(batchId: string, status: ProductionStatus, cookedMeals?: number, wastageMeals?: number) {
    return prisma.kitchenProduction.update({
      where: { id: batchId },
      data: {
        status,
        ...(cookedMeals !== undefined ? { cookedMeals } : {}),
        ...(wastageMeals !== undefined ? { wastageMeals } : {}),
      },
    });
  }

  static async recordDispatch(productionId: string, outletId: string, dispatchedMeals: number) {
    return prisma.kitchenOutletDispatch.upsert({
      where: {
        id: (await prisma.kitchenOutletDispatch.findFirst({
          where: { kitchenProductionId: productionId, outletId },
        }))?.id || 'non-existent',
      },
      create: {
        kitchenProductionId: productionId,
        outletId,
        expectedMeals: dispatchedMeals,
        dispatchedMeals,
        receivedMeals: dispatchedMeals,
        status: DispatchStatus.DISPATCHED,
      },
      update: {
        dispatchedMeals,
        receivedMeals: dispatchedMeals,
        status: DispatchStatus.DISPATCHED,
      },
    });
  }
}
