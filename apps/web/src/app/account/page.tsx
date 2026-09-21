'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { User, Sparkles, RotateCcw, LogOut, ShieldCheck, ChevronRight } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { JowarMandala } from '../../components/ui/JowarMandala/JowarMandala';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/Toast';
import { fetchApi } from '../../lib/api';
import { REDEEM_THRESHOLD_POINTS } from '@uttara/shared';

export default function AccountPage() {
  const { user, login, register, logout, token } = useAuth();
  const { setQuantity } = useCart();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'LOGIN' | 'REGISTER'>('LOGIN');
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPhone, setRegisterPhone] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [loyaltyData, setLoyaltyData] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    if (token) {
      fetchApi<{ loyalty: any }>('/api/loyalty', {}, token)
        .then((res) => setLoyaltyData(res.loyalty))
        .catch(() => {});

      fetchApi<{ orders: any[] }>('/api/orders/my-orders', {}, token)
        .then((res) => setOrders(res.orders))
        .catch(() => {});
    }
  }, [token]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await login(emailOrPhone, password);
      showToast('Welcome back!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Login failed', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await register(name, registerEmail, registerPhone, registerPassword);
      showToast('Account created with 50 bonus Oota points!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Registration failed', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickDemoLogin = async (roleEmail: string) => {
    setIsSubmitting(true);
    try {
      await login(roleEmail, 'Uttara@2026');
      showToast(`Logged in as ${roleEmail}`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Quick login failed', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReorderUsual = () => {
    setQuantity(1);
    showToast('Usual Oota added to cart! Proceeding to checkout.', 'success');
  };

  const points = loyaltyData?.pointsBalance ?? user?.loyaltyPoints ?? 245;
  const needed = Math.max(0, REDEEM_THRESHOLD_POINTS - points);
  const progressPercent = Math.min(100, Math.round((points / REDEEM_THRESHOLD_POINTS) * 100));

  // Radial progress calculations (circumference = 2 * PI * r = 2 * 3.14159 * 52 ≈ 326.7)
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (circumference * progressPercent) / 100;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {user ? (
        /* Logged In View */
        <div className="space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-uttara-cream-border">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-display font-bold text-uttara-charcoal tracking-tight">
                  {user.name}
                </h1>
                <Badge variant="ochre" size="sm">
                  {user.loyaltyTier || 'Oota Patron'}
                </Badge>
              </div>
              <p className="text-xs text-uttara-charcoal-muted mt-0.5">
                {user.phone} • {user.email}
              </p>
            </div>

            <Button variant="outline" size="sm" onClick={logout} className="gap-1.5">
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </Button>
          </div>

          {/* Quick Staff / Admin Shortcuts if privileged user */}
          {user.role !== 'customer' && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-brand flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-700" />
                <div>
                  <div className="text-xs font-bold text-amber-900 capitalize">
                    {user.role.replace('_', ' ')} Portal Access
                  </div>
                  <div className="text-[11px] text-amber-700">
                    You have staff management credentials.
                  </div>
                </div>
              </div>
              <Link
                href={user.role === 'admin' ? '/admin' : user.role === 'kitchen_manager' ? '/kitchen' : '/staff'}
              >
                <Button size="sm" variant="secondary">
                  Open Dashboard
                </Button>
              </Link>
            </div>
          )}

          {/* Radial Jowar Loyalty Card */}
          <Card className="p-6 md:p-8 bg-white border border-uttara-cream-border shadow-card relative overflow-hidden">
            {/* Background Jowar Mandala Watermark */}
            <div className="absolute -right-16 -bottom-16 pointer-events-none opacity-10">
              <JowarMandala size={260} variant="terracotta" animated="spin" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center relative z-10">
              
              {/* Radial Jowar Point Progress Graphic */}
              <div className="md:col-span-5 flex flex-col items-center justify-center">
                <div className="relative w-36 h-36 flex items-center justify-center">
                  {/* Background rotating jowar seeds */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-25">
                    <JowarMandala size={110} variant="ochre" animated="spin" />
                  </div>

                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                    <circle
                      cx="60"
                      cy="60"
                      r={radius}
                      className="text-uttara-cream-border"
                      strokeWidth="6"
                      stroke="currentColor"
                      fill="transparent"
                    />
                    <circle
                      cx="60"
                      cy="60"
                      r={radius}
                      className="text-uttara-terracotta transition-all duration-1000 ease-out"
                      strokeWidth="6"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="transparent"
                    />
                  </svg>

                  <div className="absolute flex flex-col items-center justify-center text-center">
                    <span className="text-3xl font-display font-bold text-uttara-charcoal leading-none">
                      {points}
                    </span>
                    <span className="text-[10px] uppercase tracking-wider text-uttara-charcoal-muted mt-1 font-semibold">
                      Oota Points
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress text and tier description */}
              <div className="md:col-span-7 space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-uttara-terracotta uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>North Karnataka Loyalty Tier &bull; {user.loyaltyTier || 'Oota Patron'}</span>
                </div>

                <h3 className="text-xl font-display font-bold text-uttara-charcoal">
                  {needed === 0 ? 'You have unlocked a Free Oota!' : `${needed} points to your next reward`}
                </h3>

                <p className="text-xs text-uttara-charcoal-muted leading-relaxed">
                  Earn 1 point for every ₹1 spent at any Bengaluru counter. Redeem 300 points for a full wholesome North Karnataka Oota (worth ₹139).
                </p>

                <div className="pt-2 flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-uttara-charcoal bg-uttara-cream px-2.5 py-1 rounded">
                    {progressPercent}% Complete
                  </span>
                  <span className="text-[11px] text-uttara-charcoal-muted">
                    Goal: 300 points
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* One-Tap Reorder Card */}
          <Card className="p-5 flex items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold text-uttara-terracotta tracking-wider uppercase flex items-center gap-1">
                <JowarMandala size={12} variant="terracotta" />
                <span>Instant Order</span>
              </span>
              <h3 className="text-base font-display font-bold text-uttara-charcoal">
                Your Usual Oota
              </h3>
              <p className="text-xs text-uttara-charcoal-muted mt-0.5">
                1x North Karnataka Oota • Takeaway Counter
              </p>
            </div>

            <Link href="/cart">
              <Button size="sm" onClick={handleReorderUsual} className="gap-1.5 shrink-0">
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reorder Now</span>
              </Button>
            </Link>
          </Card>

          {/* Past Orders History */}
          <div>
            <h3 className="text-sm font-display font-bold text-uttara-charcoal uppercase tracking-wider mb-4">
              Recent Pickups
            </h3>

            {orders.length === 0 ? (
              <Card className="p-6 text-center text-xs text-uttara-charcoal-muted">
                No orders yet. Discover our fresh oota today!
              </Card>
            ) : (
              <div className="space-y-3">
                {orders.map((o) => (
                  <Card key={o.id} className="p-4 flex items-center justify-between text-xs hover:border-uttara-terracotta/30 transition-colors">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-uttara-charcoal">{o.orderNumber}</span>
                        <Badge
                          size="sm"
                          variant={o.status === 'COMPLETED' ? 'green' : o.status === 'CANCELLED' ? 'subtle' : 'terracotta'}
                        >
                          {o.status}
                        </Badge>
                      </div>
                      <div className="text-uttara-charcoal-muted mt-1">
                        {new Date(o.createdAt).toLocaleDateString()} • {o.quantity}x Oota • ₹{o.totalAmount}
                      </div>
                    </div>

                    <Link href={`/orders/${o.id}`}>
                      <Button variant="outline" size="sm" className="gap-1">
                        <span>Details</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Button>
                    </Link>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Logged Out / Auth View */
        <div className="max-w-md mx-auto">
          <div className="text-center mb-6">
            <div className="flex justify-center mb-3">
              <JowarMandala size={44} variant="terracotta" opacity={0.85} strokeWidth={1.3} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-uttara-charcoal tracking-tight">
              Customer Account
            </h1>
            <p className="text-xs text-uttara-charcoal-muted mt-1">
              Sign in to earn loyalty points, reorder in 1-tap, and view past pickups.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-uttara-cream-border p-6 shadow-card">
            {/* Tabs */}
            <div className="flex border-b border-uttara-cream-border mb-6">
              <button
                type="button"
                onClick={() => setActiveTab('LOGIN')}
                className={`flex-1 pb-3 text-xs font-semibold text-center border-b-2 transition-all ${
                  activeTab === 'LOGIN'
                    ? 'border-uttara-terracotta text-uttara-terracotta'
                    : 'border-transparent text-uttara-charcoal-muted'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('REGISTER')}
                className={`flex-1 pb-3 text-xs font-semibold text-center border-b-2 transition-all ${
                  activeTab === 'REGISTER'
                    ? 'border-uttara-terracotta text-uttara-terracotta'
                    : 'border-transparent text-uttara-charcoal-muted'
                }`}
              >
                Create Account (+50 Pts)
              </button>
            </div>

            {activeTab === 'LOGIN' ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <Input
                  label="Email or Phone"
                  placeholder="customer@uttara.in or 9880100005"
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                  required
                />
                <Input
                  label="Password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Button type="submit" fullWidth size="lg" isLoading={isSubmitting}>
                  Sign In
                </Button>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="space-y-4">
                <Input
                  label="Full Name"
                  placeholder="e.g. Hemanth Kumar"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="hemanth@example.com"
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  required
                />
                <Input
                  label="Mobile Phone"
                  type="tel"
                  placeholder="9880123456"
                  value={registerPhone}
                  onChange={(e) => setRegisterPhone(e.target.value)}
                  required
                />
                <Input
                  label="Password"
                  type="password"
                  placeholder="At least 6 characters"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  required
                />
                <Button type="submit" fullWidth size="lg" isLoading={isSubmitting}>
                  Create Account & Get 50 Pts
                </Button>
              </form>
            )}

            {/* Quick Demo Logins for Instant Testing */}
            <div className="mt-8 pt-6 border-t border-uttara-cream-border">
              <span className="text-[11px] font-semibold text-uttara-charcoal-muted uppercase tracking-wider block mb-2 text-center">
                Instant Role Previews (Password: Uttara@2026)
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleQuickDemoLogin('customer@uttara.in')}
                >
                  Customer Demo
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleQuickDemoLogin('staff.indiranagar@uttara.in')}
                >
                  Staff Counter Demo
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleQuickDemoLogin('kitchen@uttara.in')}
                >
                  Kitchen Head Demo
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleQuickDemoLogin('admin@uttara.in')}
                >
                  Admin Demo
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
