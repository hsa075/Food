import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { z } from 'zod';
import { PaymentsService } from './payments.service.js';

const initiateSchema = z.object({
  orderId: z.string().uuid(),
  provider: z.enum(['RAZORPAY', 'MOCK']).optional(),
});

const verifySchema = z.object({
  orderId: z.string().uuid(),
  paymentId: z.string().min(1),
  provider: z.enum(['RAZORPAY', 'MOCK']),
  providerPaymentId: z.string().optional(),
  providerOrderId: z.string().optional(),
  providerSignature: z.string().optional(),
});

export const paymentsRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  fastify.post('/create', async (request, reply) => {
    const parse = initiateSchema.safeParse(request.body);
    if (!parse.success) {
      return reply.status(400).send({ error: 'Invalid input', details: parse.error.format() });
    }

    try {
      const response = await PaymentsService.initiatePayment(parse.data);
      return reply.send(response);
    } catch (err: any) {
      return reply.status(400).send({ error: 'Payment initiation failed', message: err.message });
    }
  });

  fastify.post('/verify', async (request, reply) => {
    const parse = verifySchema.safeParse(request.body);
    if (!parse.success) {
      return reply.status(400).send({ error: 'Invalid input', details: parse.error.format() });
    }

    try {
      const result = await PaymentsService.verifyPayment(parse.data);
      return reply.send(result);
    } catch (err: any) {
      return reply.status(400).send({ error: 'Payment verification failed', message: err.message });
    }
  });
};
