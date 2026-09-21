import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { MenuService } from './menu.service.js';

export const menuRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  fastify.get('/today', async (request, reply) => {
    const { outletId } = request.query as { outletId?: string };
    try {
      const menu = await MenuService.getTodayMenu(outletId);
      return reply.send({ menu });
    } catch (err: any) {
      return reply.status(500).send({ error: 'Failed to fetch menu', message: err.message });
    }
  });

  fastify.get('/outlets/:outletId', async (request, reply) => {
    const { outletId } = request.params as { outletId: string };
    try {
      const menu = await MenuService.getTodayMenu(outletId);
      return reply.send({ menu });
    } catch (err: any) {
      return reply.status(500).send({ error: 'Failed to fetch menu', message: err.message });
    }
  });
};
