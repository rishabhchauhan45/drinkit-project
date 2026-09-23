'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { ProductCard } from '@/components/product/ProductCard';
import { useProducts } from '@/hooks/useProducts';

export default function TrendingSection() {
  const { data, isLoading } = useProducts({ limit: 10 });
  const products = data?.data || [];

  return (
    <section className="py-8 bg-white">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900">Bestsellers</h2>
            <p className="text-sm text-slate-500">Fast moving premium drinks</p>
          </div>
          <Link href="/products?sort=popular" className="flex items-center text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors">
            See All <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </div>

        <div className="flex overflow-x-auto pb-6 -mx-4 px-4 sm:mx-0 sm:px-0 gap-4 snap-x hide-scrollbar">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="min-w-[200px] md:min-w-[240px] h-[360px] rounded-xl bg-gray-100 animate-pulse shrink-0 snap-start" />
            ))
          ) : products && products.length > 0 ? (
            products.map((product) => (
              <div key={product._id} className="min-w-[200px] md:min-w-[240px] shrink-0 snap-start">
                <ProductCard product={product} />
              </div>
            ))
          ) : (
            <div className="py-12 w-full text-center text-slate-500">
              No products found.
            </div>
          )}
        </div>
      </div>
      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
}
