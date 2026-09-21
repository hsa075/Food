'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MapPin, Check, Flame, Info, ShoppingBag, ArrowRight } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { QuantitySelector } from '../../components/ui/QuantitySelector';
import { PriceDisplay } from '../../components/ui/PriceDisplay';
import { JowarMandala } from '../../components/ui/JowarMandala/JowarMandala';
import { JowarDivider } from '../../components/ui/JowarMandala/JowarDivider';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/Toast';
import { fetchApi } from '../../lib/api';
import { BASE_OOTA_PRICE, DEFAULT_OOTA_COMPONENTS } from '@uttara/shared';

export default function MenuPage() {
  const router = useRouter();
  const { quantity, incrementQuantity, decrementQuantity } = useCart();
  const { selectedOutlet } = useAuth();
  const { showToast } = useToast();

  const [menuData, setMenuData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchApi<{ menu: any }>('/api/menu/today')
      .then((res) => {
        setMenuData(res.menu);
      })
      .catch(() => {
        setMenuData({
          title: 'North Karnataka Oota',
          kannadaTitle: 'ಉತ್ತರ ಕರ್ನಾಟಕ ಊಟ',
          price: BASE_OOTA_PRICE,
          palya1: {
            name: 'Yennegayi Badanekayi',
            kannadaName: 'ಎಣ್ಣೆಗಾಯಿ ಬದನೆಕಾಯಿ',
            description: 'Tender baby brinjals slow-roasted with stone-ground peanut, sesame, and Deccan spices.',
          },
          palya2: {
            name: 'Hesaru Kalu Usli',
            kannadaName: 'ಹೆಸರು ಕಾಳು ಉಸ್ಲಿ',
            description: 'Sprouted moong beans tempered with mustard, curry leaves, and grated coconut.',
          },
          components: DEFAULT_OOTA_COMPONENTS,
          dietary: {
            isVegetarian: true,
            allergens: ['Peanuts', 'Sesame', 'Gluten', 'Dairy'],
            caloriesEstimate: 620,
          }
        });
      })
      .finally(() => setIsLoading(false));
  }, []);

  const handleAddToCart = () => {
    showToast(`Added ${quantity} Oota to your cart!`, 'success');
  };

  const handleOrderNow = () => {
    router.push('/cart');
  };

  const price = menuData?.price || BASE_OOTA_PRICE;
  const subtotal = price * quantity;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 relative">
      {/* Outlet context bar */}
      <div className="flex items-center justify-between bg-white border border-uttara-cream-border p-3.5 rounded-brand mb-6 shadow-subtle">
        <div className="flex items-center gap-2 text-xs">
          <MapPin className="w-4 h-4 text-uttara-terracotta" />
          <span className="text-uttara-charcoal-muted">Serving from:</span>
          <span className="font-semibold text-uttara-charcoal">
            {selectedOutlet ? `${selectedOutlet.name} (${selectedOutlet.locality})` : 'Indiranagar Outlet'}
          </span>
        </div>
        <Link href="/outlets" className="text-xs text-uttara-terracotta hover:underline font-medium">
          Change Outlet
        </Link>
      </div>

      {/* Main Single-Product Showcase: The Oota as a Ritual */}
      <div className="bg-white rounded-2xl border border-uttara-cream-border p-6 sm:p-10 shadow-card overflow-hidden relative">
        <div className="ilkal-pattern-border -mx-10 -mt-10 mb-8" />

        {/* Ambient Subtle Jowar Mandala Behind Header */}
        <div className="absolute top-4 right-4 pointer-events-none opacity-10 hidden sm:block">
          <JowarMandala size={180} variant="terracotta" animated="spin" />
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-uttara-terracotta-faint text-uttara-terracotta text-xs font-semibold uppercase tracking-wider mb-2 border border-uttara-terracotta/20">
              <JowarMandala size={14} variant="terracotta" />
              <span>ಇವತ್ತಿನ ಊಟ • Today&apos;s Fresh Batch</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-display font-bold text-uttara-charcoal tracking-tight">
              North Karnataka Oota
            </h1>
            <div className="text-sm font-kannada font-bold text-uttara-terracotta mt-1">
              ಉತ್ತರ ಕರ್ನಾಟಕ ಊಟ
            </div>
          </div>

          <div className="flex flex-col items-start md:items-end">
            <PriceDisplay amount={price} size="xl" />
            <span className="text-[11px] text-uttara-charcoal-muted">All-inclusive meal • Pure Veg</span>
          </div>
        </div>

        <p className="text-sm text-uttara-charcoal-muted leading-relaxed mb-8 max-w-2xl">
          The timeless Deccan platter. Prepared centrally with authentic stone-ground spices, cold-pressed oils, and fresh jowar milled daily.
        </p>

        {/* Ritual Circular Composition */}
        <div className="mb-10 p-6 bg-gradient-to-br from-uttara-cream via-uttara-ivory to-uttara-cream rounded-2xl border border-uttara-cream-border/90 relative overflow-hidden text-center">
          {/* Subtle Jowar Mandala Radial framing */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-15">
            <JowarMandala size={340} variant="terracotta" animated="spin" strokeWidth={1.1} />
          </div>

          <div className="relative z-10 py-4 max-w-lg mx-auto">
            <div className="w-48 h-48 mx-auto rounded-full bg-white border-4 border-uttara-cream-border shadow-card flex flex-col items-center justify-center p-4 relative mb-4">
              <div className="text-xs font-kannada font-bold text-uttara-terracotta">
                ಬಿಸಿ ಅನ್ನ & ಬೇಳೆ ಸಾರು
              </div>
              <div className="text-xl font-display font-bold text-uttara-charcoal mt-1">
                Sona Masoori Rice
              </div>
              <div className="text-[10px] text-uttara-charcoal-muted mt-1">
                Slow-simmered Bele Saaru
              </div>
              <div className="absolute -top-3 bg-uttara-terracotta text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                Thali Center
              </div>
            </div>

            {/* Circular surrounding elements */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="p-2.5 bg-white/90 rounded-brand border border-uttara-cream-border/80 shadow-xs">
                <span className="font-semibold block text-uttara-charcoal">3 Jolada Rotti</span>
                <span className="text-[10px] text-uttara-charcoal-muted font-kannada">ಜೋಳದ ರೊಟ್ಟಿ</span>
              </div>
              <div className="p-2.5 bg-white/90 rounded-brand border border-uttara-cream-border/80 shadow-xs">
                <span className="font-semibold block text-uttara-charcoal">2 Daily Palyas</span>
                <span className="text-[10px] text-uttara-charcoal-muted font-kannada">ಬಿಸಿ ಪಲ್ಯ</span>
              </div>
              <div className="p-2.5 bg-white/90 rounded-brand border border-uttara-cream-border/80 shadow-xs">
                <span className="font-semibold block text-uttara-charcoal">2 Chutney Pudi</span>
                <span className="text-[10px] text-uttara-charcoal-muted font-kannada">ಶೇಂಗಾ & ಅಗಸಿ</span>
              </div>
              <div className="p-2.5 bg-white/90 rounded-brand border border-uttara-cream-border/80 shadow-xs">
                <span className="font-semibold block text-uttara-charcoal">Fresh Mosaru</span>
                <span className="text-[10px] text-uttara-charcoal-muted font-kannada">ತಾಜಾ ಮೊಸರು</span>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Today's Rotating Palyas */}
        <div className="mb-8 p-5 bg-uttara-ochre-faint/60 rounded-brand border border-uttara-ochre/25 relative">
          <div className="flex items-center gap-2 mb-3">
            <Flame className="w-4 h-4 text-uttara-ochre-dark" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-uttara-ochre-dark flex items-center gap-2">
              <span>Today&apos;s Rotating Kalyana Karnataka Palyas</span>
              <span className="text-[11px] font-kannada normal-case text-uttara-charcoal-muted">
                (ದೈನಂದಿನ ಪಲ್ಯಗಳು)
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-brand border border-uttara-cream-border/80 shadow-xs">
              <span className="text-[10px] font-semibold text-uttara-terracotta uppercase tracking-wide">
                Palya 1 &bull; {menuData?.palya1?.kannadaName || 'ಎಣ್ಣೆಗಾಯಿ'}
              </span>
              <h4 className="text-sm font-display font-bold text-uttara-charcoal mt-0.5">
                {menuData?.palya1?.name || 'Yennegayi Badanekayi'}
              </h4>
              <p className="text-xs text-uttara-charcoal-muted mt-1 leading-relaxed">
                {menuData?.palya1?.description || 'Stuffed baby brinjals in aromatic roasted peanut and sesame gravy.'}
              </p>
            </div>

            <div className="bg-white p-4 rounded-brand border border-uttara-cream-border/80 shadow-xs">
              <span className="text-[10px] font-semibold text-uttara-terracotta uppercase tracking-wide">
                Palya 2 &bull; {menuData?.palya2?.kannadaName || 'ಉಸ್ಲಿ'}
              </span>
              <h4 className="text-sm font-display font-bold text-uttara-charcoal mt-0.5">
                {menuData?.palya2?.name || 'Hesaru Kalu Usli'}
              </h4>
              <p className="text-xs text-uttara-charcoal-muted mt-1 leading-relaxed">
                {menuData?.palya2?.description || 'Tender sprouted whole green gram tempered with mustard, curry leaves, and grated coconut.'}
              </p>
            </div>
          </div>
        </div>

        {/* Nutritional & Allergen Note */}
        <div className="p-3.5 bg-uttara-ivory rounded-brand border border-uttara-cream-border text-xs text-uttara-charcoal-muted flex items-start gap-2 mb-8">
          <Info className="w-4 h-4 text-uttara-terracotta shrink-0 mt-0.5" />
          <div>
            <span className="font-medium text-uttara-charcoal">Nutritional & Dietary Note:</span> ~620 kcal per meal. Contains peanuts and dairy. 100% pure vegetarian.
          </div>
        </div>

        {/* Quantity & Ordering Section */}
        <div className="pt-6 border-t border-uttara-cream-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <span className="text-xs font-semibold text-uttara-charcoal uppercase tracking-wider flex items-center gap-1.5">
              <JowarMandala size={14} variant="terracotta" />
              <span>Quantity:</span>
            </span>
            <QuantitySelector
              quantity={quantity}
              onIncrement={incrementQuantity}
              onDecrement={decrementQuantity}
              size="lg"
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button
              variant="outline"
              size="lg"
              onClick={handleAddToCart}
              className="flex-1 sm:flex-none"
            >
              <ShoppingBag className="w-4 h-4 mr-1.5" />
              <span>Add to Cart</span>
            </Button>

            <Button
              size="lg"
              onClick={handleOrderNow}
              className="flex-1 sm:flex-none"
            >
              <span>Order Now (₹{subtotal})</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Sticky Mobile Checkout Bar */}
      <div className="sm:hidden fixed bottom-14 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-uttara-cream-border p-3.5 shadow-lifted">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <QuantitySelector
              quantity={quantity}
              onIncrement={incrementQuantity}
              onDecrement={decrementQuantity}
              size="sm"
            />
            <div className="text-xs font-semibold text-uttara-charcoal">
              ₹{subtotal}
            </div>
          </div>

          <Button size="md" onClick={handleOrderNow} className="px-6">
            <span>Checkout</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
