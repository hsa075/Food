import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { z } from 'zod';
import { StaffService } from './staff.service.js';
import { requireRole } from '../../plugins/auth.js';
import { Role, OrderStatus } from '@prisma/client';

const updateStatusSchema = z.object({
  status: z.enum(['PLACED', 'CONFIRMED', 'PREPARING', 'READY', 'COMPLETED', 'CANCELLED']),
});

const verifyOtpSchema = z.object({
  otp: z.string().length(4),
});

export const staffRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  const staffGuard = [
    (fastify as any).authenticate,
    requireRole([Role.outlet_staff, Role.outlet_manager, Role.admin]),
  ];

  fastify.get('/orders', { preHandler: staffGuard }, async (request, reply) => {
    const { outletId, status } = request.query as { outletId?: string; status?: OrderStatus };
    const effectiveOutletId = outletId || request.userPayload?.outletId;

    if (!effectiveOutletId) {
      return reply.status(400).send({ error: 'Missing outlet ID parameter' });
    }

    try {
      const orders = await StaffService.getOutletOrders(effectiveOutletId, status);
      return reply.send({ orders });
    } catch (err: any) {
      return reply.status(500).send({ error: 'Failed to fetch staff orders', message: err.message });
    }
  });

  fastify.patch('/orders/:id/status', { preHandler: staffGuard }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const parse = updateStatusSchema.safeParse(request.body);
    if (!parse.success) {
      return reply.status(400).send({ error: 'Invalid status', details: parse.error.format() });
    }

    try {
      const updated = await StaffService.updateOrderStatus(
        id,
        parse.data.status as OrderStatus,
        request.userPayload?.role === Role.admin ? undefined : (request.userPayload?.outletId || undefined)
      );
      return reply.send({ order: updated });
    } catch (err: any) {
      return reply.status(400).send({ error: 'Status update failed', message: err.message });
    }
  });

  fastify.post('/orders/:id/verify-pickup', { preHandler: staffGuard }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const parse = verifyOtpSchema.safeParse(request.body);
    if (!parse.success) {
      return reply.status(400).send({ error: 'Invalid OTP', details: parse.error.format() });
    }

    try {
      const completed = await StaffService.verifyPickupOtp(id, parse.data.otp);
      return reply.send({ order: completed, message: 'OTP verified, order marked completed!' });
    } catch (err: any) {
      return reply.status(400).send({ error: 'OTP verification failed', message: err.message });
    }
  });
};
