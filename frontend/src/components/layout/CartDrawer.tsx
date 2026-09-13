'use client';

import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, ArrowRight, Trash2, Tag, ChevronRight, X } from 'lucide-react';
import { Drawer } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { QuantitySelector } from '@/components/ui/quantity-selector';
import { PriceDisplay } from '@/components/ui/price-display';
import { EmptyState } from '@/components/ui/empty-state';
import { setCartDrawerOpen } from '@/store/slices/uiSlice';
import type { RootState } from '@/store/store';
import { useCart } from '@/hooks/useCart';

export default function CartDrawer() {
  const dispatch = useDispatch();
  const isOpen = useSelector((state: RootState) => state.ui.isCartDrawerOpen);
  const {
    items,
    itemCount,
    subtotal,
    deliveryFee,
    tax,
    total,
    savings,
    removeItem,
    setQuantity,
    isEmpty,
  } = useCart();

  const handleClose = () => dispatch(setCartDrawerOpen(false));

  return (
    <Drawer
      isOpen={isOpen}
      onClose={handleClose}
      title={`Your Cart (${itemCount} items)`}
      side="right"
      width="max-w-md"
    >
      <div className="flex h-full flex-col bg-background">
        {/* Free Delivery Banner */}
        {!isEmpty && (
          <div className="bg-emerald-50 px-6 py-3 text-sm text-emerald-700 border-b border-emerald-100 flex items-center justify-between">
            {subtotal >= 500 ? (
              <span className="font-medium">🎉 You have unlocked Free Delivery!</span>
            ) : (
              <span>Add ₹{(500 - subtotal).toLocaleString('en-IN')} more for free delivery</span>
            )}
          </div>
        )}

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto scrollbar-thin p-6">
          {isEmpty ? (
            <div className="flex h-full items-center justify-center">
              <EmptyState
                icon="cart"
                title="Your cart is empty"
                description="Looks like you haven't added anything yet. Explore our premium selection of beverages and snacks."
                actionLabel="Start Shopping"
                onAction={handleClose}
              />
            </div>
          ) : (
            <div className="space-y-6">
              <AnimatePresence initial={false}>
                {items.map((item) => (
                  <motion.div
                    key={item.productId}
                    layout
                    initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                    animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
                    exit={{ opacity: 0, height: 0, marginBottom: 0, scale: 0.95 }}
                    className="flex gap-4"
                  >
                    {/* Product Image */}
                    <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl border bg-muted">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gray-100">
                          <ShoppingBag className="h-6 w-6 text-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="flex flex-1 flex-col justify-between">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="line-clamp-2 text-sm font-medium">{item.name}</h4>
                          <p className="mt-0.5 text-xs text-muted-foreground">{item.volume}</p>
                        </div>
                        <button
                          onClick={() => removeItem(item.productId)}
                          className="text-muted-foreground hover:text-destructive transition-colors"
                          aria-label={`Remove ${item.name}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        <PriceDisplay price={item.price} mrp={item.mrp} size="sm" />
                        <QuantitySelector
                          value={item.quantity}
                          onChange={(val) => setQuantity(item.productId, val)}
                          max={item.stock}
                          size="sm"
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Bill Details & Checkout */}
        {!isEmpty && (
          <div className="border-t bg-muted/30 p-6 shadow-[0_-4px_16px_rgba(0,0,0,0.02)]">
            {/* Bill Details */}
            <div className="mb-6 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Delivery Fee</span>
                {deliveryFee === 0 ? (
                  <span className="font-medium text-emerald-600">Free</span>
                ) : (
                  <span className="font-medium">₹{deliveryFee}</span>
                )}
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Taxes (18% GST)</span>
                <span className="font-medium">₹{Math.round(tax).toLocaleString('en-IN')}</span>
              </div>
              {savings > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Total Savings</span>
                  <span className="font-medium">-₹{savings.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="my-2 border-t border-dashed" />
              <div className="flex justify-between text-base font-bold">
                <span>Total Amount</span>
                <span>₹{Math.round(total).toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Coupons Promo */}
            <button className="mb-6 flex w-full items-center justify-between rounded-xl border border-dashed border-primary/40 bg-primary/5 px-4 py-3 hover:bg-primary/10 transition-colors">
              <div className="flex items-center gap-3">
                <Tag className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium text-primary">Apply Coupon</span>
              </div>
              <ChevronRight className="h-4 w-4 text-primary" />
            </button>

            {/* Checkout Button */}
            <Link href="/checkout" onClick={handleClose} className="block w-full">
              <Button size="lg" className="w-full gap-2 text-base shadow-soft-md">
                Proceed to Checkout
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </Drawer>
  );
}
