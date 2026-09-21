import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { LoyaltyService } from './loyalty.service.js';

export const loyaltyRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  fastify.get('/', { preHandler: [(fastify as any).authenticate] }, async (request, reply) => {
    const userId = request.userPayload?.userId;
    if (!userId) {
      return reply.status(401).send({ error: 'Unauthorized' });
    }

    try {
      const account = await LoyaltyService.getAccount(userId);
      return reply.send({ loyalty: account });
    } catch (err: any) {
      return reply.status(500).send({ error: 'Failed to fetch loyalty account', message: err.message });
    }
  });
};
