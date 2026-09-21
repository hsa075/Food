import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
});

export async function connectPrisma() {
  try {
    await prisma.$connect();
    console.log('✓ Connected to PostgreSQL database');
  } catch (error) {
    console.error('Database connection error:', error);
    throw error;
  }
}

export async function disconnectPrisma() {
  await prisma.$disconnect();
}
