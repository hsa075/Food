export interface LoyaltyAccountDTO {
  userId: string;
  pointsBalance: number;
  lifetimePointsEarned: number;
  tier: 'ROTTI_LOVER' | 'OOTA_PATRON' | 'UTTARA_CHAMPION';
  nextRewardPointsNeeded: number;
  nextRewardDescription: string;
}

export interface LoyaltyTransactionDTO {
  id: string;
  orderId?: string | null;
  points: number;
  type: 'EARNED' | 'REDEEMED' | 'ADJUSTED';
  description: string;
  createdAt: string;
}
