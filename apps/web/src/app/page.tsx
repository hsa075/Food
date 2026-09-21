'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, MapPin, Sparkles, Clock, CheckCircle2, Star, ShieldCheck, Flame } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { SectionHeading } from '../components/ui/SectionHeading';
import { Badge } from '../components/ui/Badge';
import {
  JowarMandala,
  JowarPatternBackground,
  JowarDivider,
} from '../components/ui/JowarMandala';
import { DEFAULT_OOTA_COMPONENTS, BASE_OOTA_PRICE } from '@uttara/shared';

export default function HomePage() {
  const testimonials = [
    {
      name: 'Vinay Kulkarni',
      area: 'Indiranagar',
      review: 'Finally, real North Karnataka food in Bengaluru without greasy gimmicks. The Jolada Rotti is thin and soft, and the Yennegayi has that authentic Hubli-Dharwad spice balance.',
      rating: 5,
    },
    {
      name: 'Dr. Radhika Desai',
      area: 'Malleshwaram',
      review: 'I pick up two ootas on my way home from the clinic. Consistent taste every day because of the central kitchen setup. Outstanding Shenga Pudi.',
      rating: 5,
    },
    {
      name: 'Prashanth B.',
      area: 'Jayanagar',
      review: 'No clutter, just honest oota. 3 rotti, wholesome palyas, and a quiet, clean counter takeaway. Exactly what Bengaluru needed.',
      rating: 5,
    }
  ];

  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden">
      {/* Hero Section with Oversized Cropped Jowar Mandala in Background */}
      <section className="relative overflow-hidden pt-8 pb-16 md:pt-16 md:pb-24 bg-gradient-to-b from-uttara-cream/60 via-uttara-ivory to-uttara-ivory border-b border-uttara-cream-border/60">
        {/* Signature Oversized Jowar Mandala (Cropped, slow 90s spin, 10% opacity) */}
        <JowarPatternBackground opacity={0.11} animated={true} position="hero" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            
            {/* Left Content: Editorial & Rooted */}
            <div className="lg:col-span-7 flex flex-col items-start">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-uttara-terracotta-faint border border-uttara-terracotta/20 text-uttara-terracotta text-xs font-semibold uppercase tracking-wider mb-5">
                <JowarMandala size={16} variant="terracotta" strokeWidth={1.5} />
                <span>Bengaluru Hub Kitchen • Fresh Daily Batches</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-uttara-charcoal tracking-tight leading-[1.15] mb-4">
                Simple Oota. <br />
                <span className="text-uttara-terracotta italic font-normal">
                  Big North Karnataka Soul.
                </span>
              </h1>

              <div className="text-sm font-kannada font-bold text-uttara-charcoal-muted tracking-wide mb-3">
                ಜೋಳದ ರೊಟ್ಟಿ, ಎಣ್ಣೆಗಾಯಿ ಬದನೆಕಾಯಿ, ಅನ್ನ, ಬೇಳೆ ಸಾರು ಮತ್ತು ಶೇಂಗಾ ಚಟ್ನಿ ಪುಡಿ
              </div>

              <p className="text-base sm:text-lg text-uttara-charcoal-muted max-w-xl leading-relaxed mb-8">
                Jolada rotti, slow-cooked palya, fragrant rice, bele saaru and stone-ground chutney pudi. Made centrally in our dedicated kitchen, served warm at your neighborhood counter.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 w-full sm:w-auto mb-8">
                <Link href="/menu">
                  <Button size="lg" className="w-full sm:w-auto shadow-lifted">
                    <span>Order Today&apos;s Oota — ₹{BASE_OOTA_PRICE}</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>

                <Link href="/outlets">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    <MapPin className="w-4 h-4 text-uttara-terracotta mr-1" />
                    <span>Find Nearest Outlet</span>
                  </Button>
                </Link>
              </div>

              {/* Trust badges */}
              <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-uttara-cream-border/80 text-xs text-uttara-charcoal-muted">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-uttara-green" />
                  <span>100% Sorghum / Jowar</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-uttara-ochre" />
                  <span>5–8 Min Express Counter Pickup</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-uttara-indigo" />
                  <span>Zero Palm Oil • Preservative Free</span>
                </div>
              </div>
            </div>

            {/* Right Visual: Circular Thali Composition Framed by Subtle Jowar Geometry */}
            <div className="lg:col-span-5 relative flex justify-center">
              {/* Concentric Jowar Mandala Aura behind Plate */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <JowarMandala
                  size={420}
                  variant="terracotta"
                  opacity={0.14}
                  animated="breathe"
                  strokeWidth={1.2}
                />
              </div>

              <div className="relative mx-auto max-w-md w-full bg-white p-6 sm:p-8 rounded-2xl shadow-card border border-uttara-cream-border z-10">
                {/* Visual Representation of the Complete Oota as a Ritual Plate */}
                <div className="relative aspect-square w-full rounded-xl bg-gradient-to-br from-uttara-cream to-uttara-ochre-faint p-4 flex flex-col justify-between border border-uttara-cream-border/80 overflow-hidden">
                  
                  <div className="flex justify-between items-start z-10">
                    <Badge variant="terracotta" size="sm">Core Daily Meal</Badge>
                    <span className="text-xs font-mono font-semibold text-uttara-charcoal bg-white/90 px-2.5 py-1 rounded-md shadow-xs">
                      ₹{BASE_OOTA_PRICE}
                    </span>
                  </div>

                  {/* Visual plate diagram with mandala center */}
                  <div className="my-auto text-center py-4 relative">
                    <div className="w-44 h-44 mx-auto rounded-full border-4 border-uttara-cream-border/90 bg-uttara-ivory shadow-inner flex flex-col items-center justify-center p-3 relative">
                      {/* Background grain ring */}
                      <div className="absolute inset-2 pointer-events-none opacity-20">
                        <JowarMandala size={160} variant="ochre" animated="spin" />
                      </div>

                      <div className="text-[10px] font-semibold text-uttara-terracotta tracking-wider uppercase z-10">
                        North Karnataka
                      </div>
                      <div className="text-2xl font-display font-bold text-uttara-charcoal mt-0.5 z-10">
                        ಊಟ
                      </div>
                      <div className="text-[10px] text-uttara-charcoal-muted mt-0.5 z-10">
                        6 Sacred Elements
                      </div>
                      <div className="absolute -bottom-2.5 bg-uttara-terracotta text-white text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-xs z-10">
                        Pure Vegetarian
                      </div>
                    </div>
                  </div>

                  {/* Micro-breakdown pill */}
                  <div className="grid grid-cols-3 gap-1.5 text-center text-[10px] font-medium text-uttara-charcoal z-10">
                    <div className="bg-white/85 py-1.5 px-1 rounded border border-uttara-cream-border/60">
                      3 Jolada Rotti
                    </div>
                    <div className="bg-white/85 py-1.5 px-1 rounded border border-uttara-cream-border/60">
                      2 Hot Palyas
                    </div>
                    <div className="bg-white/85 py-1.5 px-1 rounded border border-uttara-cream-border/60">
                      Rice, Saaru, Pudi
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 text-center">
                  <div className="text-xs text-uttara-charcoal-muted">
                    Rotating Daily: <span className="font-semibold text-uttara-charcoal">Yennegayi Badanekayi & Hesaru Kalu</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Jowar Motif Divider */}
      <JowarDivider kannadaWord="ಪೂರ್ಣ ಪ್ರಮಾಣದ ಊಟ" />

      {/* Section: The Oota (The Central Product) */}
      <section className="py-12 md:py-20 bg-uttara-ivory relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            kannadaSubtitle="ಪೂರ್ಣ ಪ್ರಮಾಣದ ಊಟ"
            englishTitle="The Oota: Intentionally Simple"
            description="We do not make fifty dishes. We make one complete, authentic North Karnataka meal with deep culinary discipline."
            withMandalaAccent={true}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {DEFAULT_OOTA_COMPONENTS.map((item, index) => (
              <div
                key={item.id}
                className="bg-white p-6 rounded-brand border border-uttara-cream-border shadow-subtle hover:shadow-card transition-all flex flex-col justify-between group hover:border-uttara-terracotta/30"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-uttara-terracotta tracking-wider uppercase flex items-center gap-1.5">
                      <JowarMandala size={14} variant="terracotta" opacity={0.6} />
                      <span>0{index + 1} • {item.quantityDescription}</span>
                    </span>
                    {item.isRotating && (
                      <Badge variant="ochre" size="sm">Daily Rotating</Badge>
                    )}
                  </div>

                  <h3 className="text-lg font-display font-semibold text-uttara-charcoal mb-0.5 group-hover:text-uttara-terracotta transition-colors">
                    {item.name}
                  </h3>
                  <div className="text-xs font-kannada font-bold text-uttara-terracotta mb-2">
                    {item.kannadaName}
                  </div>
                  <p className="text-xs text-uttara-charcoal-muted leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {item.allergens && (
                  <div className="mt-4 pt-3 border-t border-uttara-cream-border/60 text-[10px] text-uttara-charcoal-faint">
                    Contains: {item.allergens.join(', ')}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link href="/menu">
              <Button size="lg">
                <span>View Today&apos;s Oota & Ingredients</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Jowar Divider */}
      <JowarDivider kannadaWord="ಸುಲಭ ಮತ್ತು ವೇಗ" />

      {/* Section: How It Works */}
      <section className="py-12 md:py-20 bg-uttara-cream border-y border-uttara-cream-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            kannadaSubtitle="ಸುಲಭ ಮತ್ತು ವೇಗ"
            englishTitle="How Uttara Works"
            description="Designed for busy Bengaluru. Minimal clicks, zero waiting."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-brand border border-uttara-cream-border shadow-subtle text-center relative overflow-hidden">
              <div className="w-12 h-12 rounded-full bg-uttara-terracotta-faint text-uttara-terracotta font-display font-bold text-xl flex items-center justify-center mx-auto mb-4 border border-uttara-terracotta/20">
                1
              </div>
              <h3 className="text-base font-display font-semibold text-uttara-charcoal mb-2">
                Choose Outlet
              </h3>
              <p className="text-xs text-uttara-charcoal-muted leading-relaxed">
                Select your closest takeaway counter across Indiranagar, Jayanagar, Malleshwaram, or Koramangala.
              </p>
            </div>

            <div className="bg-white p-8 rounded-brand border border-uttara-cream-border shadow-subtle text-center relative overflow-hidden">
              <div className="w-12 h-12 rounded-full bg-uttara-ochre-faint text-uttara-ochre-dark font-display font-bold text-xl flex items-center justify-center mx-auto mb-4 border border-uttara-ochre/20">
                2
              </div>
              <h3 className="text-base font-display font-semibold text-uttara-charcoal mb-2">
                Order Your Oota
              </h3>
              <p className="text-xs text-uttara-charcoal-muted leading-relaxed">
                Choose meal count. Pay securely in seconds via UPI or card. Receive your unique pickup token.
              </p>
            </div>

            <div className="bg-white p-8 rounded-brand border border-uttara-cream-border shadow-subtle text-center relative overflow-hidden">
              <div className="w-12 h-12 rounded-full bg-uttara-green-faint text-uttara-green font-display font-bold text-xl flex items-center justify-center mx-auto mb-4 border border-uttara-green/20">
                3
              </div>
              <h3 className="text-base font-display font-semibold text-uttara-charcoal mb-2">
                Express Counter Pickup
              </h3>
              <p className="text-xs text-uttara-charcoal-muted leading-relaxed">
                Show your 4-digit token at the outlet. Pick up your piping hot, neatly packed authentic meal in 5 minutes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section: Central Kitchen Hub & Spoke */}
      <section className="py-16 md:py-24 bg-uttara-ivory">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl border border-uttara-cream-border p-8 md:p-12 shadow-card grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative overflow-hidden">
            {/* Ambient Background Mandala */}
            <div className="absolute -right-24 -bottom-24 pointer-events-none opacity-10">
              <JowarMandala size={380} variant="terracotta" animated="reverse" />
            </div>

            <div className="lg:col-span-7 relative z-10">
              <Badge variant="terracotta" size="sm" className="mb-3">Hub & Spoke Philosophy</Badge>
              <h2 className="text-2xl md:text-4xl font-display font-bold text-uttara-charcoal tracking-tight mb-4">
                Made Centrally. <br />Served Piping Fresh.
              </h2>
              <div className="text-xs font-kannada font-semibold text-uttara-terracotta mb-3">
                ನಮ್ಮ ಕೇಂದ್ರ ಅಡುಗೆಮನೆ • ದಿನಕ್ಕೆ ಎರಡು ಬಾರಿ ತಾಜಾ ಸಾಗಾಟ
              </div>
              <p className="text-sm md:text-base text-uttara-charcoal-muted leading-relaxed mb-6">
                Instead of 20 small kitchens producing inconsistent food, our master cooks in our centralized Bengaluru facility prepare rottis, dal, and palyas under strict quality control. Dispatched in thermal containers twice daily, outlets only focus on swift assembly, courteous service, and packaging.
              </p>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 bg-uttara-cream rounded-brand border border-uttara-cream-border">
                  <div className="font-semibold text-uttara-charcoal mb-0.5">Consistent Heritage Taste</div>
                  <div className="text-uttara-charcoal-muted">Exact authentic spice blends every single day.</div>
                </div>
                <div className="p-3.5 bg-uttara-cream rounded-brand border border-uttara-cream-border">
                  <div className="font-semibold text-uttara-charcoal mb-0.5">Hygienic & Cost Effective</div>
                  <div className="text-uttara-charcoal-muted">Centralized efficiencies keep oota price at ₹139.</div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 flex flex-col gap-3 relative z-10">
              <div className="p-4 bg-uttara-cream rounded-brand border border-uttara-cream-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-uttara-terracotta text-white flex items-center justify-center shadow-xs">
                    <Flame className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-uttara-charcoal">Central Kitchen (Peenya Hub)</div>
                    <div className="text-[11px] text-uttara-charcoal-muted">Dispatches 500+ meals daily</div>
                  </div>
                </div>
                <Badge variant="green" size="sm">Active</Badge>
              </div>

              <div className="flex justify-center text-uttara-terracotta">
                <ArrowRight className="w-5 h-5 rotate-90" />
              </div>

              <div className="grid grid-cols-2 gap-2 text-center text-xs">
                <div className="p-3 bg-white border border-uttara-cream-border rounded-brand">
                  <div className="font-semibold text-uttara-charcoal">Indiranagar</div>
                  <div className="text-[10px] text-uttara-charcoal-muted">~7m turnaround</div>
                </div>
                <div className="p-3 bg-white border border-uttara-cream-border rounded-brand">
                  <div className="font-semibold text-uttara-charcoal">Jayanagar</div>
                  <div className="text-[10px] text-uttara-charcoal-muted">~8m turnaround</div>
                </div>
                <div className="p-3 bg-white border border-uttara-cream-border rounded-brand">
                  <div className="font-semibold text-uttara-charcoal">Malleshwaram</div>
                  <div className="text-[10px] text-uttara-charcoal-muted">~6m turnaround</div>
                </div>
                <div className="p-3 bg-white border border-uttara-cream-border rounded-brand">
                  <div className="font-semibold text-uttara-charcoal">Koramangala</div>
                  <div className="text-[10px] text-uttara-charcoal-muted">~9m turnaround</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Jowar Divider */}
      <JowarDivider kannadaWord="ಗ್ರಾಹಕರ ಮಾತು" />

      {/* Section: Loved by Bengaluru */}
      <section className="py-12 md:py-20 bg-uttara-cream/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            kannadaSubtitle="ಗ್ರಾಹಕರ ಮಾತು"
            englishTitle="Loved by Bengaluru"
            description="What patrons across Bengaluru say about their daily Uttara oota."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-brand border border-uttara-cream-border shadow-subtle flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1 mb-3 text-amber-500">
                    {[...Array(t.rating)].map((_, idx) => (
                      <Star key={idx} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs md:text-sm text-uttara-charcoal leading-relaxed italic mb-4">
                    &ldquo;{t.review}&rdquo;
                  </p>
                </div>

                <div className="pt-3 border-t border-uttara-cream-border flex justify-between items-center text-xs">
                  <span className="font-semibold text-uttara-charcoal">{t.name}</span>
                  <span className="text-uttara-terracotta font-medium">{t.area}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
