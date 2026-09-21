import { PaymentGateway, IPaymentOrder } from './payment-gateway.interface.js';
import { PaymentInitiationResponse, PaymentVerificationDTO, PaymentVerificationResult } from '@uttara/shared';

export class MockPaymentProvider implements PaymentGateway {
  readonly providerName = 'MOCK';

  async createOrder(order: IPaymentOrder): Promise<PaymentInitiationResponse> {
    const mockPaymentId = `pay_mock_${order.orderNumber.toLowerCase()}_${Date.now()}`;
    return {
      paymentId: mockPaymentId,
      orderId: order.id,
      provider: 'MOCK',
      amount: order.totalAmount,
      currency: 'INR',
      providerOrderId: `order_mock_${order.orderNumber.toLowerCase()}`,
      mockDirectConfirm: true,
    };
  }

  async verifyPayment(dto: PaymentVerificationDTO): Promise<PaymentVerificationResult> {
    return {
      success: true,
      orderId: dto.orderId,
      paymentStatus: 'SUCCESS',
      message: 'Mock payment verified successfully',
    };
  }
}
