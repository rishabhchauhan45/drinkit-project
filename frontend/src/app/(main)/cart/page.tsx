'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/useCart';

export default function CartPage() {
  const router = useRouter();
  const {
    items,
    subtotal,
    deliveryFee,
    tax,
    total,
    savings,
    isEmpty,
    setQuantity,
    removeItem,
  } = useCart();

  if (isEmpty) {
    return (
      <div className="container mx-auto px-4 py-20 min-h-[70vh] flex flex-col items-center justify-center text-center">
        <div className="h-32 w-32 bg-slate-100 rounded-full flex items-center justify-center mb-6 shadow-inner">
          <ShoppingBag className="h-12 w-12 text-slate-300" />
        </div>
        <h1 className="text-3xl font-bold text-slate-800 mb-3 tracking-tight">Your cart is empty</h1>
        <p className="text-slate-500 max-w-md mx-auto mb-8 text-lg">
          Looks like you haven't added anything to your cart yet. Discover our premium selection of drinks and snacks.
        </p>
        <Button 
          size="lg" 
          onClick={() => router.push('/products')}
          className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-md hover:shadow-lg transition-all rounded-full px-8"
        >
          Continue Shopping
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen pb-24 lg:pb-12">
      <div className="container mx-auto px-4 py-6 lg:py-10 max-w-5xl">
        <h1 className="text-2xl font-bold text-slate-800 mb-6 lg:mb-8">My Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                <h2 className="font-semibold text-slate-700 flex items-center gap-2">
                  <ShoppingBag className="h-4 w-4" /> 
                  Items ({items.length})
                </h2>
              </div>
              <div className="p-4 sm:p-6 space-y-6">
                {items.map((item) => (
                  <div key={item.productId} className="flex flex-col sm:flex-row gap-4 sm:items-center relative pb-6 border-b border-slate-50 last:border-0 last:pb-0">
                    
                    {/* Item Image */}
                    <div className="h-20 w-20 sm:h-24 sm:w-24 shrink-0 rounded-xl border border-slate-100 bg-white p-2 flex items-center justify-center relative">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="h-full w-full object-contain mix-blend-multiply" 
                      />
                    </div>

                    {/* Item Details */}
                    <div className="flex-1">
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <Link href={`/product/${item.productId}`} className="font-semibold text-slate-800 hover:text-emerald-600 transition-colors line-clamp-2 text-sm sm:text-base">
                            {item.name}
                          </Link>
                          <p className="text-xs text-slate-500 mt-1 uppercase font-medium tracking-wider">{item.brand}</p>
                          <p className="text-xs text-slate-400 mt-0.5">{item.volume}</p>
                        </div>
                        <button 
                          onClick={() => removeItem(item.productId)}
                          className="text-slate-300 hover:text-red-500 transition-colors p-1"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        {/* Price */}
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-800 text-lg">₹{item.price.toLocaleString('en-IN')}</span>
                          {item.mrp > item.price && (
                            <span className="text-sm text-slate-400 line-through">₹{item.mrp.toLocaleString('en-IN')}</span>
                          )}
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center bg-emerald-50 text-emerald-700 rounded-lg overflow-hidden border border-emerald-100 shadow-sm h-9">
                          <button 
                            onClick={() => setQuantity(item.productId, item.quantity - 1)} 
                            className="w-9 h-full flex items-center justify-center hover:bg-emerald-100 transition-colors"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="w-8 text-center font-bold text-sm">{item.quantity}</span>
                          <button 
                            onClick={() => setQuantity(item.productId, item.quantity + 1)} 
                            className="w-9 h-full flex items-center justify-center hover:bg-emerald-100 transition-colors"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Cart Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 sm:p-6 sticky top-24">
              <h3 className="font-bold text-slate-800 mb-5">Bill Summary</h3>
              
              <div className="space-y-3.5 text-sm text-slate-600 mb-6">
                <div className="flex justify-between items-center">
                  <span>Item Total</span>
                  <span className="font-medium text-slate-800">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span>Handling Charge (Tax)</span>
                  <span className="font-medium text-slate-800">₹{Math.round(tax).toLocaleString('en-IN')}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span>Delivery Fee</span>
                  {deliveryFee === 0 ? (
                    <span className="font-bold text-emerald-600 uppercase text-xs">Free</span>
                  ) : (
                    <span className="font-medium text-slate-800">₹{deliveryFee.toLocaleString('en-IN')}</span>
                  )}
                </div>
                
                {savings > 0 && (
                  <div className="flex justify-between items-center text-emerald-600 font-medium">
                    <span>Discount</span>
                    <span>-₹{savings.toLocaleString('en-IN')}</span>
                  </div>
                )}
                
                <div className="border-t border-dashed border-slate-200 my-2 pt-3 flex justify-between items-center">
                  <span className="font-bold text-slate-800 text-base">To Pay</span>
                  <span className="font-bold text-slate-800 text-lg">₹{Math.round(total).toLocaleString('en-IN')}</span>
                </div>
              </div>

              {savings > 0 && (
                <div className="mb-6 rounded-xl bg-emerald-50 p-3 text-center text-xs font-semibold text-emerald-700 border border-emerald-100 shadow-inner">
                  🎉 You are saving ₹{savings.toLocaleString('en-IN')} on this order!
                </div>
              )}

              <Button 
                onClick={() => router.push('/checkout')}
                size="lg"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base h-14 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                Proceed to Checkout
                <ArrowRight className="h-5 w-5" />
              </Button>
              <div className="mt-4 flex justify-center">
                 <p className="text-[10px] text-slate-400 font-medium tracking-wide uppercase flex items-center gap-1">
                   100% SECURE PAYMENTS VIA RAZORPAY
                 </p>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
