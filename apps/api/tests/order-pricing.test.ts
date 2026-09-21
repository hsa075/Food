import test, { describe } from 'node:test';
import assert from 'node:assert/strict';
import { OrdersService } from '../src/modules/orders/orders.service.js';
import { MockPaymentProvider } from '../src/modules/payments/mock-payment.provider.js';
import { RazorpayPaymentProvider } from '../src/modules/payments/razorpay-payment.provider.js';
import crypto from 'crypto';

describe('Order Pricing Logic', () => {
  test('calculates correct total for 1 Takeaway Oota without coupon', async () => {
    const breakdown = await OrdersService.calculatePrice(1, 'TAKEAWAY');
    // Unit price: 139
    // Subtotal: 139
    // Packaging fee: 15
    // Taxable: 139 -> 5% GST: 6.95
    // Total: 139 + 15 + 6.95 = 160.95
    assert.equal(breakdown.quantity, 1);
    assert.equal(breakdown.unitPrice, 139);
    assert.equal(breakdown.subtotal, 139);
    assert.equal(breakdown.packagingFee, 15);
    assert.equal(breakdown.taxAmount, 6.95);
    assert.equal(breakdown.totalAmount, 160.95);
  });

  test('calculates correct total for Dine-in (zero packaging fee)', async () => {
    const breakdown = await OrdersService.calculatePrice(2, 'DINE_IN');
    // Subtotal: 278
    // Packaging fee: 0
    // Tax: 278 * 0.05 = 13.9
    // Total: 278 + 13.9 = 291.9
    assert.equal(breakdown.quantity, 2);
    assert.equal(breakdown.packagingFee, 0);
    assert.equal(breakdown.subtotal, 278);
    assert.equal(breakdown.taxAmount, 13.9);
    assert.equal(breakdown.totalAmount, 291.9);
  });

  test('applies flat discount coupon correctly', async () => {
    // 2 Takeaway Ootas with UTTARA50 (flat ₹50 off on orders >= 250)
    const breakdown = await OrdersService.calculatePrice(2, 'TAKEAWAY', 'UTTARA50');
    assert.equal(breakdown.subtotal, 278);
    assert.equal(breakdown.discountAmount, 50);
    // Taxable: 278 - 50 = 228 -> 5% = 11.4
    assert.equal(breakdown.taxAmount, 11.4);
    // Packaging fee: 30
    // Total: 228 + 30 + 11.4 = 269.4
    assert.equal(breakdown.totalAmount, 269.4);
    assert.equal(breakdown.couponApplied, 'UTTARA50');
  });

  test('rejects invalid quantities', async () => {
    await assert.rejects(
      async () => OrdersService.calculatePrice(0, 'TAKEAWAY'),
      /Quantity must be between 1 and 50/
    );
    await assert.rejects(
      async () => OrdersService.calculatePrice(55, 'TAKEAWAY'),
      /Quantity must be between 1 and 50/
    );
  });
});

describe('Payment Abstraction Layer', () => {
  test('Mock payment provider generates instant confirm response', async () => {
    const mockProvider = new MockPaymentProvider();
    const order = {
      id: 'mock-order-id-123',
      orderNumber: 'UTT-9999',
      totalAmount: 160.95,
      customerName: 'Test Customer',
      customerPhone: '+91 99999 88888',
    };

    const res = await mockProvider.createOrder(order);
    assert.equal(res.provider, 'MOCK');
    assert.equal(res.mockDirectConfirm, true);
    assert.equal(res.amount, 160.95);

    const verification = await mockProvider.verifyPayment({
      orderId: order.id,
      paymentId: res.paymentId,
      provider: 'MOCK',
    });
    assert.equal(verification.success, true);
    assert.equal(verification.paymentStatus, 'SUCCESS');
  });

  test('Razorpay provider verifies HMAC SHA-256 signature', async () => {
    const razorpayProvider = new RazorpayPaymentProvider();
    const orderId = 'test-order-uuid';
    const providerOrderId = 'order_rzp_utt_1001';
    const providerPaymentId = 'pay_rzp_mock_payment_123';
    const secret = 'rzp_test_secret_uttara_456';

    const validSignature = crypto
      .createHmac('sha256', secret)
      .update(`${providerOrderId}|${providerPaymentId}`)
      .digest('hex');

    const successResult = await razorpayProvider.verifyPayment({
      orderId,
      paymentId: 'pay-1',
      provider: 'RAZORPAY',
      providerOrderId,
      providerPaymentId,
      providerSignature: validSignature,
    });
    assert.equal(successResult.success, true);

    const invalidResult = await razorpayProvider.verifyPayment({
      orderId,
      paymentId: 'pay-1',
      provider: 'RAZORPAY',
      providerOrderId,
      providerPaymentId,
      providerSignature: 'invalid_forged_signature',
    });
    assert.equal(invalidResult.success, false);
  });
});
