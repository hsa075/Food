import { PaymentInitiationResponse, PaymentVerificationDTO, PaymentVerificationResult } from '@uttara/shared';

export interface IPaymentOrder {
  id: string;
  orderNumber: string;
  totalAmount: number;
  customerName: string;
  customerPhone: string;
  customerEmail?: string | null;
}

export interface PaymentGateway {
  readonly providerName: string;
  createOrder(order: IPaymentOrder): Promise<PaymentInitiationResponse>;
  verifyPayment(dto: PaymentVerificationDTO): Promise<PaymentVerificationResult>;
}
