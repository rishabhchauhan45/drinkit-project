'use client';

import Link from 'next/link';
import { Crown, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PremiumSection() {
  return (
    <section className="py-24 relative bg-teal-950 overflow-hidden">
      {/* Background image with overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=2070&auto=format&fit=crop" 
          alt="Premium Collection" 
          className="h-full w-full object-cover opacity-20 mix-blend-luminosity"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-teal-950 via-teal-950/90 to-transparent" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl text-white">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-sm font-medium text-amber-500 mb-6">
            <Crown className="h-4 w-4" />
            DrinkIt Black
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
            The Connoisseur&apos;s<br />Collection
          </h2>
          
          <p className="text-lg text-teal-100 mb-8 max-w-lg leading-relaxed">
            Discover our curated selection of rare single malts, vintage champagnes, and limited-edition spirits. For those who appreciate the finer things in life.
          </p>

          <Link href="/products?category=PREMIUM">
            <Button size="lg" variant="accent" className="h-14 px-8 text-base shadow-[0_0_40px_-10px_rgba(245,158,11,0.5)] group">
              Explore Premium Range
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
