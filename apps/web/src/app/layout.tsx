import type { Metadata, Viewport } from 'next';
import '../styles/globals.css';
import { AuthProvider } from '../context/AuthContext';
import { CartProvider } from '../context/CartContext';
import { ToastProvider } from '../context/Toast';
import { Navbar } from '../components/Navbar';
import { MobileBottomNav } from '../components/MobileBottomNav';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Uttara | Simple Oota. North Karnataka Soul.',
  description: 'Authentic North Karnataka Jolada Rotti, Yennegayi Badanekayi, Bele Saaru and Chutney Pudi. Centrally cooked, served fresh across Bengaluru outlets.',
  keywords: ['North Karnataka Food', 'Jolada Rotti', 'Bengaluru Food', 'Uttara Karnataka Oota', 'Takeaway Bengaluru', 'Indiranagar Oota'],
  authors: [{ name: 'Uttara Food Brand' }],
  openGraph: {
    title: 'Uttara | Simple Oota. North Karnataka Soul.',
    description: 'Authentic North Karnataka Jolada Rotti Oota in Bengaluru.',
    siteName: 'Uttara',
    locale: 'en_IN',
    type: 'website',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#9E472A',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-uttara-ivory text-uttara-charcoal selection:bg-uttara-terracotta/20 selection:text-uttara-terracotta antialiased">
        <AuthProvider>
          <CartProvider>
            <ToastProvider>
              <Navbar />
              <main className="flex-1 pb-24 md:pb-16">{children}</main>

              {/* Minimal Brand Footer */}
              <footer className="bg-uttara-cream border-t border-uttara-cream-border text-uttara-charcoal-muted text-xs py-12 px-4 sm:px-6 lg:px-8 hidden md:block">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
                  <div className="space-y-3">
                    <div className="flex flex-col">
                      <span className="text-xl font-serif font-bold text-uttara-charcoal tracking-tight">
                        UTTARA
                      </span>
                      <span className="text-[10px] tracking-widest uppercase text-uttara-terracotta font-medium">
                        North Karnataka Oota
                      </span>
                    </div>
                    <p className="text-xs text-uttara-charcoal-muted leading-relaxed">
                      Simple oota. North Karnataka soul. Prepared centrally in our hub kitchen and dispatched fresh to Bengaluru neighborhood counters.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-uttara-charcoal mb-3 uppercase tracking-wider text-[11px]">
                      Bengaluru Outlets
                    </h4>
                    <ul className="space-y-2 text-xs">
                      <li>Indiranagar (100 Feet Rd)</li>
                      <li>Jayanagar (4th Block)</li>
                      <li>Malleshwaram (8th Cross)</li>
                      <li>Koramangala (80 Feet Rd)</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-uttara-charcoal mb-3 uppercase tracking-wider text-[11px]">
                      Counter Hours
                    </h4>
                    <p className="text-xs leading-relaxed">
                      Lunch: 11:30 AM – 3:30 PM<br />
                      Dinner: 6:30 PM – 10:30 PM<br />
                      Fresh batches dispatched twice daily.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-uttara-charcoal mb-3 uppercase tracking-wider text-[11px]">
                      Portals
                    </h4>
                    <ul className="space-y-2 text-xs">
                      <li><Link href="/staff" className="hover:text-uttara-terracotta">Outlet Staff Counter</Link></li>
                      <li><Link href="/kitchen" className="hover:text-uttara-terracotta">Central Kitchen Hub</Link></li>
                      <li><Link href="/admin" className="hover:text-uttara-terracotta">Admin Dashboard</Link></li>
                      <li><Link href="/account" className="hover:text-uttara-terracotta">Customer Loyalty</Link></li>
                    </ul>
                  </div>
                </div>

                <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-uttara-cream-border/80 flex flex-col sm:flex-row justify-between items-center text-[11px] text-uttara-charcoal-faint">
                  <p>© {new Date().getFullYear()} Uttara Foods Private Limited. Made in Bengaluru.</p>
                  <p className="mt-2 sm:mt-0">Deccan culinary heritage • Pure vegetarian kitchen</p>
                </div>
              </footer>

              <MobileBottomNav />
            </ToastProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
