import React from 'react';
import { Check, Clock, Flame, PackageCheck, PartyPopper } from 'lucide-react';
import { Card } from './Card';
import { JowarMandala } from './JowarMandala/JowarMandala';

export type StatusStep = 'PLACED' | 'CONFIRMED' | 'PREPARING' | 'READY' | 'COMPLETED' | 'CANCELLED';

export interface OrderStatusProps {
  orderNumber: string;
  pickupOtp: string;
  status: StatusStep;
  estimatedReadyAt: string;
  outletName: string;
  outletLocality: string;
  outletAddress: string;
  customerName: string;
  quantity: number;
}

const STEPS: Array<{ key: StatusStep; label: string; icon: React.ComponentType<{ className?: string }> }> = [
  { key: 'PLACED', label: 'Placed', icon: Clock },
  { key: 'CONFIRMED', label: 'Confirmed', icon: Check },
  { key: 'PREPARING', label: 'Preparing', icon: Flame },
  { key: 'READY', label: 'Ready', icon: PackageCheck },
  { key: 'COMPLETED', label: 'Picked Up', icon: PartyPopper },
];

export const OrderStatusTracker: React.FC<OrderStatusProps> = ({
  orderNumber,
  pickupOtp,
  status,
  estimatedReadyAt,
  outletName,
  outletLocality,
  outletAddress,
  customerName,
  quantity,
}) => {
  const currentIndex = STEPS.findIndex((s) => s.key === status);
  const isCancelled = status === 'CANCELLED';

  const readyTimeFormatted = new Date(estimatedReadyAt).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  return (
    <Card className="max-w-xl mx-auto overflow-hidden">
      {/* Prominent Header with Order Number, OTP, and subtle Jowar Mandala behind */}
      <div className="bg-uttara-terracotta text-uttara-ivory -mx-5 -mt-5 p-6 mb-6 text-center relative overflow-hidden">
        {/* Subtle Watermark Jowar Mandala behind Token */}
        <div className="absolute -right-10 -bottom-10 pointer-events-none opacity-15">
          <JowarMandala size={180} variant="cream" animated="spin" strokeWidth={1} />
        </div>
        <div className="absolute -left-10 -top-10 pointer-events-none opacity-15">
          <JowarMandala size={140} variant="cream" animated="reverse" strokeWidth={1} />
        </div>

        <div className="relative z-10">
          <div className="text-xs uppercase tracking-widest text-uttara-ochre-light font-medium mb-1">
            Uttara Express Counter Token
          </div>
          <div className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-2">
            ORDER #{orderNumber.replace('UTT-', '')}
          </div>

          {status === 'READY' ? (
            <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-100 border border-emerald-300/30 px-3 py-1.5 rounded-full text-sm font-semibold animate-pulse">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              Ready for Pickup at Counter!
            </div>
          ) : (
            <div className="text-sm text-uttara-ivory/80">
              Est. Ready Time: <span className="font-semibold text-white">{readyTimeFormatted}</span>
            </div>
          )}

          {/* Counter Pickup Verification Code */}
          <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-center gap-2">
            <span className="text-xs text-uttara-ivory/70">Counter Pickup OTP:</span>
            <span className="text-lg font-mono font-bold tracking-widest bg-white/10 px-3 py-0.5 rounded border border-white/20">
              {pickupOtp}
            </span>
          </div>
        </div>
      </div>

      {/* Stepper Bar */}
      {isCancelled ? (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-brand text-center text-rose-900 mb-6">
          <span className="font-semibold">This order has been cancelled.</span>
        </div>
      ) : (
        <div className="mb-8">
          <div className="relative flex items-center justify-between">
            {/* Background connection line */}
            <div className="absolute top-4 left-6 right-6 h-0.5 bg-uttara-cream-border z-0" />
            
            {/* Active connection line */}
            <div
              className="absolute top-4 left-6 h-0.5 bg-uttara-terracotta z-0 transition-all duration-500"
              style={{
                width: `${Math.max(0, (currentIndex / (STEPS.length - 1)) * 100)}%`,
              }}
            />

            {STEPS.map((step, idx) => {
              const isPast = idx < currentIndex;
              const isCurrent = idx === currentIndex;
              const Icon = step.icon;

              return (
                <div key={step.key} className="relative z-10 flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isCurrent
                        ? 'bg-uttara-terracotta text-white ring-4 ring-uttara-terracotta/20 scale-110'
                        : isPast
                        ? 'bg-uttara-terracotta text-white'
                        : 'bg-uttara-cream text-uttara-charcoal-faint border border-uttara-cream-border'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span
                    className={`text-[11px] mt-2 font-medium tracking-tight whitespace-nowrap ${
                      isCurrent
                        ? 'text-uttara-terracotta font-semibold'
                        : isPast
                        ? 'text-uttara-charcoal'
                        : 'text-uttara-charcoal-muted'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Order Details Card */}
      <div className="space-y-3.5 text-xs text-uttara-charcoal bg-uttara-cream/60 p-4 rounded-brand border border-uttara-cream-border">
        <div className="flex justify-between items-center pb-2 border-b border-uttara-cream-border">
          <span className="text-uttara-charcoal-muted">Outlet Counter</span>
          <span className="font-semibold text-right">{outletName} ({outletLocality})</span>
        </div>
        <div className="flex justify-between items-start pb-2 border-b border-uttara-cream-border">
          <span className="text-uttara-charcoal-muted">Counter Address</span>
          <span className="font-medium text-right max-w-xs">{outletAddress}</span>
        </div>
        <div className="flex justify-between items-center pb-2 border-b border-uttara-cream-border">
          <span className="text-uttara-charcoal-muted">Items Ordered</span>
          <span className="font-semibold">{quantity}x North Karnataka Oota</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-uttara-charcoal-muted">Recipient</span>
          <span className="font-medium">{customerName}</span>
        </div>
      </div>
    </Card>
  );
};
