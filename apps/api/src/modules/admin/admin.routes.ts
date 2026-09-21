import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { z } from 'zod';
import { AdminService } from './admin.service.js';
import { requireRole } from '../../plugins/auth.js';
import { Role } from '@prisma/client';

const palyaSchema = z.object({
  palya1Name: z.string().min(2),
  palya1KannadaName: z.string().optional(),
  palya1Description: z.string().min(5),
  palya2Name: z.string().min(2),
  palya2KannadaName: z.string().optional(),
  palya2Description: z.string().min(5),
  outletId: z.string().optional(),
});

const outletCreateSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  code: z.string().min(2),
  address: z.string().min(5),
  locality: z.string().min(2),
  landmark: z.string().optional(),
  latitude: z.number(),
  longitude: z.number(),
  phone: z.string(),
  email: z.string().email(),
  opensAt: z.string().default('11:30'),
  closesAt: z.string().default('22:30'),
  averagePrepTimeMinutes: z.number().int().default(8),
});

export const adminRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  const adminGuard = [
    (fastify as any).authenticate,
    requireRole([Role.admin]),
  ];

  fastify.get('/dashboard', { preHandler: adminGuard }, async (request, reply) => {
    try {
      const metrics = await AdminService.getDashboardMetrics();
      return reply.send({ metrics });
    } catch (err: any) {
      return reply.status(500).send({ error: 'Failed to fetch admin metrics', message: err.message });
    }
  });

  fastify.post('/daily-palya', { preHandler: adminGuard }, async (request, reply) => {
    const parse = palyaSchema.safeParse(request.body);
    if (!parse.success) {
      return reply.status(400).send({ error: 'Invalid palya details', details: parse.error.format() });
    }

    try {
      const updated = await AdminService.updateDailyPalya(parse.data);
      return reply.send({ dailyMenu: updated, message: "Today's palyas updated successfully!" });
    } catch (err: any) {
      return reply.status(400).send({ error: 'Failed to update palya', message: err.message });
    }
  });

  fastify.post('/outlets', { preHandler: adminGuard }, async (request, reply) => {
    const parse = outletCreateSchema.safeParse(request.body);
    if (!parse.success) {
      return reply.status(400).send({ error: 'Invalid outlet data', details: parse.error.format() });
    }

    try {
      const outlet = await AdminService.createOutlet(parse.data);
      return reply.status(201).send({ outlet });
    } catch (err: any) {
      return reply.status(400).send({ error: 'Failed to create outlet', message: err.message });
    }
  });

  fastify.patch('/outlets/:id', { preHandler: adminGuard }, async (request, reply) => {
    const { id } = request.params as { id: string };
    try {
      const updated = await AdminService.updateOutlet(id, request.body as any);
      return reply.send({ outlet: updated });
    } catch (err: any) {
      return reply.status(400).send({ error: 'Failed to update outlet', message: err.message });
    }
  });

  fastify.get('/orders', { preHandler: adminGuard }, async (request, reply) => {
    try {
      const orders = await AdminService.listOrders();
      return reply.send({ orders });
    } catch (err: any) {
      return reply.status(500).send({ error: 'Failed to fetch orders', message: err.message });
    }
  });

  fastify.get('/coupons', { preHandler: adminGuard }, async (request, reply) => {
    try {
      const coupons = await AdminService.listCoupons();
      return reply.send({ coupons });
    } catch (err: any) {
      return reply.status(500).send({ error: 'Failed to fetch coupons', message: err.message });
    }
  });
};
