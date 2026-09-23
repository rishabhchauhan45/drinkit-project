'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { ProductCard } from '@/components/product/ProductCard';
import { useProducts } from '@/hooks/useProducts';

interface ProductRowProps {
  title: string;
  subtitle: string;
  href: string;
  filters: any;
}

export default function ProductRow({ title, subtitle, href, filters }: ProductRowProps) {
  const { data, isLoading } = useProducts(filters);
  const products = data?.data || [];

  return (
    <section className="py-6 bg-white">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900">{title}</h2>
            <p className="text-sm text-slate-500">{subtitle}</p>
          </div>
          <Link href={href} className="flex items-center text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors">
            See All <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </div>

        <div className="flex overflow-x-auto pb-6 -mx-4 px-4 sm:mx-0 sm:px-0 gap-4 snap-x hide-scrollbar">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="min-w-[180px] md:min-w-[220px] h-[340px] rounded-xl bg-gray-100 animate-pulse shrink-0 snap-start" />
            ))
          ) : products && products.length > 0 ? (
            products.map((product) => (
              <div key={product._id} className="min-w-[180px] md:min-w-[220px] shrink-0 snap-start">
                <ProductCard product={product} />
              </div>
            ))
          ) : (
            <div className="py-8 w-full text-center text-slate-500">
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
