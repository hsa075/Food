import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { OutletsService } from './outlets.service.js';

export const outletsRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  fastify.get('/', async (request, reply) => {
    const { lat, lng, q } = request.query as { lat?: string; lng?: string; q?: string };
    const userLat = lat ? parseFloat(lat) : undefined;
    const userLng = lng ? parseFloat(lng) : undefined;

    try {
      const outlets = await OutletsService.listOutlets(userLat, userLng, q);
      return reply.send({ outlets });
    } catch (err: any) {
      return reply.status(500).send({ error: 'Failed to fetch outlets', message: err.message });
    }
  });

  fastify.get('/:idOrSlug', async (request, reply) => {
    const { idOrSlug } = request.params as { idOrSlug: string };
    try {
      const outlet = await OutletsService.getOutlet(idOrSlug);
      return reply.send({ outlet });
    } catch (err: any) {
      return reply.status(404).send({ error: 'Outlet not found', message: err.message });
    }
  });
};
