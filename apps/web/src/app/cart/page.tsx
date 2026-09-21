'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingBag, ArrowRight, Tag, MapPin, CheckCircle2, ShieldCheck, Utensils } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { QuantitySelector } from '../../components/ui/QuantitySelector';
import { PriceDisplay } from '../../components/ui/PriceDisplay';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/Toast';
import { fetchApi } from '../../lib/api';

export default function CartPage() {
  const router = useRouter();
  const {
    quantity,
    orderType,
    pricing,
    setOrderType,
    incrementQuantity,
    decrementQuantity,
    applyCoupon,
    removeCoupon,
    clearCart,
  } = useCart();
  const { user, selectedOutlet } = useAuth();
  const { showToast } = useToast();

  const [couponInput, setCouponInput] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [customerName, setCustomerName] = useState(user?.name || '');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'MOCK' | 'RAZORPAY'>('MOCK');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput) return;

    setIsApplyingCoupon(true);
    const success = await applyCoupon(couponInput);
    setIsApplyingCoupon(false);

    if (success) {
      showToast(`Coupon ${couponInput.toUpperCase()} applied!`, 'success');
      setCouponInput('');
    } else {
      showToast('Invalid coupon or minimum order value not met', 'error');
    }
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName || customerName.trim().length < 2) {
      showToast('Please enter your name', 'error');
      return;
    }

    if (!customerPhone || customerPhone.trim().length < 10) {
      showToast('Please enter a valid 10-digit phone number', 'error');
      return;
    }

    let targetOutletId = selectedOutlet?.id;
    if (!targetOutletId) {
      try {
        const outletsRes = await fetchApi<{ outlets: any[] }>('/api/outlets');
        if (outletsRes.outlets && outletsRes.outlets.length > 0) {
          targetOutletId = outletsRes.outlets[0].id;
        }
      } catch (e) {
        // ignore
      }
    }

    if (!targetOutletId) {
      showToast('Please select a pickup outlet from the Outlets page', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Create order
      const orderRes = await fetchApi<{ order: any }>('/api/orders', {
        method: 'POST',
        body: JSON.stringify({
          outletId: targetOutletId,
          quantity,
          orderType,
          couponCode: pricing.couponApplied || undefined,
          customerName: customerName.trim(),
          customerPhone: customerPhone.trim(),
          notes: notes.trim() || undefined,
        }),
      });

      const createdOrder = orderRes.order;

      // 2. Initiate payment
      const paymentInit = await fetchApi<any>('/api/payments/create', {
        method: 'POST',
        body: JSON.stringify({
          orderId: createdOrder.id,
          provider: paymentMethod,
        }),
      });

      // 3. Verify payment (Mock verification handles instant test confirmation)
      await fetchApi<any>('/api/payments/verify', {
        method: 'POST',
        body: JSON.stringify({
          orderId: createdOrder.id,
          paymentId: paymentInit.paymentId,
          provider: paymentMethod,
          providerPaymentId: `pay_direct_${Date.now()}`,
          providerOrderId: paymentInit.providerOrderId,
        }),
      });

      clearCart();
      showToast('Order confirmed successfully!', 'success');
      router.push(`/orders/${createdOrder.id}`);
    } catch (err: any) {
      showToast(err.message || 'Failed to complete order', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-uttara-cream-border">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-uttara-charcoal tracking-tight">
            Order Review
          </h1>
          <p className="text-xs text-uttara-charcoal-muted mt-0.5">
            Express counter takeaway from {selectedOutlet?.name || 'Uttara Indiranagar'}
          </p>
        </div>

        <Link href="/outlets" className="text-xs text-uttara-terracotta hover:underline font-medium">
          Change Outlet
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Items and Customer Information */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Order Type Toggle */}
          <div className="bg-uttara-cream p-1.5 rounded-brand flex gap-1 border border-uttara-cream-border">
            <button
              type="button"
              onClick={() => setOrderType('TAKEAWAY')}
              className={`flex-1 py-2 px-3 text-xs font-semibold rounded-md transition-all ${
                orderType === 'TAKEAWAY'
                  ? 'bg-white text-uttara-terracotta shadow-xs'
                  : 'text-uttara-charcoal-muted hover:text-uttara-charcoal'
              }`}
            >
              Takeaway Counter (₹15 pack/meal)
            </button>
            <button
              type="button"
              onClick={() => setOrderType('DINE_IN')}
              className={`flex-1 py-2 px-3 text-xs font-semibold rounded-md transition-all ${
                orderType === 'DINE_IN'
                  ? 'bg-white text-uttara-terracotta shadow-xs'
                  : 'text-uttara-charcoal-muted hover:text-uttara-charcoal'
              }`}
            >
              Dine-In Plate (No pack fee)
            </button>
          </div>

          {/* Cart Item Row */}
          <Card className="p-5">
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-uttara-cream-border">
              <div>
                <span className="text-[11px] font-semibold text-uttara-terracotta uppercase tracking-wider">
                  Full Meal Platter
                </span>
                <h3 className="text-base font-serif font-bold text-uttara-charcoal">
                  North Karnataka Oota
                </h3>
                <p className="text-xs text-uttara-charcoal-muted mt-0.5">
                  3 Rotti • 2 Palyas (Yennegayi & Hesaru Kalu) • Rice • Sambar • Chutney Pudi • Curd
                </p>
              </div>

              <div className="text-right">
                <PriceDisplay amount={pricing.unitPrice} size="sm" />
                <div className="text-[10px] text-uttara-charcoal-muted">per meal</div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4">
              <span className="text-xs font-medium text-uttara-charcoal">Quantity</span>
              <QuantitySelector
                quantity={quantity}
                onIncrement={incrementQuantity}
                onDecrement={decrementQuantity}
                size="md"
              />
            </div>
          </Card>

          {/* Customer Pickup Details Form */}
          <Card className="p-5">
            <h3 className="text-sm font-serif font-bold text-uttara-charcoal mb-4">
              Contact & Pickup Details
            </h3>

            <div className="space-y-4">
              <Input
                label="Your Full Name"
                placeholder="e.g. Hemanth Kumar"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                required
              />

              <Input
                label="Mobile Phone (for pickup OTP SMS)"
                placeholder="e.g. 9880123456"
                type="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                required
              />

              <Input
                label="Special Instructions (Optional)"
                placeholder="e.g. Please add extra Shenga Pudi, mild spice"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </Card>

          {/* Payment Method Selector */}
          <Card className="p-5">
            <h3 className="text-sm font-serif font-bold text-uttara-charcoal mb-3">
              Payment Gateway
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <label
                className={`flex items-center gap-3 p-3.5 border rounded-brand cursor-pointer transition-all ${
                  paymentMethod === 'MOCK'
                    ? 'border-uttara-terracotta bg-uttara-terracotta-faint/40'
                    : 'border-uttara-cream-border hover:bg-uttara-cream/50'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="MOCK"
                  checked={paymentMethod === 'MOCK'}
                  onChange={() => setPaymentMethod('MOCK')}
                  className="accent-uttara-terracotta"
                />
                <div>
                  <div className="text-xs font-bold text-uttara-charcoal">Instant Simulated UPI</div>
                  <div className="text-[10px] text-uttara-charcoal-muted">Immediate test verification</div>
                </div>
              </label>

              <label
                className={`flex items-center gap-3 p-3.5 border rounded-brand cursor-pointer transition-all ${
                  paymentMethod === 'RAZORPAY'
                    ? 'border-uttara-terracotta bg-uttara-terracotta-faint/40'
                    : 'border-uttara-cream-border hover:bg-uttara-cream/50'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="RAZORPAY"
                  checked={paymentMethod === 'RAZORPAY'}
                  onChange={() => setPaymentMethod('RAZORPAY')}
                  className="accent-uttara-terracotta"
                />
                <div>
                  <div className="text-xs font-bold text-uttara-charcoal">Razorpay Gateway</div>
                  <div className="text-[10px] text-uttara-charcoal-muted">UPI / Cards / NetBanking</div>
                </div>
              </label>
            </div>
          </Card>
        </div>

        {/* Right Column: Pricing Breakdown & Coupons */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Coupon Code Box */}
          <Card className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <Tag className="w-4 h-4 text-uttara-ochre-dark" />
              <span className="text-xs font-bold uppercase tracking-wider text-uttara-charcoal">
                Offers & Promo Codes
              </span>
            </div>

            {pricing.couponApplied ? (
              <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-200 rounded-brand text-xs">
                <div>
                  <span className="font-bold text-emerald-800">{pricing.couponApplied}</span>
                  <div className="text-emerald-700 text-[11px]">₹{pricing.discountAmount} discount applied</div>
                </div>
                <button
                  type="button"
                  onClick={removeCoupon}
                  className="text-xs text-rose-600 hover:underline font-semibold"
                >
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <Input
                  placeholder="Code (e.g. UTTARA50)"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  className="uppercase text-xs"
                />
                <Button
                  type="submit"
                  size="sm"
                  variant="outline"
                  isLoading={isApplyingCoupon}
                  className="shrink-0"
                >
                  Apply
                </Button>
              </form>
            )}

            <div className="mt-3 pt-3 border-t border-uttara-cream-border/60 flex items-center justify-between text-[11px] text-uttara-charcoal-muted">
              <span>Try code: <strong className="text-uttara-charcoal">UTTARA50</strong> (₹50 off ₹250+)</span>
            </div>
          </Card>

          {/* Bill Summary */}
          <Card className="p-5 bg-white shadow-card">
            <h3 className="text-sm font-serif font-bold text-uttara-charcoal pb-3 mb-3 border-b border-uttara-cream-border">
              Bill Details
            </h3>

            <div className="space-y-2.5 text-xs text-uttara-charcoal">
              <div className="flex justify-between">
                <span className="text-uttara-charcoal-muted">Item Total ({pricing.quantity}x Oota)</span>
                <span>₹{pricing.subtotal.toFixed(2)}</span>
              </div>

              {pricing.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Coupon Discount</span>
                  <span>-₹{pricing.discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="text-uttara-charcoal-muted">
                  Packaging Fee {orderType === 'DINE_IN' ? '(Dine-In waived)' : ''}
                </span>
                <span>₹{pricing.packagingFee.toFixed(2)}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-uttara-charcoal-muted">Taxes (5% GST)</span>
                <span>₹{pricing.taxAmount.toFixed(2)}</span>
              </div>

              <div className="pt-3 mt-3 border-t border-uttara-cream-border flex justify-between items-baseline">
                <span className="text-base font-bold text-uttara-charcoal">To Pay</span>
                <PriceDisplay amount={pricing.totalAmount} size="lg" />
              </div>
            </div>

            <div className="mt-6">
              <Button
                size="lg"
                fullWidth
                onClick={handleCheckout}
                isLoading={isSubmitting}
                className="shadow-lifted"
              >
                <span>Pay ₹{pricing.totalAmount.toFixed(0)} & Place Order</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </div>

            <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-uttara-charcoal-muted">
              <ShieldCheck className="w-3.5 h-3.5 text-uttara-green" />
              <span>Safe & Secure 256-bit Encrypted Checkout</span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
