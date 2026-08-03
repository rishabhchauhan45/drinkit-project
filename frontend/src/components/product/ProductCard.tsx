'use client';

import Link from 'next/link';
import { ShoppingCart, Heart, Plus } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Rating } from '@/components/ui/rating';
import { PriceDisplay } from '@/components/ui/price-display';
import { ImageWithFallback } from '@/components/ui/image-with-fallback';
import type { Product } from '@/types';
import { useCart } from '@/hooks/useCart';
import { useDispatch, useSelector } from 'react-redux';
import { toggleWishlist } from '@/store/slices/wishlistSlice';
import type { RootState } from '@/store/store';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const dispatch = useDispatch();
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);
  const isWishlisted = wishlistItems.includes(product._id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      productId: product._id,
      name: product.name,
      price: product.price,
      mrp: product.mrp,
      quantity: 1,
      image: product.images[0],
      stock: product.stock,
      volume: product.volume,
      brand: product.brand,
    });
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(toggleWishlist(product._id));
  };

  const isOutOfStock = product.stock <= 0;
  const discountPct = product.mrp > product.price 
    ? Math.round(((product.mrp - product.price) / product.mrp) * 100) 
    : 0;

  return (
    <Link href={`/product/${product._id}`} className="block h-full group">
      <Card className="h-full flex flex-col overflow-hidden hover-lift border-border/40">
        <div className="relative aspect-square overflow-hidden bg-muted/30 p-4">
          {/* Badges */}
          <div className="absolute left-3 top-3 z-10 flex flex-col gap-2">
            {discountPct > 0 && (
              <Badge variant="discount">-{discountPct}%</Badge>
            )}
            {product.tags?.includes('Trending') && (
              <Badge variant="trending">Trending</Badge>
            )}
            {product.tags?.includes('New') && (
              <Badge variant="new">New</Badge>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            onClick={handleToggleWishlist}
            className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 backdrop-blur-md shadow-sm transition-transform hover:scale-110"
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-rose-500 text-rose-500' : 'text-gray-500'}`} />
          </button>

          {/* Image */}
          <ImageWithFallback
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-contain p-4 mix-blend-multiply transition-transform duration-500 group-hover:scale-110"
          />

          {/* Out of Stock Overlay */}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center z-20">
              <Badge variant="outOfStock" className="text-sm px-4 py-1">Out of Stock</Badge>
            </div>
          )}
        </div>

        <CardContent className="flex-1 p-4 pb-2">
          <div className="text-xs text-muted-foreground mb-1">{product.brand}</div>
          <h3 className="font-semibold text-foreground line-clamp-2 min-h-[2.5rem] text-sm leading-tight group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
            <span>{product.volume}</span>
            {product.abv > 0 && (
              <>
                <span>•</span>
                <span>{product.abv}% ABV</span>
              </>
            )}
          </div>
          {product.ratings.count > 0 && (
            <div className="mt-2">
              <Rating value={product.ratings.average} count={product.ratings.count} size="sm" showValue />
            </div>
          )}
        </CardContent>

        <CardFooter className="p-4 pt-2 flex items-center justify-between gap-2">
          <PriceDisplay price={product.price} mrp={product.mrp} size="md" />
          
          <Button 
            size="icon" 
            variant={isOutOfStock ? "secondary" : "default"}
            disabled={isOutOfStock}
            onClick={handleAddToCart}
            className="shrink-0 h-9 w-9 rounded-full shadow-soft-sm"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}
