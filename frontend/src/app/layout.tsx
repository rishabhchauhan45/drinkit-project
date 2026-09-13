import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { cn } from '@/lib/utils';
import Providers from '@/components/Providers';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'DrinkIt — Premium Alcohol & Snacks Delivery',
    template: '%s | DrinkIt',
  },
  description:
    'Get premium alcohol, craft beers, wines, spirits, and snacks delivered to your doorstep in minutes. Fast, reliable, and compliant delivery.',
  keywords: [
    'alcohol delivery',
    'beer delivery',
    'wine delivery',
    'whiskey',
    'spirits',
    'snacks',
    'quick delivery',
    'DrinkIt',
  ],
  authors: [{ name: 'DrinkIt Technologies' }],
  openGraph: {
    title: 'DrinkIt — Premium Alcohol & Snacks Delivery',
    description:
      'Get premium alcohol, craft beers, wines, spirits, and snacks delivered to your doorstep in minutes.',
    type: 'website',
    locale: 'en_US',
    siteName: 'DrinkIt',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cn('font-sans', inter.variable)}>
      <body className="min-h-screen bg-background font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
