'use client';

import Link from 'next/link';
import { ArrowRight, Flame } from 'lucide-react';
import { ProductCard } from '@/components/product/ProductCard';
import { useFeaturedProducts } from '@/hooks/useProducts';
import { Button } from '@/components/ui/button';

export default function TrendingSection() {
  const { data: products, isLoading } = useFeaturedProducts(4);

  return (
    <section className="py-16 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Flame className="h-5 w-5 text-orange-500 fill-orange-500" />
              <span className="text-sm font-bold uppercase tracking-wider text-orange-500">Trending Now</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground">Most Popular Choices</h2>
          </div>
          <Link href="/products?sort=popular">
            <Button variant="outline" className="group">
              View All
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {isLoading ? (
            // Skeleton loaders
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-[400px] rounded-2xl bg-muted animate-pulse" />
            ))
          ) : products && products.length > 0 ? (
            products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))
          ) : (
            <div className="col-span-full py-12 text-center text-muted-foreground">
              No trending products found.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
