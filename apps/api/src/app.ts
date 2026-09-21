import fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import cookie from '@fastify/cookie';
import { setupAuth } from './plugins/auth.js';
import { connectPrisma } from './plugins/prisma.js';
import { config } from './config.js';

// Route modules
import { authRoutes } from './modules/auth/auth.routes.js';
import { outletsRoutes } from './modules/outlets/outlets.routes.js';
import { menuRoutes } from './modules/menu/menu.routes.js';
import { ordersRoutes } from './modules/orders/orders.routes.js';
import { paymentsRoutes } from './modules/payments/payments.routes.js';
import { loyaltyRoutes } from './modules/loyalty/loyalty.routes.js';
import { staffRoutes } from './modules/outlet-staff/staff.routes.js';
import { kitchenRoutes } from './modules/kitchen/kitchen.routes.js';
import { adminRoutes } from './modules/admin/admin.routes.js';

export async function buildApp(): Promise<FastifyInstance> {
  const app = fastify({
    logger: {
      level: process.env.NODE_ENV === 'test' ? 'silent' : 'info',
    },
  });

  // Security headers
  await app.register(helmet, {
    contentSecurityPolicy: false, // relaxed for local dev / API
  });

  // CORS configuration
  await app.register(cors, {
    origin: (origin, cb) => {
      if (!config.isProduction || !origin) {
        return cb(null, true);
      }
      const allowedOrigins = config.corsOrigin.split(',').map((o) => o.trim());
      if (allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
        return cb(null, true);
      }
      return cb(new Error('Not allowed by CORS'), false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  });

  // Cookies & Rate Limiting
  await app.register(cookie);
  await app.register(rateLimit, {
    max: 200,
    timeWindow: '1 minute',
  });

  // Auth setup (JWT)
  await setupAuth(app);

  // Health check
  app.get('/health', async () => {
    return {
      status: 'ok',
    };
  });

  app.get('/api/health', async () => {
    return {
      status: 'ok',
      service: 'uttara-api',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    };
  });

  // Mount business modules under /api
  await app.register(authRoutes, { prefix: '/api/auth' });
  await app.register(outletsRoutes, { prefix: '/api/outlets' });
  await app.register(menuRoutes, { prefix: '/api/menu' });
  await app.register(ordersRoutes, { prefix: '/api/orders' });
  await app.register(paymentsRoutes, { prefix: '/api/payments' });
  await app.register(loyaltyRoutes, { prefix: '/api/loyalty' });
  await app.register(staffRoutes, { prefix: '/api/staff' });
  await app.register(kitchenRoutes, { prefix: '/api/kitchen' });
  await app.register(adminRoutes, { prefix: '/api/admin' });

  // Centralized error handler
  app.setErrorHandler((error: any, request, reply) => {
    app.log.error(error);
    const statusCode = error.statusCode || 500;
    return reply.status(statusCode).send({
      error: error.name || 'InternalServerError',
      message: error.message || 'An unexpected error occurred',
      statusCode,
    });
  });

  return app;
}
