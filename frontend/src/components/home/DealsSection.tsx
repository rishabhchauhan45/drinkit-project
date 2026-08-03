'use client';

import Link from 'next/link';
import { Tag, ArrowRight } from 'lucide-react';
import { ProductCard } from '@/components/product/ProductCard';
import { useDeals } from '@/hooks/useProducts';
import { Button } from '@/components/ui/button';

export default function DealsSection() {
  const { data: products, isLoading } = useDeals(4);

  // Don't render section if no deals
  if (!isLoading && (!products || products.length === 0)) {
    return null;
  }

  return (
    <section className="py-16 bg-white relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-rose-50/50 to-transparent -z-10" />

      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Tag className="h-5 w-5 text-rose-500 fill-rose-100" />
              <span className="text-sm font-bold uppercase tracking-wider text-rose-500">Super Savers</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground">Deals of the Day</h2>
          </div>
          <Link href="/products?sort=discount">
            <Button variant="outline" className="group border-rose-200 hover:border-rose-300 hover:bg-rose-50 text-rose-600">
              View All Deals
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-[400px] rounded-2xl bg-muted animate-pulse" />
            ))
          ) : (
            products?.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))
          )}
        </div>
      </div>
    </section>
  );
}
