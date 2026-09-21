import { prisma } from '../../plugins/prisma.js';
import bcrypt from 'bcryptjs';
import { Role } from '@prisma/client';
import { RegisterDTO, LoginDTO } from '@uttara/shared';

export class AuthService {
  static async registerCustomer(dto: RegisterDTO) {
    const existingEmail = await prisma.user.findUnique({ where: { email: dto.email } });
    if (existingEmail) {
      throw new Error('Email is already registered');
    }

    const existingPhone = await prisma.user.findUnique({ where: { phone: dto.phone } });
    if (existingPhone) {
      throw new Error('Phone number is already registered');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const user = await prisma.user.create({
      data: {
        email: dto.email,
        phone: dto.phone,
        name: dto.name,
        passwordHash,
        role: Role.customer,
        favoriteOutletId: dto.favoriteOutletId || null,
      },
    });

    // Automatically create loyalty account with welcome points
    await prisma.loyaltyAccount.create({
      data: {
        userId: user.id,
        pointsBalance: 50, // Welcome bonus
        lifetimePointsEarned: 50,
        tier: 'ROTTI_LOVER',
        transactions: {
          create: {
            points: 50,
            type: 'EARNED',
            description: 'Welcome bonus on sign up',
          },
        },
      },
    });

    return user;
  }

  static async authenticateUser(dto: LoginDTO) {
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: dto.emailOrPhone },
          { phone: dto.emailOrPhone },
        ],
      },
      include: {
        loyaltyAccount: true,
      },
    });

    if (!user) {
      throw new Error('Invalid email/phone or password');
    }

    const isValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isValid) {
      throw new Error('Invalid email/phone or password');
    }

    return user;
  }

  static async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        loyaltyAccount: true,
        favoriteOutlet: true,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return {
      id: user.id,
      email: user.email,
      phone: user.phone,
      name: user.name,
      role: user.role,
      favoriteOutletId: user.favoriteOutletId,
      favoriteOutlet: user.favoriteOutlet,
      loyaltyPoints: user.loyaltyAccount?.pointsBalance ?? 0,
      loyaltyTier: user.loyaltyAccount?.tier ?? 'ROTTI_LOVER',
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  }
}
