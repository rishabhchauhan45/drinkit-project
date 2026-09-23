'use client';

import Link from 'next/link';
import { Heart, Plus, Minus } from 'lucide-react';
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
  const { addItem, isInCart, getItemQuantity, setQuantity } = useCart();
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

  const inCart = isInCart(product._id);
  const qty = getItemQuantity(product._id);

  return (
    <Link href={`/product/${product._id}`} className="block h-full group">
      <Card className="h-full flex flex-col overflow-hidden hover:shadow-md transition-shadow border-gray-200">
        <div className="relative aspect-square overflow-hidden bg-gray-50 p-4 border-b border-gray-100">
          {/* Badges */}
          <div className="absolute left-2 top-2 z-10 flex flex-col gap-1">
            {discountPct > 0 && (
              <div className="bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm">
                {discountPct}% OFF
              </div>
            )}
            {product.tags?.includes('Trending') && (
              <div className="bg-yellow-400 text-yellow-900 text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm">
                TRENDING
              </div>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            onClick={handleToggleWishlist}
            className="absolute right-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 shadow-sm transition-transform hover:scale-110"
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart className={`h-3.5 w-3.5 ${isWishlisted ? 'fill-rose-500 text-rose-500' : 'text-gray-400'}`} />
          </button>

          {/* Image */}
          <ImageWithFallback
            src={product.images?.[0] || ''}
            alt={product.name}
            fill
            className="object-contain p-4 mix-blend-multiply transition-transform duration-300 group-hover:scale-105"
          />

          {/* Out of Stock Overlay */}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px] flex items-center justify-center z-20">
              <span className="bg-gray-800 text-white text-xs font-bold px-3 py-1 rounded-full">Out of Stock</span>
            </div>
          )}
        </div>

        <CardContent className="flex-1 p-3 pb-2 flex flex-col">
          <div className="text-[10px] uppercase font-bold text-gray-500 mb-1 tracking-wider">{product.brand}</div>
          <h3 className="font-semibold text-slate-800 line-clamp-2 min-h-[2.5rem] text-sm leading-tight">
            {product.name}
          </h3>
          <div className="mt-1.5 flex items-center gap-1.5 text-xs text-gray-500 font-medium">
            <span>{product.volume}</span>
          </div>
        </CardContent>

        <CardFooter className="p-3 pt-0 flex flex-col gap-3">
          <div className="flex items-center justify-between w-full">
            <PriceDisplay price={product.price} mrp={product.mrp} size="sm" />
            
            <div onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
              {inCart ? (
                <div className="flex items-center bg-emerald-600 text-white rounded-lg overflow-hidden h-8 shadow-sm">
                  <button 
                    onClick={() => setQuantity(product._id, qty - 1)} 
                    className="w-8 h-full flex items-center justify-center hover:bg-emerald-700 transition-colors"
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="w-6 text-center font-bold text-sm bg-emerald-600">{qty}</span>
                  <button 
                    onClick={() => setQuantity(product._id, qty + 1)} 
                    className="w-8 h-full flex items-center justify-center hover:bg-emerald-700 transition-colors"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
              ) : (
                <Button 
                  size="sm" 
                  variant="outline"
                  disabled={isOutOfStock}
                  onClick={handleAddToCart}
                  className="h-8 px-4 border-emerald-600 text-emerald-700 font-bold hover:bg-emerald-50 hover:text-emerald-800 bg-emerald-50/50 uppercase text-xs rounded-lg"
                >
                  ADD
                </Button>
              )}
            </div>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
