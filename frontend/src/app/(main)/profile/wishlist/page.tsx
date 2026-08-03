'use client';

import { useSelector } from 'react-redux';
import { Card, CardContent } from '@/components/ui/card';
import { ProductCard } from '@/components/product/ProductCard';
import { EmptyState } from '@/components/ui/empty-state';
import { PageLoader } from '@/components/ui/loading-spinner';
import { useProducts } from '@/hooks/useProducts';
import type { RootState } from '@/store/store';

export default function WishlistPage() {
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);
  
  // A real app might have an endpoint to fetch specific IDs, 
  // but here we just fetch popular products and filter client-side for simplicity in demo
  // Or if we had a dedicated endpoint: useWishlistProducts(wishlistItems)
  const { data, isLoading } = useProducts({ limit: 50 });

  if (isLoading) return <PageLoader />;

  const wishlistedProducts = data?.data.filter(p => wishlistItems.includes(p._id)) || [];

  if (wishlistedProducts.length === 0) {
    return (
      <Card>
        <CardContent className="p-0">
          <EmptyState
            icon="search" // using search as placeholder for heart icon
            title="Your wishlist is empty"
            description="Save your favorite drinks here to buy them later."
            actionLabel="Explore Products"
            onAction={() => window.location.href = '/products'}
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Wishlist</h1>
        <span className="text-sm text-muted-foreground">{wishlistedProducts.length} items</span>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {wishlistedProducts.map(product => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}
