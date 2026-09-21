import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import fastifyJwt from '@fastify/jwt';
import { Role } from '@prisma/client';
import { prisma } from './prisma.js';
import { config } from '../config.js';
import crypto from 'crypto';

declare module 'fastify' {
  interface FastifyRequest {
    userPayload?: {
      userId: string;
      email: string;
      role: Role;
      outletId?: string | null;
    };
  }
}

export async function setupAuth(fastify: FastifyInstance) {
  await fastify.register(fastifyJwt, {
    secret: config.jwtSecret,
  });

  fastify.decorate('authenticate', async function (request: FastifyRequest, reply: FastifyReply) {
    try {
      const authHeader = request.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return reply.status(401).send({ error: 'Unauthorized', message: 'Missing or malformed Bearer token' });
      }
      const token = authHeader.substring(7);
      const decoded = fastify.jwt.verify<{ userId: string; email: string; role: Role; outletId?: string | null }>(token);
      request.userPayload = decoded;
    } catch (err) {
      return reply.status(401).send({ error: 'Unauthorized', message: 'Invalid or expired token' });
    }
  });
}

export function requireRole(allowedRoles: Role[]) {
  return async function (request: FastifyRequest, reply: FastifyReply) {
    const user = request.userPayload;
    if (!user) {
      return reply.status(401).send({ error: 'Unauthorized', message: 'Authentication required' });
    }
    if (!allowedRoles.includes(user.role)) {
      return reply.status(403).send({ 
        error: 'Forbidden', 
        message: `Role '${user.role}' does not have access to this resource` 
      });
    }
  };
}

export async function createAuthTokens(user: { id: string; email: string; role: Role; favoriteOutletId?: string | null }, fastify: FastifyInstance) {
  const payload = {
    userId: user.id,
    email: user.email,
    role: user.role,
    outletId: user.favoriteOutletId,
  };

  const accessToken = fastify.jwt.sign(payload, { expiresIn: '15m' });

  // Generate random 64-char refresh token
  const rawRefreshToken = crypto.randomBytes(40).toString('hex');
  const tokenHash = crypto.createHash('sha256').update(rawRefreshToken).digest('hex');

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30); // 30 days

  await prisma.refreshToken.create({
    data: {
      tokenHash,
      userId: user.id,
      expiresAt,
    },
  });

  return {
    accessToken,
    refreshToken: rawRefreshToken,
    expiresIn: 900, // 15 mins in seconds
  };
}

export async function rotateRefreshToken(rawRefreshToken: string, fastify: FastifyInstance) {
  const tokenHash = crypto.createHash('sha256').update(rawRefreshToken).digest('hex');

  const record = await prisma.refreshToken.findUnique({
    where: { tokenHash },
    include: { user: true },
  });

  if (!record || record.revokedAt || record.expiresAt < new Date()) {
    throw new Error('Invalid or expired refresh token');
  }

  // Revoke previous token
  await prisma.refreshToken.update({
    where: { id: record.id },
    data: { revokedAt: new Date() },
  });

  // Issue new pair
  return createAuthTokens(record.user, fastify);
}
