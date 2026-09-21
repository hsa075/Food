import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { z } from 'zod';
import { AuthService } from './auth.service.js';
import { createAuthTokens, rotateRefreshToken } from '../../plugins/auth.js';

const registerSchema = z.object({
  email: z.string().email(),
  phone: z.string().min(10).max(15),
  name: z.string().min(2),
  password: z.string().min(6),
  favoriteOutletId: z.string().optional(),
});

const loginSchema = z.object({
  emailOrPhone: z.string().min(3),
  password: z.string().min(1),
});

const refreshSchema = z.object({
  refreshToken: z.string().min(10),
});

export const authRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  // Register
  fastify.post('/register', async (request, reply) => {
    const parseResult = registerSchema.safeParse(request.body);
    if (!parseResult.success) {
      return reply.status(400).send({ error: 'Validation failed', details: parseResult.error.format() });
    }

    try {
      const user = await AuthService.registerCustomer(parseResult.data);
      const tokens = await createAuthTokens(user, fastify);
      const profile = await AuthService.getProfile(user.id);
      return reply.status(201).send({ user: profile, tokens });
    } catch (err: any) {
      return reply.status(400).send({ error: 'Registration failed', message: err.message });
    }
  });

  // Login
  fastify.post('/login', async (request, reply) => {
    const parseResult = loginSchema.safeParse(request.body);
    if (!parseResult.success) {
      return reply.status(400).send({ error: 'Validation failed', details: parseResult.error.format() });
    }

    try {
      const user = await AuthService.authenticateUser(parseResult.data);
      const tokens = await createAuthTokens(user, fastify);
      const profile = await AuthService.getProfile(user.id);
      return reply.send({ user: profile, tokens });
    } catch (err: any) {
      return reply.status(401).send({ error: 'Authentication failed', message: err.message });
    }
  });

  // Refresh
  fastify.post('/refresh', async (request, reply) => {
    const parseResult = refreshSchema.safeParse(request.body);
    if (!parseResult.success) {
      return reply.status(400).send({ error: 'Validation failed', details: parseResult.error.format() });
    }

    try {
      const tokens = await rotateRefreshToken(parseResult.data.refreshToken, fastify);
      return reply.send({ tokens });
    } catch (err: any) {
      return reply.status(401).send({ error: 'Refresh failed', message: err.message });
    }
  });

  // Current User Profile
  fastify.get('/me', { preHandler: [(fastify as any).authenticate] }, async (request, reply) => {
    const user = request.userPayload;
    if (!user) {
      return reply.status(401).send({ error: 'Unauthorized' });
    }

    try {
      const profile = await AuthService.getProfile(user.userId);
      return reply.send({ user: profile });
    } catch (err: any) {
      return reply.status(404).send({ error: 'User not found', message: err.message });
    }
  });
};
