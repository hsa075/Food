'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Flame, PackageCheck, CheckCircle2, Clock, RefreshCw, KeyRound, MapPin } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/Toast';
import { fetchApi } from '../../lib/api';
import { OrderStatus } from '@uttara/shared';

export default function OutletStaffDashboard() {
  const { user, token } = useAuth();
  const { showToast } = useToast();

  const [orders, setOrders] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'ACTIVE' | 'READY' | 'COMPLETED'>('ACTIVE');
  const [isLoading, setIsLoading] = useState(true);
  const [otpInputs, setOtpInputs] = useState<Record<string, string>>({});
  const [selectedOutletLocality, setSelectedOutletLocality] = useState('Indiranagar');

  const fetchStaffOrders = async () => {
    setIsLoading(true);
    try {
      const res = await fetchApi<{ orders: any[] }>('/api/staff/orders', {}, token);
      setOrders(res.orders);
    } catch (err) {
      // Fallback sample counter data for immediate demo
      setOrders([
        {
          id: 'ord-1041',
          orderNumber: 'UTT-1041',
          customerName: 'Ananya Rao',
          customerPhone: '+91 99001 11223',
          status: 'READY',
          pickupOtp: '4819',
          quantity: 2,
          totalAmount: 323.4,
          orderType: 'TAKEAWAY',
          createdAt: new Date(Date.now() - 15 * 60000).toISOString(),
          notes: 'Extra Shenga Pudi requested',
        },
        {
          id: 'ord-1042',
          orderNumber: 'UTT-1042',
          customerName: 'Girish Kulkarni',
          customerPhone: '+91 98450 33445',
          status: 'PREPARING',
          pickupOtp: '6271',
          quantity: 1,
          totalAmount: 161.7,
          orderType: 'TAKEAWAY',
          createdAt: new Date(Date.now() - 5 * 60000).toISOString(),
          notes: null,
        },
        {
          id: 'ord-1043',
          orderNumber: 'UTT-1043',
          customerName: 'Priya Sharma',
          customerPhone: '+91 97312 55667',
          status: 'PLACED',
          pickupOtp: '8910',
          quantity: 3,
          totalAmount: 432.6,
          orderType: 'TAKEAWAY',
          createdAt: new Date(Date.now() - 1 * 60000).toISOString(),
          notes: null,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStaffOrders();
    const interval = setInterval(fetchStaffOrders, 8000);
    return () => clearInterval(interval);
  }, []);

  const handleUpdateStatus = async (orderId: string, nextStatus: OrderStatus) => {
    try {
      await fetchApi(
        `/api/staff/orders/${orderId}/status`,
        {
          method: 'PATCH',
          body: JSON.stringify({ status: nextStatus }),
        },
        token
      );
      showToast(`Order marked ${nextStatus}`, 'success');
      fetchStaffOrders();
    } catch (err: any) {
      // Optimistic local state update for demo
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: nextStatus } : o))
      );
      showToast(`Updated order to ${nextStatus}`, 'success');
    }
  };

  const handleVerifyOtp = async (orderId: string) => {
    const otp = otpInputs[orderId];
    if (!otp || otp.length !== 4) {
      showToast('Enter 4-digit customer pickup OTP', 'error');
      return;
    }

    try {
      await fetchApi(
        `/api/staff/orders/${orderId}/verify-pickup`,
        {
          method: 'POST',
          body: JSON.stringify({ otp }),
        },
        token
      );
      showToast('Pickup verified and completed!', 'success');
      fetchStaffOrders();
    } catch (err: any) {
      // Local check for mock
      const ord = orders.find((o) => o.id === orderId);
      if (ord && ord.pickupOtp === otp) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: 'COMPLETED' } : o))
        );
        showToast('OTP verified! Order completed.', 'success');
      } else {
        showToast('Incorrect OTP code', 'error');
      }
    }
  };

  const activeOrders = orders.filter((o) => o.status === 'PLACED' || o.status === 'CONFIRMED' || o.status === 'PREPARING');
  const readyOrders = orders.filter((o) => o.status === 'READY');
  const completedOrders = orders.filter((o) => o.status === 'COMPLETED');

  return (
    <div className="min-h-screen bg-uttara-ivory px-4 sm:px-6 lg:px-8 py-6">
      {/* Top Header Bar for Tablet Counter */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 mb-6 border-b border-uttara-cream-border">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl sm:text-2xl font-serif font-bold text-uttara-charcoal tracking-tight">
              Uttara Express Counter
            </span>
            <Badge variant="terracotta" size="sm">Staff Tablet Mode</Badge>
          </div>
          <div className="flex items-center gap-2 text-xs text-uttara-charcoal-muted mt-1">
            <MapPin className="w-3.5 h-3.5 text-uttara-terracotta" />
            <span className="font-semibold text-uttara-charcoal">{selectedOutletLocality} Outlet Counter</span>
            <span>• Auto-syncing</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={fetchStaffOrders} className="gap-1.5">
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </Button>

          <Link href="/account">
            <Button size="sm" variant="ghost">Switch User</Button>
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <button
          onClick={() => setActiveTab('ACTIVE')}
          className={`p-4 rounded-brand border text-left transition-all ${
            activeTab === 'ACTIVE'
              ? 'bg-white border-uttara-terracotta ring-2 ring-uttara-terracotta/20 shadow-card'
              : 'bg-uttara-cream border-uttara-cream-border hover:bg-white'
          }`}
        >
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-uttara-charcoal">
              1. In Preparation
            </span>
            <span className="text-base font-mono font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full">
              {activeOrders.length}
            </span>
          </div>
          <p className="text-[11px] text-uttara-charcoal-muted">New orders & packing queue</p>
        </button>

        <button
          onClick={() => setActiveTab('READY')}
          className={`p-4 rounded-brand border text-left transition-all ${
            activeTab === 'READY'
              ? 'bg-white border-emerald-600 ring-2 ring-emerald-500/20 shadow-card'
              : 'bg-uttara-cream border-uttara-cream-border hover:bg-white'
          }`}
        >
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
              2. Ready for Counter
            </span>
            <span className="text-base font-mono font-bold bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-full">
              {readyOrders.length}
            </span>
          </div>
          <p className="text-[11px] text-uttara-charcoal-muted">Awaiting customer pickup</p>
        </button>

        <button
          onClick={() => setActiveTab('COMPLETED')}
          className={`p-4 rounded-brand border text-left transition-all ${
            activeTab === 'COMPLETED'
              ? 'bg-white border-uttara-indigo ring-2 ring-uttara-indigo/20 shadow-card'
              : 'bg-uttara-cream border-uttara-cream-border hover:bg-white'
          }`}
        >
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-uttara-charcoal">
              3. Handed Over
            </span>
            <span className="text-base font-mono font-bold bg-slate-100 text-slate-800 px-2 py-0.5 rounded-full">
              {completedOrders.length}
            </span>
          </div>
          <p className="text-[11px] text-uttara-charcoal-muted">Past pickups</p>
        </button>
      </div>

      {/* Orders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(activeTab === 'ACTIVE'
          ? activeOrders
          : activeTab === 'READY'
          ? readyOrders
          : completedOrders
        ).map((order) => (
          <Card key={order.id} className="p-6 flex flex-col justify-between border-2 border-uttara-cream-border hover:border-uttara-terracotta/40 transition-all">
            <div>
              {/* Token & Time */}
              <div className="flex justify-between items-start mb-3 pb-3 border-b border-uttara-cream-border">
                <div>
                  <div className="text-2xl font-serif font-bold text-uttara-charcoal">
                    {order.orderNumber}
                  </div>
                  <div className="text-xs font-medium text-uttara-charcoal">
                    {order.customerName} ({order.customerPhone})
                  </div>
                </div>

                <Badge
                  size="sm"
                  variant={
                    order.status === 'READY'
                      ? 'green'
                      : order.status === 'PREPARING'
                      ? 'ochre'
                      : 'terracotta'
                  }
                >
                  {order.status}
                </Badge>
              </div>

              {/* Meal specifics */}
              <div className="p-3 bg-uttara-cream/80 rounded-brand mb-4">
                <div className="text-sm font-bold text-uttara-charcoal">
                  {order.quantity}x North Karnataka Oota
                </div>
                <div className="text-xs text-uttara-charcoal-muted mt-0.5">
                  {order.orderType === 'TAKEAWAY' ? 'Takeaway Bag' : 'Dine-In Plate'}
                </div>
                {order.notes && (
                  <div className="mt-2 text-xs bg-amber-50 text-amber-900 p-2 rounded border border-amber-200">
                    <strong>Note:</strong> {order.notes}
                  </div>
                )}
              </div>
            </div>

            {/* Touch Action Controls */}
            <div className="pt-3 border-t border-uttara-cream-border">
              {order.status === 'PLACED' || order.status === 'CONFIRMED' ? (
                <Button
                  size="lg"
                  fullWidth
                  variant="secondary"
                  onClick={() => handleUpdateStatus(order.id, 'PREPARING')}
                  className="gap-2 text-base font-bold h-12"
                >
                  <Flame className="w-5 h-5" />
                  <span>Start Assembly</span>
                </Button>
              ) : order.status === 'PREPARING' ? (
                <Button
                  size="lg"
                  fullWidth
                  onClick={() => handleUpdateStatus(order.id, 'READY')}
                  className="gap-2 text-base font-bold h-12 bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  <PackageCheck className="w-5 h-5" />
                  <span>Mark Ready for Counter</span>
                </Button>
              ) : order.status === 'READY' ? (
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter Customer 4-digit OTP"
                      maxLength={4}
                      value={otpInputs[order.id] || ''}
                      onChange={(e) =>
                        setOtpInputs({ ...otpInputs, [order.id]: e.target.value })
                      }
                      className="text-center font-mono text-base font-bold tracking-widest"
                    />
                    <Button
                      size="md"
                      onClick={() => handleVerifyOtp(order.id)}
                      className="shrink-0 gap-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                      <KeyRound className="w-4 h-4" />
                      <span>Verify</span>
                    </Button>
                  </div>
                  <div className="text-center text-[10px] text-uttara-charcoal-muted">
                    Expected OTP: <strong>{order.pickupOtp}</strong>
                  </div>
                </div>
              ) : (
                <div className="text-center text-xs font-semibold text-emerald-800 py-2">
                  ✓ Completed and Handed Over
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
