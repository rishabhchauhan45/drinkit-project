'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Filter, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { ProductCard } from '@/components/product/ProductCard';
import { useInfiniteProducts } from '@/hooks/useProducts';
import { Button } from '@/components/ui/button';
import { Drawer } from '@/components/ui/drawer';
import type { ProductCategory } from '@/types';
import { useInView } from 'react-intersection-observer';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

const categories = [
  { label: 'All', value: '' },
  { label: 'Whiskey', value: 'WHISKEY' },
  { label: 'Vodka', value: 'VODKA' },
  { label: 'Rum', value: 'RUM' },
  { label: 'Gin', value: 'GIN' },
  { label: 'Wine', value: 'WINE' },
  { label: 'Beer', value: 'BEER' },
  { label: 'Mixers', value: 'MIXERS' },
  { label: 'Snacks', value: 'SNACKS' },
];

const sortOptions = [
  { label: 'Most Popular', value: 'popular' },
  { label: 'Newest Arrivals', value: 'newest' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Biggest Discount', value: 'discount' },
];

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const { ref, inView } = useInView();
  
  const initialCategory = searchParams.get('category') as ProductCategory | null;
  const initialSearch = searchParams.get('search') || '';
  const initialSort = searchParams.get('sort') || 'popular';

  const [category, setCategory] = useState<ProductCategory | ''>(initialCategory || '');
  const [search, setSearch] = useState(initialSearch);
  const [sort, setSort] = useState(initialSort);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteProducts({
    category: category || undefined,
    search: search || undefined,
    sort: sort as any,
  });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  // Update state if URL params change (e.g., from search modal)
  useEffect(() => {
    const cat = searchParams.get('category') as ProductCategory | null;
    const q = searchParams.get('search');
    const s = searchParams.get('sort');
    
    if (cat !== null) setCategory(cat);
    if (q !== null) setSearch(q);
    if (s !== null) setSort(s);
  }, [searchParams]);

  const products = data?.pages.flatMap((page) => page.data) || [];
  const totalProducts = data?.pages[0]?.total || 0;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          {search ? `Search results for "${search}"` : category ? `${category} Collection` : 'All Products'}
        </h1>
        <p className="text-muted-foreground mt-2">
          Showing {products.length} of {totalProducts} products
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Desktop Sidebar Filters */}
        <div className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-24 space-y-8 rounded-2xl border bg-card p-6 shadow-soft-sm">
            
            {/* Categories */}
            <div>
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Filter className="h-4 w-4 text-primary" />
                Categories
              </h3>
              <div className="space-y-2">
                {categories.map((c) => (
                  <button
                    key={c.value}
                    onClick={() => setCategory(c.value as ProductCategory)}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors ${
                      category === c.value
                        ? 'bg-primary/10 text-primary font-medium'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range (Mock UI for now, can implement later) */}
            <div className="pt-6 border-t">
              <h3 className="font-semibold mb-4">Price Range</h3>
              <div className="flex items-center gap-2">
                <input type="number" placeholder="Min" className="w-full rounded-md border px-3 py-1.5 text-sm" />
                <span>-</span>
                <input type="number" placeholder="Max" className="w-full rounded-md border px-3 py-1.5 text-sm" />
              </div>
            </div>

          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Controls Bar */}
          <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-xl border bg-card p-4 shadow-soft-sm">
            <Button
              variant="outline"
              className="lg:hidden w-full sm:w-auto"
              onClick={() => setIsFilterOpen(true)}
              leftIcon={<SlidersHorizontal className="h-4 w-4" />}
            >
              Filters
            </Button>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <span className="text-sm font-medium whitespace-nowrap text-muted-foreground">Sort by:</span>
              <div className="relative w-full sm:w-48">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="w-full appearance-none rounded-lg border bg-background px-4 py-2 pr-10 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  {sortOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Product Grid */}
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="h-[380px] rounded-2xl bg-muted animate-pulse" />
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <Filter className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold">No products found</h3>
              <p className="text-muted-foreground max-w-md mt-2">
                Try adjusting your filters or search terms to find what you're looking for.
              </p>
              <Button 
                className="mt-6" 
                onClick={() => { setCategory(''); setSearch(''); setSort('popular'); }}
              >
                Clear all filters
              </Button>
            </div>
          )}

          {/* Infinite Scroll Trigger */}
          {hasNextPage && (
            <div ref={ref} className="mt-12 flex justify-center pb-8">
              {isFetchingNextPage ? (
                <LoadingSpinner label="Loading more products..." />
              ) : (
                <Button variant="outline" onClick={() => fetchNextPage()}>Load More</Button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      <Drawer
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        title="Filters"
        side="left"
      >
        <div className="p-6 space-y-8">
          <div>
            <h3 className="font-semibold mb-4">Categories</h3>
            <div className="space-y-2">
              {categories.map((c) => (
                <button
                  key={c.value}
                  onClick={() => {
                    setCategory(c.value as ProductCategory);
                    setIsFilterOpen(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-lg px-4 py-3 text-sm transition-colors ${
                    category === c.value
                      ? 'bg-primary text-primary-foreground font-medium shadow-soft-sm'
                      : 'bg-muted hover:bg-muted/80 text-foreground'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>
          <Button 
            className="w-full" 
            onClick={() => { setCategory(''); setIsFilterOpen(false); }}
            variant="outline"
          >
            Clear Filters
          </Button>
        </div>
      </Drawer>
    </div>
  );
}
