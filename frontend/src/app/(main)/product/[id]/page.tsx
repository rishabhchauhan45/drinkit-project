'use client';

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Product } from '@/components/products/ProductCard';
import { useDispatch } from 'react-redux';
import { addToCart } from '@/store/slices/cartSlice';
import { ArrowLeft, ShoppingCart, ShieldCheck, Truck } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function ProductDetailsPage() {
  const params = useParams();
  const id = params.id as string;
  const dispatch = useDispatch();
  const router = useRouter();
  
  const [quantity, setQuantity] = useState(1);

  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`);
      return data.data as Product;
    },
  });

  const handleAddToCart = () => {
    if (product) {
      dispatch(addToCart({
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: quantity,
        image: product.images[0]
      }));
      // Optional: show a toast notification here
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-10 w-32 mb-8" />
        <div className="grid md:grid-cols-2 gap-12">
          <Skeleton className="aspect-square w-full rounded-2xl" />
          <div className="space-y-6">
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-8 w-1/4" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-destructive mb-4">Product not found</h2>
        <Button onClick={() => router.push('/products')}>Back to Products</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/products" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to all products
      </Link>
      
      <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
        
        {/* Image Gallery */}
        <div className="relative aspect-square bg-white rounded-3xl p-8 flex items-center justify-center shadow-sm border">
          {product.discount > 0 && (
            <Badge className="absolute top-6 left-6 z-10 text-lg py-1 px-3 bg-destructive hover:bg-destructive">
              {product.discount}% OFF
            </Badge>
          )}
          <img 
            src={product.images[0] || 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?q=80&w=600'} 
            alt={product.name} 
            className="w-full h-full object-contain drop-shadow-2xl"
          />
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <div className="text-sm font-bold text-primary uppercase tracking-widest mb-2">
            {product.brand}
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-2">{product.name}</h1>
          <div className="text-xl text-muted-foreground mb-6">{product.volume}</div>
          
          <div className="flex items-baseline gap-4 mb-6">
            <span className="text-5xl font-black">${product.price.toFixed(2)}</span>
            {product.mrp > product.price && (
              <span className="text-2xl text-muted-foreground line-through">${product.mrp.toFixed(2)}</span>
            )}
          </div>
          
          <p className="text-lg text-muted-foreground leading-relaxed mb-8">
            {product.description || "No description available for this product."}
          </p>
          
          <div className="flex items-center gap-4 mb-8">
            <div className="flex items-center border rounded-md">
              <Button variant="ghost" size="icon" onClick={() => setQuantity(Math.max(1, quantity - 1))} disabled={quantity <= 1}>
                -
              </Button>
              <div className="w-12 text-center font-medium text-lg">{quantity}</div>
              <Button variant="ghost" size="icon" onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} disabled={quantity >= product.stock}>
                +
              </Button>
            </div>
            
            <div className="text-sm text-muted-foreground">
              {product.stock} items available in stock
            </div>
          </div>

          <Button size="lg" className="w-full sm:w-auto text-lg h-14 px-8 mb-8" onClick={handleAddToCart} disabled={product.stock <= 0}>
            <ShoppingCart className="mr-2 h-5 w-5" />
            {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
          </Button>
          
          <div className="grid grid-cols-2 gap-4 pt-8 border-t">
            <div className="flex items-start gap-3">
              <ShieldCheck className="h-6 w-6 text-primary mt-0.5" />
              <div>
                <h4 className="font-semibold">ID Verification</h4>
                <p className="text-sm text-muted-foreground">Driver's License required at delivery</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Truck className="h-6 w-6 text-primary mt-0.5" />
              <div>
                <h4 className="font-semibold">Fast Delivery</h4>
                <p className="text-sm text-muted-foreground">Arrives cold in under 30 minutes</p>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
