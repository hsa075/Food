import { prisma } from '../../plugins/prisma.js';
import { REDEEM_THRESHOLD_POINTS } from '@uttara/shared';

export class LoyaltyService {
  static async getAccount(userId: string) {
    let account = await prisma.loyaltyAccount.findUnique({
      where: { userId },
      include: {
        transactions: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!account) {
      account = await prisma.loyaltyAccount.create({
        data: {
          userId,
          pointsBalance: 0,
          lifetimePointsEarned: 0,
          tier: 'ROTTI_LOVER',
        },
        include: { transactions: true },
      });
    }

    const currentPoints = account.pointsBalance;
    const nextRewardPointsNeeded = Math.max(0, REDEEM_THRESHOLD_POINTS - currentPoints);
    const nextRewardDescription = 'Free North Karnataka Oota (worth ₹139)';

    return {
      userId: account.userId,
      pointsBalance: account.pointsBalance,
      lifetimePointsEarned: account.lifetimePointsEarned,
      tier: account.tier,
      nextRewardPointsNeeded,
      nextRewardDescription,
      transactions: account.transactions,
    };
  }
}
