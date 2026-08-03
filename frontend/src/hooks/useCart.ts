'use client';

import { useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '@/store/store';
import {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  applyCoupon,
  removeCoupon,
} from '@/store/slices/cartSlice';
import { setCartDrawerOpen as setUiCartDrawerOpen } from '@/store/slices/uiSlice';
import type { CartItem } from '@/types';

export function useCart() {
  const dispatch = useDispatch<AppDispatch>();
  const { items, coupon, couponDiscount } = useSelector((state: RootState) => state.cart);

  const itemCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );

  const deliveryFee = subtotal > 500 ? 0 : 40;

  const tax = useMemo(() => subtotal * 0.18, [subtotal]);

  const total = useMemo(
    () => subtotal + deliveryFee + tax - couponDiscount,
    [subtotal, deliveryFee, tax, couponDiscount]
  );

  const savings = useMemo(
    () =>
      items.reduce(
        (sum, item) => sum + (item.mrp - item.price) * item.quantity,
        0
      ) + couponDiscount,
    [items, couponDiscount]
  );

  const addItem = useCallback(
    (item: CartItem) => {
      dispatch(addToCart(item));
    },
    [dispatch]
  );

  const removeItem = useCallback(
    (productId: string) => {
      dispatch(removeFromCart(productId));
    },
    [dispatch]
  );

  const setQuantity = useCallback(
    (productId: string, quantity: number) => {
      if (quantity <= 0) {
        dispatch(removeFromCart(productId));
      } else {
        dispatch(updateQuantity({ productId, quantity }));
      }
    },
    [dispatch]
  );

  const clear = useCallback(() => {
    dispatch(clearCart());
  }, [dispatch]);

  const setCoupon = useCallback(
    (code: string, discount: number) => {
      dispatch(applyCoupon({ code, discount }));
    },
    [dispatch]
  );

  const clearCoupon = useCallback(() => {
    dispatch(removeCoupon());
  }, [dispatch]);

  const isInCart = useCallback(
    (productId: string) => items.some((item) => item.productId === productId),
    [items]
  );

  const getItemQuantity = useCallback(
    (productId: string) => {
      const item = items.find((i) => i.productId === productId);
      return item?.quantity || 0;
    },
    [items]
  );

  const setCartDrawerOpen = useCallback(
    (isOpen: boolean) => {
      dispatch(setUiCartDrawerOpen(isOpen));
    },
    [dispatch]
  );

  return {
    items,
    itemCount,
    subtotal,
    deliveryFee,
    tax,
    total,
    savings,
    coupon,
    couponDiscount,
    addItem,
    removeItem,
    setQuantity,
    clear,
    setCoupon,
    clearCoupon,
    isInCart,
    getItemQuantity,
    setCartDrawerOpen,
    isEmpty: items.length === 0,
  };
}
