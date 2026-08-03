'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Clock, TrendingUp, ArrowRight } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import type { RootState } from '@/store/store';
import { setSearchOpen } from '@/store/slices/uiSlice';
import { useDebounce } from '@/hooks/useDebounce';
import { useSearchProducts } from '@/hooks/useProducts';
import { PriceDisplay } from '@/components/ui/price-display';

const trendingSearches = [
  'Johnnie Walker',
  'Kingfisher',
  'Sula Wine',
  'Old Monk',
  'Bira White',
  'Party Snacks',
];

export default function SearchModal() {
  const dispatch = useDispatch();
  const isOpen = useSelector((state: RootState) => state.ui.isSearchOpen);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const debouncedQuery = useDebounce(query, 300);
  const { data: searchResults, isLoading } = useSearchProducts(debouncedQuery);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Cmd+K shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        dispatch(setSearchOpen(true));
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [dispatch]);

  const handleClose = () => dispatch(setSearchOpen(false));

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Search Panel */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative mx-auto mt-20 w-full max-w-2xl px-4"
          >
            <div className="rounded-2xl bg-background shadow-soft-lg border overflow-hidden">
              {/* Search Input */}
              <div className="flex items-center gap-3 border-b px-4">
                <Search className="h-5 w-5 text-muted-foreground shrink-0" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search for drinks, brands, snacks..."
                  className="flex-1 py-4 text-base bg-transparent outline-none placeholder:text-muted-foreground"
                />
                {query && (
                  <button
                    onClick={() => setQuery('')}
                    className="rounded-md p-1 hover:bg-muted transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
                <button
                  onClick={handleClose}
                  className="rounded-md border px-2 py-1 text-xs text-muted-foreground hover:bg-muted transition-colors"
                >
                  ESC
                </button>
              </div>

              {/* Results / Suggestions */}
              <div className="max-h-[60vh] overflow-y-auto scrollbar-thin p-2">
                {debouncedQuery.length >= 2 ? (
                  // Search Results
                  <div>
                    {isLoading ? (
                      <div className="space-y-2 p-2">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="flex items-center gap-3 rounded-xl p-3">
                            <div className="h-12 w-12 rounded-lg bg-muted animate-pulse" />
                            <div className="flex-1 space-y-2">
                              <div className="h-4 w-3/4 bg-muted animate-pulse rounded" />
                              <div className="h-3 w-1/2 bg-muted animate-pulse rounded" />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : searchResults && searchResults.length > 0 ? (
                      <>
                        {searchResults.map((product) => (
                          <Link
                            key={product._id}
                            href={`/product/${product._id}`}
                            onClick={handleClose}
                            className="flex items-center gap-3 rounded-xl p-3 hover:bg-muted transition-colors"
                          >
                            <div className="h-12 w-12 rounded-lg bg-muted overflow-hidden shrink-0">
                              {product.images[0] && (
                                <img
                                  src={product.images[0]}
                                  alt={product.name}
                                  className="h-full w-full object-cover"
                                />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{product.name}</p>
                              <p className="text-xs text-muted-foreground">{product.brand} · {product.volume}</p>
                            </div>
                            <PriceDisplay price={product.price} mrp={product.mrp} size="sm" />
                          </Link>
                        ))}
                        <Link
                          href={`/products?search=${encodeURIComponent(query)}`}
                          onClick={handleClose}
                          className="flex items-center justify-center gap-2 rounded-xl p-3 text-sm font-medium text-primary hover:bg-primary/5 transition-colors"
                        >
                          View all results for &ldquo;{query}&rdquo;
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </>
                    ) : (
                      <div className="py-8 text-center text-sm text-muted-foreground">
                        No results found for &ldquo;{query}&rdquo;
                      </div>
                    )}
                  </div>
                ) : (
                  // Default suggestions
                  <div className="space-y-4 p-2">
                    <div>
                      <p className="flex items-center gap-2 px-2 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        <TrendingUp className="h-3 w-3" />
                        Trending Searches
                      </p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {trendingSearches.map((term) => (
                          <button
                            key={term}
                            onClick={() => setQuery(term)}
                            className="rounded-lg bg-muted px-3 py-1.5 text-sm hover:bg-primary/10 hover:text-primary transition-colors"
                          >
                            {term}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
