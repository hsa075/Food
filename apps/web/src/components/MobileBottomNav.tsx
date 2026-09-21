'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Utensils, MapPin, ShoppingBag, User } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const MobileBottomNav: React.FC = () => {
  const pathname = usePathname();
  const { totalItems } = useCart();

  const items = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/menu', label: "Oota", icon: Utensils },
    { href: '/outlets', label: 'Outlets', icon: MapPin },
    { href: '/cart', label: 'Cart', icon: ShoppingBag, badge: totalItems },
    { href: '/account', label: 'Account', icon: User },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-uttara-cream-border py-1 px-2 safe-area-pb">
      <div className="flex items-center justify-around">
        {items.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1.5 px-3 min-w-[56px] relative transition-colors ${
                isActive ? 'text-uttara-terracotta' : 'text-uttara-charcoal-muted hover:text-uttara-charcoal'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.25]' : 'stroke-2'}`} />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1 -right-2.5 w-4 h-4 bg-uttara-terracotta text-white rounded-full text-[9px] font-bold flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] mt-1 font-medium ${isActive ? 'font-semibold' : ''}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
