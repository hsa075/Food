import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { z } from 'zod';
import { OrdersService } from './orders.service.js';

const calculateSchema = z.object({
  quantity: z.number().int().min(1).max(50),
  orderType: z.enum(['TAKEAWAY', 'DINE_IN']),
  couponCode: z.string().optional(),
});

const createOrderSchema = z.object({
  outletId: z.string().uuid(),
  quantity: z.number().int().min(1).max(50),
  orderType: z.enum(['TAKEAWAY', 'DINE_IN']),
  couponCode: z.string().optional(),
  customerName: z.string().min(2),
  customerPhone: z.string().min(10).max(15),
  customerEmail: z.string().email().optional(),
  notes: z.string().max(200).optional(),
});

export const ordersRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  // Price preview
  fastify.post('/calculate', async (request, reply) => {
    const parse = calculateSchema.safeParse(request.body);
    if (!parse.success) {
      return reply.status(400).send({ error: 'Invalid input', details: parse.error.format() });
    }

    try {
      const breakdown = await OrdersService.calculatePrice(
        parse.data.quantity,
        parse.data.orderType,
        parse.data.couponCode
      );
      return reply.send({ breakdown });
    } catch (err: any) {
      return reply.status(400).send({ error: 'Calculation error', message: err.message });
    }
  });

  // Create order (optional auth: guests or logged in users)
  fastify.post('/', async (request, reply) => {
    // Check if optional token is present
    let userId: string | undefined;
    const authHeader = request.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const token = authHeader.substring(7);
        const decoded = (fastify as any).jwt.verify(token);
        userId = decoded.userId;
      } catch (e) {
        // Continue as guest if token invalid
      }
    }

    const parse = createOrderSchema.safeParse(request.body);
    if (!parse.success) {
      return reply.status(400).send({ error: 'Validation failed', details: parse.error.format() });
    }

    try {
      const order = await OrdersService.createOrder(parse.data, userId);
      return reply.status(201).send({ order });
    } catch (err: any) {
      return reply.status(400).send({ error: 'Order creation failed', message: err.message });
    }
  });

  // Get my orders
  fastify.get('/my-orders', { preHandler: [(fastify as any).authenticate] }, async (request, reply) => {
    const userId = request.userPayload?.userId;
    if (!userId) {
      return reply.status(401).send({ error: 'Unauthorized' });
    }

    try {
      const orders = await OrdersService.getMyOrders(userId);
      return reply.send({ orders });
    } catch (err: any) {
      return reply.status(500).send({ error: 'Failed to fetch orders', message: err.message });
    }
  });

  // Get order by id or number (tracking)
  fastify.get('/:idOrNumber', async (request, reply) => {
    const { idOrNumber } = request.params as { idOrNumber: string };
    try {
      const order = await OrdersService.getOrderById(idOrNumber);
      return reply.send({ order });
    } catch (err: any) {
      return reply.status(404).send({ error: 'Order not found', message: err.message });
    }
  });

  // Cancel order
  fastify.post('/:id/cancel', async (request, reply) => {
    const { id } = request.params as { id: string };
    let userId: string | undefined;
    const authHeader = request.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const token = authHeader.substring(7);
        const decoded = (fastify as any).jwt.verify(token);
        userId = decoded.userId;
      } catch (e) {
        // ignore
      }
    }

    try {
      const order = await OrdersService.cancelOrder(id, userId);
      return reply.send({ order });
    } catch (err: any) {
      return reply.status(400).send({ error: 'Cancellation failed', message: err.message });
    }
  });
};
