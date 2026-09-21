'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Navigation, MapPin, Sparkles } from 'lucide-react';
import { SectionHeading } from '../../components/ui/SectionHeading';
import { OutletCard } from '../../components/ui/OutletCard';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { LoadingState } from '../../components/ui/States';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/Toast';
import { fetchApi } from '../../lib/api';
import { Outlet } from '@uttara/shared';

export default function OutletsPage() {
  const router = useRouter();
  const { selectedOutlet, setSelectedOutlet } = useAuth();
  const { showToast } = useToast();

  const [outlets, setOutlets] = useState<Outlet[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isLocating, setIsLocating] = useState(false);
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);

  const fetchOutletsList = async (lat?: number, lng?: number, query?: string) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (lat !== undefined && lng !== undefined) {
        params.append('lat', lat.toString());
        params.append('lng', lng.toString());
      }
      if (query) {
        params.append('q', query);
      }

      const res = await fetchApi<{ outlets: Outlet[] }>(`/api/outlets?${params.toString()}`);
      setOutlets(res.outlets);
    } catch (err) {
      // Fallback mock outlets for Bengaluru
      setOutlets([
        {
          id: 'mock-1',
          name: 'Uttara - Indiranagar',
          slug: 'indiranagar',
          code: 'BLR-IND-01',
          address: 'Shop 4, 100 Feet Road, HAL 2nd Stage, Indiranagar',
          locality: 'Indiranagar',
          latitude: 12.9716,
          longitude: 77.6412,
          phone: '+91 80 4123 4501',
          email: 'indiranagar@uttara.in',
          isActive: true,
          opensAt: '11:30',
          closesAt: '22:30',
          averagePrepTimeMinutes: 7,
          currentStatus: 'OPEN',
          isOpenNow: true,
          distanceKm: 1.8,
        },
        {
          id: 'mock-2',
          name: 'Uttara - Jayanagar',
          slug: 'jayanagar',
          code: 'BLR-JAY-02',
          address: 'Ground Floor, 11th Main Road, 4th Block, Jayanagar',
          locality: 'Jayanagar',
          latitude: 12.9308,
          longitude: 77.5838,
          phone: '+91 80 4123 4502',
          email: 'jayanagar@uttara.in',
          isActive: true,
          opensAt: '11:30',
          closesAt: '22:30',
          averagePrepTimeMinutes: 8,
          currentStatus: 'OPEN',
          isOpenNow: true,
          distanceKm: 4.2,
        },
        {
          id: 'mock-3',
          name: 'Uttara - Malleshwaram',
          slug: 'malleshwaram',
          code: 'BLR-MAL-03',
          address: '22/1, 8th Cross, Sampige Road, Malleshwaram',
          locality: 'Malleshwaram',
          latitude: 13.0031,
          longitude: 77.5702,
          phone: '+91 80 4123 4503',
          email: 'malleshwaram@uttara.in',
          isActive: true,
          opensAt: '11:30',
          closesAt: '22:00',
          averagePrepTimeMinutes: 6,
          currentStatus: 'OPEN',
          isOpenNow: true,
          distanceKm: 6.5,
        },
        {
          id: 'mock-4',
          name: 'Uttara - Koramangala',
          slug: 'koramangala',
          code: 'BLR-KOR-04',
          address: '88, 80 Feet Road, 5th Block, Koramangala',
          locality: 'Koramangala',
          latitude: 12.9352,
          longitude: 77.6245,
          phone: '+91 80 4123 4504',
          email: 'koramangala@uttara.in',
          isActive: true,
          opensAt: '11:30',
          closesAt: '23:00',
          averagePrepTimeMinutes: 9,
          currentStatus: 'OPEN',
          isOpenNow: true,
          distanceKm: 3.1,
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOutletsList(userCoords?.lat, userCoords?.lng, searchQuery);
  }, [userCoords]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOutletsList(userCoords?.lat, userCoords?.lng, searchQuery);
  };

  const handleRequestLocation = () => {
    if (!navigator.geolocation) {
      showToast('Geolocation is not supported by your browser', 'error');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserCoords(coords);
        showToast('Sorting outlets by your nearest location', 'success');
      },
      (err) => {
        setIsLocating(false);
        // Fallback coordinates for Bengaluru central (M.G. Road)
        setUserCoords({ lat: 12.9716, lng: 77.5946 });
        showToast('Using Bengaluru Central for distance estimation', 'info');
      },
      { timeout: 8000 }
    );
  };

  const handleSelectOutlet = (outlet: Outlet) => {
    setSelectedOutlet(outlet);
    showToast(`Selected ${outlet.name} for your order!`, 'success');
    router.push('/menu');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <SectionHeading
        kannadaSubtitle="ಶಾಖೆಗಳು"
        englishTitle="Bengaluru Outlets"
        description="Our small, efficient takeaway and service counters across the city. Pick up within minutes of ordering."
      />

      {/* Search & Location Bar */}
      <div className="max-w-2xl mx-auto mb-8 flex flex-col sm:flex-row gap-3">
        <form onSubmit={handleSearch} className="flex-1 relative">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by area (e.g. Indiranagar, Jayanagar)..."
            className="pl-9"
          />
          <Search className="w-4 h-4 text-uttara-charcoal-muted absolute left-3 top-3" />
        </form>

        <Button
          variant="outline"
          onClick={handleRequestLocation}
          isLoading={isLocating}
          className="gap-2 shrink-0"
        >
          <Navigation className="w-4 h-4 text-uttara-terracotta" />
          <span>Find Nearest</span>
        </Button>
      </div>

      {isLoading ? (
        <LoadingState message="Locating nearest Bengaluru outlets..." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {outlets.map((outlet) => {
            const isSelected = selectedOutlet?.id === outlet.id;
            return (
              <OutletCard
                key={outlet.id}
                id={outlet.id}
                name={outlet.name}
                locality={outlet.locality}
                address={outlet.address}
                phone={outlet.phone}
                distanceKm={outlet.distanceKm}
                averagePrepTimeMinutes={outlet.averagePrepTimeMinutes}
                currentStatus={outlet.currentStatus}
                isOpenNow={outlet.isOpenNow ?? true}
                isSelected={isSelected}
                onSelect={() => handleSelectOutlet(outlet)}
              />
            );
          })}
        </div>
      )}

      {/* Network expansion notice */}
      <div className="mt-12 p-6 bg-uttara-cream rounded-brand border border-uttara-cream-border text-center max-w-xl mx-auto">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-uttara-terracotta uppercase tracking-wider mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Expanding to 20+ Outlets</span>
        </div>
        <p className="text-xs text-uttara-charcoal-muted leading-relaxed">
          Upcoming counters launching soon in HSR Layout, Whitefield, Rajajinagar, and JP Nagar. Supported by our centralized master kitchen.
        </p>
      </div>
    </div>
  );
}
