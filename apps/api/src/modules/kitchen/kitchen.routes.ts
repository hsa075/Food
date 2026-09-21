import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { z } from 'zod';
import { KitchenService } from './kitchen.service.js';
import { requireRole } from '../../plugins/auth.js';
import { Role, ProductionStatus } from '@prisma/client';

const updateBatchSchema = z.object({
  status: z.enum(['PLANNED', 'IN_PREPARATION', 'READY_FOR_DISPATCH', 'DISPATCHED', 'COMPLETED']),
  cookedMeals: z.number().int().min(0).optional(),
  wastageMeals: z.number().int().min(0).optional(),
});

const recordDispatchSchema = z.object({
  productionId: z.string().uuid(),
  outletId: z.string().uuid(),
  dispatchedMeals: z.number().int().min(0),
});

export const kitchenRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  const kitchenGuard = [
    (fastify as any).authenticate,
    requireRole([Role.kitchen_manager, Role.admin]),
  ];

  fastify.get('/dashboard', { preHandler: kitchenGuard }, async (request, reply) => {
    try {
      const dashboard = await KitchenService.getDashboard();
      return reply.send({ dashboard });
    } catch (err: any) {
      return reply.status(500).send({ error: 'Failed to fetch kitchen dashboard', message: err.message });
    }
  });

  fastify.patch('/batch/:id', { preHandler: kitchenGuard }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const parse = updateBatchSchema.safeParse(request.body);
    if (!parse.success) {
      return reply.status(400).send({ error: 'Invalid batch update', details: parse.error.format() });
    }

    try {
      const batch = await KitchenService.updateBatchStatus(
        id,
        parse.data.status as ProductionStatus,
        parse.data.cookedMeals,
        parse.data.wastageMeals
      );
      return reply.send({ batch });
    } catch (err: any) {
      return reply.status(400).send({ error: 'Failed to update batch', message: err.message });
    }
  });

  fastify.post('/dispatch', { preHandler: kitchenGuard }, async (request, reply) => {
    const parse = recordDispatchSchema.safeParse(request.body);
    if (!parse.success) {
      return reply.status(400).send({ error: 'Invalid dispatch record', details: parse.error.format() });
    }

    try {
      const dispatch = await KitchenService.recordDispatch(
        parse.data.productionId,
        parse.data.outletId,
        parse.data.dispatchedMeals
      );
      return reply.send({ dispatch });
    } catch (err: any) {
      return reply.status(400).send({ error: 'Failed to record dispatch', message: err.message });
    }
  });
};
