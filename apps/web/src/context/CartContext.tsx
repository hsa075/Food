'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { PriceBreakdown, OrderType, BASE_OOTA_PRICE, PACKAGING_FEE, GST_RATE } from '@uttara/shared';
import { fetchApi } from '../lib/api';

interface CartContextType {
  quantity: number;
  orderType: OrderType;
  couponCode: string;
  pricing: PriceBreakdown;
  isCalculating: boolean;
  totalItems: number;
  setQuantity: (qty: number) => void;
  incrementQuantity: () => void;
  decrementQuantity: () => void;
  setOrderType: (type: OrderType) => void;
  applyCoupon: (code: string) => Promise<boolean>;
  removeCoupon: () => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [quantity, setQuantityState] = useState(1);
  const [orderType, setOrderType] = useState<OrderType>('TAKEAWAY');
  const [couponCode, setCouponCode] = useState('');
  const [isCalculating, setIsCalculating] = useState(false);

  // Local fallback price calculation
  const calculateLocalPrice = (qty: number, type: OrderType, coupon?: string): PriceBreakdown => {
    const unitPrice = BASE_OOTA_PRICE;
    const subtotal = unitPrice * qty;
    const packagingFee = type === 'TAKEAWAY' ? PACKAGING_FEE * qty : 0;
    let discountAmount = 0;
    let couponApplied: string | null = null;

    if (coupon?.toUpperCase() === 'UTTARA50' && subtotal >= 250) {
      discountAmount = 50;
      couponApplied = 'UTTARA50';
    } else if (coupon?.toUpperCase() === 'FIRSTOOTA') {
      discountAmount = Math.min(60, subtotal * 0.2);
      couponApplied = 'FIRSTOOTA';
    }

    const taxable = Math.max(0, subtotal - discountAmount);
    const taxAmount = Math.round(taxable * GST_RATE * 100) / 100;
    const totalAmount = Math.round((taxable + packagingFee + taxAmount) * 100) / 100;

    return {
      quantity: qty,
      unitPrice,
      subtotal,
      discountAmount,
      packagingFee,
      taxAmount,
      totalAmount,
      couponApplied,
    };
  };

  const [pricing, setPricing] = useState<PriceBreakdown>(() => calculateLocalPrice(1, 'TAKEAWAY'));

  // Calculate pricing when state changes
  useEffect(() => {
    let isCurrent = true;
    setIsCalculating(true);

    fetchApi<{ breakdown: PriceBreakdown }>('/api/orders/calculate', {
      method: 'POST',
      body: JSON.stringify({
        quantity,
        orderType,
        couponCode: couponCode || undefined,
      }),
    })
      .then((res) => {
        if (isCurrent) {
          setPricing(res.breakdown);
        }
      })
      .catch(() => {
        if (isCurrent) {
          setPricing(calculateLocalPrice(quantity, orderType, couponCode));
        }
      })
      .finally(() => {
        if (isCurrent) setIsCalculating(false);
      });

    return () => {
      isCurrent = false;
    };
  }, [quantity, orderType, couponCode]);

  const setQuantity = (qty: number) => {
    if (qty >= 1 && qty <= 30) {
      setQuantityState(qty);
    }
  };

  const incrementQuantity = () => {
    setQuantityState((prev) => Math.min(prev + 1, 30));
  };

  const decrementQuantity = () => {
    setQuantityState((prev) => Math.max(prev - 1, 1));
  };

  const applyCoupon = async (code: string): Promise<boolean> => {
    const trimmed = code.trim().toUpperCase();
    try {
      const res = await fetchApi<{ breakdown: PriceBreakdown }>('/api/orders/calculate', {
        method: 'POST',
        body: JSON.stringify({
          quantity,
          orderType,
          couponCode: trimmed,
        }),
      });

      if (res.breakdown.couponApplied) {
        setCouponCode(trimmed);
        setPricing(res.breakdown);
        return true;
      }
      return false;
    } catch {
      // Local check
      const local = calculateLocalPrice(quantity, orderType, trimmed);
      if (local.couponApplied) {
        setCouponCode(trimmed);
        setPricing(local);
        return true;
      }
      return false;
    }
  };

  const removeCoupon = () => {
    setCouponCode('');
  };

  const clearCart = () => {
    setQuantityState(1);
    setCouponCode('');
  };

  return (
    <CartContext.Provider
      value={{
        quantity,
        orderType,
        couponCode,
        pricing,
        isCalculating,
        totalItems: quantity,
        setQuantity,
        incrementQuantity,
        decrementQuantity,
        setOrderType,
        applyCoupon,
        removeCoupon,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};
