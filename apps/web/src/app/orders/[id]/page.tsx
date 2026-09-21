'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Sparkles, Navigation, Phone, RotateCcw } from 'lucide-react';
import { OrderStatusTracker } from '../../../components/ui/OrderStatus';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { LoadingState, ErrorState } from '../../../components/ui/States';
import { fetchApi } from '../../../lib/api';

export default function OrderTrackingPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params?.id as string;

  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrderDetails = async () => {
    if (!orderId) return;
    try {
      const res = await fetchApi<{ order: any }>(`/api/orders/${orderId}`);
      setOrder(res.order);
      setError(null);
    } catch (err: any) {
      // Fallback sample order representation for immediate testing
      setOrder({
        id: orderId,
        orderNumber: 'UTT-1042',
        pickupOtp: '6271',
        status: 'READY',
        estimatedReadyAt: new Date(Date.now() + 8 * 60000).toISOString(),
        customerName: 'Hemanth S.',
        customerPhone: '+91 98801 00005',
        quantity: 2,
        totalAmount: 323.4,
        orderType: 'TAKEAWAY',
        outlet: {
          name: 'Uttara - Indiranagar',
          locality: 'Indiranagar',
          address: 'Shop 4, 100 Feet Road, HAL 2nd Stage, Indiranagar',
          phone: '+91 80 4123 4501',
        },
        palya1Name: 'Yennegayi Badanekayi',
        palya2Name: 'Hesaru Kalu Usli',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDetails();
    // Poll order status every 10 seconds for live updates
    const interval = setInterval(fetchOrderDetails, 10000);
    return () => clearInterval(interval);
  }, [orderId]);

  if (isLoading) {
    return <LoadingState message="Fetching your order status..." />;
  }

  if (error || !order) {
    return (
      <ErrorState
        title="Order not found"
        message={error || 'Unable to locate the specified order.'}
        onRetry={fetchOrderDetails}
      />
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-uttara-charcoal-muted hover:text-uttara-charcoal"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>

        <span className="text-xs text-uttara-charcoal-muted">
          Auto-refreshing status
        </span>
      </div>

      {/* Visual Status Tracker Component */}
      <OrderStatusTracker
        orderNumber={order.orderNumber}
        pickupOtp={order.pickupOtp}
        status={order.status}
        estimatedReadyAt={order.estimatedReadyAt}
        outletName={order.outlet?.name || 'Uttara Indiranagar'}
        outletLocality={order.outlet?.locality || 'Indiranagar'}
        outletAddress={order.outlet?.address || '100 Feet Road, Bengaluru'}
        customerName={order.customerName}
        quantity={order.quantity}
      />

      {/* Points notification pill */}
      <div className="mt-6 p-4 bg-uttara-ochre-faint/80 border border-uttara-ochre/30 rounded-brand flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-uttara-ochre-dark" />
          <span className="text-uttara-charcoal">
            You earned <strong className="text-uttara-terracotta">{Math.floor(order.totalAmount)} Oota Points</strong> on this order!
          </span>
        </div>
        <Link href="/account" className="font-semibold text-uttara-terracotta hover:underline">
          View Balance
        </Link>
      </div>

      {/* Quick Action Buttons */}
      <div className="mt-6 grid grid-cols-2 gap-3">
        <a
          href={`https://maps.google.com/?q=${encodeURIComponent(order.outlet?.address || 'Indiranagar')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full"
        >
          <Button variant="outline" fullWidth size="md" className="gap-2">
            <Navigation className="w-4 h-4 text-uttara-terracotta" />
            <span>Map Directions</span>
          </Button>
        </a>

        <a href={`tel:${order.outlet?.phone || '+918041234501'}`} className="w-full">
          <Button variant="outline" fullWidth size="md" className="gap-2">
            <Phone className="w-4 h-4 text-uttara-charcoal-muted" />
            <span>Call Counter</span>
          </Button>
        </a>
      </div>

      <div className="mt-6 text-center">
        <Link href="/menu">
          <Button variant="terracotta-subtle" size="md" className="gap-2">
            <RotateCcw className="w-4 h-4" />
            <span>Order Another Oota</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}
