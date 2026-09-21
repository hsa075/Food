export type PaymentProvider = 'RAZORPAY' | 'MOCK';

export type PaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED' | 'REFUNDED';

export interface PaymentInitiationDTO {
  orderId: string;
  provider?: PaymentProvider;
}

export interface PaymentInitiationResponse {
  paymentId: string;
  orderId: string;
  provider: PaymentProvider;
  amount: number;
  currency: string;
  keyId?: string; // Razorpay public key ID if applicable
  providerOrderId?: string;
  mockDirectConfirm?: boolean;
}

export interface PaymentVerificationDTO {
  orderId: string;
  paymentId: string;
  provider: PaymentProvider;
  providerPaymentId?: string;
  providerOrderId?: string;
  providerSignature?: string;
}

export interface PaymentVerificationResult {
  success: boolean;
  orderId: string;
  paymentStatus: PaymentStatus;
  message: string;
}
