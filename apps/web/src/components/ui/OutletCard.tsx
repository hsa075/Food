import React from 'react';
import { MapPin, Clock, Phone, Navigation } from 'lucide-react';
import { Card } from './Card';
import { Badge } from './Badge';
import { Button } from './Button';

export interface OutletCardProps {
  id: string;
  name: string;
  locality: string;
  address: string;
  phone: string;
  distanceKm?: number;
  averagePrepTimeMinutes: number;
  currentStatus: 'OPEN' | 'BUSY' | 'CLOSED';
  isOpenNow: boolean;
  isSelected?: boolean;
  onSelect?: () => void;
  showOrderCta?: boolean;
}

export const OutletCard: React.FC<OutletCardProps> = ({
  name,
  locality,
  address,
  phone,
  distanceKm,
  averagePrepTimeMinutes,
  currentStatus,
  isOpenNow,
  isSelected = false,
  onSelect,
  showOrderCta = true,
}) => {
  return (
    <Card
      variant="interactive"
      className={`relative overflow-hidden transition-all duration-200 ${
        isSelected ? 'ring-2 ring-uttara-terracotta border-transparent bg-uttara-terracotta-faint/30' : ''
      }`}
      onClick={onSelect}
    >
      <div className="flex items-start justify-between gap-3 mb-2.5">
        <div>
          <span className="text-[11px] font-semibold tracking-wider uppercase text-uttara-terracotta">
            {locality}
          </span>
          <h3 className="text-base font-serif font-semibold text-uttara-charcoal">
            {name}
          </h3>
        </div>

        <div>
          {isOpenNow ? (
            currentStatus === 'BUSY' ? (
              <Badge variant="ochre" size="sm">Busy (~15m)</Badge>
            ) : (
              <Badge variant="green" size="sm">Open Now</Badge>
            )
          ) : (
            <Badge variant="subtle" size="sm">Closed</Badge>
          )}
        </div>
      </div>

      <div className="flex items-start gap-1.5 text-xs text-uttara-charcoal-muted mb-3">
        <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5 text-uttara-terracotta/70" />
        <span className="line-clamp-2">{address}</span>
      </div>

      <div className="flex items-center gap-4 text-xs text-uttara-charcoal-muted mb-4 border-t border-uttara-cream-border/60 pt-2.5">
        <div className="flex items-center gap-1">
          <Clock className="w-3.5 h-3.5 text-uttara-ochre" />
          <span>~{averagePrepTimeMinutes}m prep</span>
        </div>

        {distanceKm !== undefined && (
          <div className="flex items-center gap-1 font-medium text-uttara-terracotta">
            <Navigation className="w-3.5 h-3.5" />
            <span>{distanceKm.toFixed(1)} km away</span>
          </div>
        )}

        <div className="flex items-center gap-1 ml-auto">
          <Phone className="w-3 h-3 text-uttara-charcoal-muted" />
          <span className="text-[11px]">{phone}</span>
        </div>
      </div>

      {showOrderCta && (
        <div className="flex items-center gap-2 pt-1">
          <Button
            size="sm"
            variant={isSelected ? 'primary' : 'outline'}
            fullWidth
            onClick={(e) => {
              e.stopPropagation();
              onSelect?.();
            }}
          >
            {isSelected ? 'Selected Outlet ✓' : 'Select for Order'}
          </Button>

          <a
            href={`https://maps.google.com/?q=${encodeURIComponent(address)}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="p-2 border border-uttara-cream-border rounded-brand text-uttara-charcoal-muted hover:text-uttara-charcoal hover:bg-uttara-cream transition-colors"
            title="Open directions in Google Maps"
          >
            <Navigation className="w-4 h-4" />
          </a>
        </div>
      )}
    </Card>
  );
};
