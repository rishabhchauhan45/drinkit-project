'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  Heart, 
  Share2, 
  Minus, 
  Plus, 
  Check, 
  ShieldCheck, 
  Truck, 
  Info,
  Star
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useProduct, useProducts } from '@/hooks/useProducts';
import { useCart } from '@/hooks/useCart';
import { toggleWishlist } from '@/store/slices/wishlistSlice';
import type { RootState } from '@/store/store';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Rating } from '@/components/ui/rating';
import { PriceDisplay } from '@/components/ui/price-display';
import { ImageWithFallback } from '@/components/ui/image-with-fallback';
import { PageLoader } from '@/components/ui/loading-spinner';
import { ProductCard } from '@/components/product/ProductCard';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;
  
  const dispatch = useDispatch();
  const { addItem, setCartDrawerOpen } = useCart();
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);
  const isWishlisted = wishlistItems.includes(productId);

  const { data: product, isLoading, isError } = useProduct(productId);
  const { data: relatedProductsData } = useProducts({ 
    category: product?.category, 
    limit: 4 
  });
  
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'details' | 'reviews'>('description');

  if (isLoading) return <PageLoader />;
  if (isError || !product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-2xl font-bold mb-2">Product not found</h2>
        <p className="text-muted-foreground mb-6">The product you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => router.push('/products')}>Back to Products</Button>
      </div>
    );
  }

  const isOutOfStock = product.stock <= 0;
  const discountPct = product.mrp > product.price 
    ? Math.round(((product.mrp - product.price) / product.mrp) * 100) 
    : 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addItem({
      productId: product._id,
      name: product.name,
      price: product.price,
      mrp: product.mrp,
      quantity,
      image: product.images[0],
      stock: product.stock,
      volume: product.volume,
      brand: product.brand,
    });
    setCartDrawerOpen(true);
  };

  const relatedProducts = relatedProductsData?.data.filter(p => p._id !== productId) || [];

  return (
    <div className="bg-background pb-16">
      {/* Breadcrumb (simplified) */}
      <div className="bg-muted/30 border-b">
        <div className="container mx-auto px-4 py-3 text-sm text-muted-foreground">
          <span className="cursor-pointer hover:text-primary" onClick={() => router.push('/')}>Home</span>
          <span className="mx-2">/</span>
          <span className="cursor-pointer hover:text-primary" onClick={() => router.push(`/products?category=${product.category}`)}>{product.category}</span>
          <span className="mx-2">/</span>
          <span className="text-foreground font-medium">{product.name}</span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          
          {/* Left: Images */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-3xl border bg-white p-8 shadow-soft-sm overflow-hidden flex items-center justify-center">
              {/* Badges */}
              <div className="absolute left-6 top-6 z-10 flex flex-col gap-2">
                {discountPct > 0 && <Badge variant="discount" className="text-sm px-3 py-1">-{discountPct}%</Badge>}
                {product.tags?.includes('Trending') && <Badge variant="trending" className="text-sm px-3 py-1">Trending</Badge>}
              </div>

              {/* Actions */}
              <div className="absolute right-6 top-6 z-10 flex flex-col gap-3">
                <button
                  onClick={() => dispatch(toggleWishlist(product._id))}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-soft-md transition-transform hover:scale-110"
                >
                  <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-rose-500 text-rose-500' : 'text-gray-500'}`} />
                </button>
                <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-soft-md transition-transform hover:scale-110">
                  <Share2 className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              <ImageWithFallback
                src={product.images[activeImage] || product.images[0]}
                alt={product.name}
                fill
                className="object-contain p-8 mix-blend-multiply transition-all duration-300"
              />
            </div>
            
            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 bg-white transition-all ${
                      activeImage === idx ? 'border-primary' : 'border-transparent hover:border-border'
                    }`}
                  >
                    <img src={img} alt={`${product.name} ${idx + 1}`} className="h-full w-full object-contain p-2 mix-blend-multiply" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Info */}
          <div className="flex flex-col">
            <div className="mb-2 text-sm font-semibold text-primary uppercase tracking-wider">{product.brand}</div>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 leading-tight">{product.name}</h1>
            
            <div className="flex flex-wrap items-center gap-4 mb-6">
              {product.ratings.count > 0 ? (
                <div className="flex items-center gap-2 bg-amber-50 px-3 py-1.5 rounded-full">
                  <Rating value={product.ratings.average} size="sm" interactive={false} />
                  <span className="text-sm font-semibold text-amber-700">{product.ratings.average.toFixed(1)}</span>
                  <span className="text-sm text-amber-600/70">({product.ratings.count} reviews)</span>
                </div>
              ) : (
                <div className="text-sm text-muted-foreground flex items-center gap-1">
                  <Star className="h-4 w-4" /> No reviews yet
                </div>
              )}
              
              <div className="h-1 w-1 rounded-full bg-border hidden sm:block" />
              <div className="text-sm font-medium text-muted-foreground">{product.volume}</div>
              {product.abv > 0 && (
                <>
                  <div className="h-1 w-1 rounded-full bg-border hidden sm:block" />
                  <div className="text-sm font-medium text-muted-foreground">{product.abv}% ABV</div>
                </>
              )}
            </div>

            <div className="mb-8">
              <PriceDisplay price={product.price} mrp={product.mrp} size="lg" />
              <p className="text-xs text-muted-foreground mt-2">Inclusive of all taxes</p>
            </div>

            {/* Add to Cart Section */}
            <div className="rounded-2xl border bg-card p-6 shadow-soft-sm mb-8">
              {isOutOfStock ? (
                <div className="text-center py-4">
                  <Badge variant="outOfStock" className="mb-3 text-sm px-4 py-1.5">Out of Stock</Badge>
                  <p className="text-sm text-muted-foreground">This item is currently unavailable.</p>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row gap-4 items-center">
                  <div className="flex items-center gap-4 bg-muted/50 p-2 rounded-xl border w-full sm:w-auto justify-between">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="h-10 w-10 rounded-lg bg-background shadow-sm flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-50"
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-8 text-center font-semibold text-lg">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="h-10 w-10 rounded-lg bg-background shadow-sm flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-50"
                      disabled={quantity >= product.stock}
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <Button 
                    size="lg" 
                    className="w-full h-14 text-base shadow-soft-md"
                    onClick={handleAddToCart}
                  >
                    Add to Cart • ₹{(product.price * quantity).toLocaleString('en-IN')}
                  </Button>
                </div>
              )}
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="flex items-start gap-3 rounded-xl bg-emerald-50 p-4">
                <ShieldCheck className="h-6 w-6 text-emerald-600 mt-0.5 shrink-0" />
                <div>
                  <div className="font-semibold text-emerald-900 text-sm">100% Authentic</div>
                  <div className="text-xs text-emerald-700 mt-0.5">Sourced directly from brands</div>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-xl bg-blue-50 p-4">
                <Truck className="h-6 w-6 text-blue-600 mt-0.5 shrink-0" />
                <div>
                  <div className="font-semibold text-blue-900 text-sm">Fast Delivery</div>
                  <div className="text-xs text-blue-700 mt-0.5">Delivered within 30 minutes</div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b flex gap-6 mb-6">
              {['description', 'details', 'reviews'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`pb-3 text-sm font-medium capitalize border-b-2 transition-colors ${
                    activeTab === tab 
                      ? 'border-primary text-primary' 
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="text-sm text-foreground/80 leading-relaxed">
              {activeTab === 'description' && (
                <p>{product.description || 'No description available for this product.'}</p>
              )}
              {activeTab === 'details' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-3 border-b pb-2">
                    <span className="text-muted-foreground">Brand</span>
                    <span className="col-span-2 font-medium">{product.brand}</span>
                  </div>
                  <div className="grid grid-cols-3 border-b pb-2">
                    <span className="text-muted-foreground">Category</span>
                    <span className="col-span-2 font-medium">{product.category}</span>
                  </div>
                  <div className="grid grid-cols-3 border-b pb-2">
                    <span className="text-muted-foreground">Volume</span>
                    <span className="col-span-2 font-medium">{product.volume}</span>
                  </div>
                  <div className="grid grid-cols-3 border-b pb-2">
                    <span className="text-muted-foreground">ABV</span>
                    <span className="col-span-2 font-medium">{product.abv}%</span>
                  </div>
                </div>
              )}
              {activeTab === 'reviews' && (
                <div className="text-center py-6">
                  <Info className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                  <p>Reviews feature coming soon.</p>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="container mx-auto px-4 py-12 mt-8 border-t">
          <h2 className="text-2xl font-bold tracking-tight mb-8">Similar Products You Might Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedProducts.map(p => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
