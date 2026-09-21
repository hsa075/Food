'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag, MapPin, User, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { JowarMandala } from './ui/JowarMandala/JowarMandala';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { totalItems } = useCart();
  const { user, selectedOutlet } = useAuth();

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/menu', label: "Today's Oota", kannada: 'ಇವತ್ತಿನ ಊಟ' },
    { href: '/outlets', label: 'Outlets', kannada: 'ಶಾಖೆಗಳು' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-uttara-ivory/95 backdrop-blur-md border-b border-uttara-cream-border">
      {/* Top subtle decorative accent */}
      <div className="ilkal-pattern-border w-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Identity with Jowar Mandala mark */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2.5 group">
              {/* Jowar Mandala Brand Emblem */}
              <div className="w-8 h-8 rounded-full bg-uttara-terracotta-faint border border-uttara-terracotta/25 flex items-center justify-center group-hover:border-uttara-terracotta transition-colors shadow-xs">
                <JowarMandala
                  size={22}
                  variant="terracotta"
                  strokeWidth={1.4}
                  className="group-hover:rotate-45 transition-transform duration-500"
                />
              </div>

              <div className="flex flex-col">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xl md:text-2xl font-display font-bold text-uttara-charcoal tracking-tight group-hover:text-uttara-terracotta transition-colors">
                    UTTARA
                  </span>
                  <span className="text-xs font-kannada font-bold text-uttara-terracotta">
                    ಉತ್ತರ
                  </span>
                </div>
                <span className="text-[9px] tracking-widest uppercase text-uttara-charcoal-muted -mt-0.5 font-medium">
                  North Karnataka Oota
                </span>
              </div>
            </Link>

            {/* Selected Outlet Pill */}
            <Link
              href="/outlets"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 bg-uttara-cream border border-uttara-cream-border rounded-full text-xs text-uttara-charcoal hover:border-uttara-terracotta/40 transition-colors"
            >
              <MapPin className="w-3.5 h-3.5 text-uttara-terracotta" />
              <span className="font-medium truncate max-w-[140px]">
                {selectedOutlet ? selectedOutlet.locality : 'Select Outlet'}
              </span>
            </Link>
          </div>

          {/* Desktop Nav Links with Kannada accents */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-uttara-charcoal">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`transition-colors py-1 relative flex items-baseline gap-1 ${
                    isActive
                      ? 'text-uttara-terracotta font-semibold'
                      : 'text-uttara-charcoal hover:text-uttara-terracotta'
                  }`}
                >
                  <span>{link.label}</span>
                  {link.kannada && (
                    <span className="text-[10px] font-kannada opacity-60">
                      ({link.kannada})
                    </span>
                  )}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-uttara-terracotta rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Actions: Cart & Account */}
          <div className="flex items-center gap-3">
            {/* Quick Links for role dashboards if staff/kitchen/admin */}
            {user && user.role !== 'customer' && (
              <Link
                href={user.role === 'admin' ? '/admin' : user.role === 'kitchen_manager' ? '/kitchen' : '/staff'}
                className="hidden lg:inline-flex items-center gap-1 text-xs px-2.5 py-1 bg-amber-50 border border-amber-200 text-amber-900 rounded-md font-medium"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span className="capitalize">{user.role.replace('_', ' ')}</span>
              </Link>
            )}

            <Link
              href="/cart"
              className="relative p-2.5 rounded-brand text-uttara-charcoal hover:bg-uttara-cream transition-colors"
              aria-label="View Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5 text-uttara-charcoal" />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-uttara-terracotta text-white rounded-full text-[11px] font-bold flex items-center justify-center animate-scaleIn">
                  {totalItems}
                </span>
              )}
            </Link>

            <Link
              href="/account"
              className="hidden sm:inline-flex items-center gap-2 p-2 px-3 rounded-brand text-xs font-medium text-uttara-charcoal hover:bg-uttara-cream transition-colors border border-transparent hover:border-uttara-cream-border"
            >
              <User className="w-4 h-4 text-uttara-charcoal-muted" />
              <span>{user ? user.name.split(' ')[0] : 'Sign In'}</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};
