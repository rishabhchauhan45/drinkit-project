import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { CartItem } from '@/types';

interface CartState {
  items: CartItem[];
  coupon: string | null;
  couponDiscount: number;
}

function loadCartFromStorage(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem('drinkit_cart');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveCartToStorage(items: CartItem[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('drinkit_cart', JSON.stringify(items));
  }
}

const initialState: CartState = {
  items: loadCartFromStorage(),
  coupon: null,
  couponDiscount: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const existingItem = state.items.find(
        (i) => i.productId === action.payload.productId
      );
      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
      saveCartToStorage(state.items);
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((i) => i.productId !== action.payload);
      saveCartToStorage(state.items);
    },
    updateQuantity: (
      state,
      action: PayloadAction<{ productId: string; quantity: number }>
    ) => {
      const item = state.items.find(
        (i) => i.productId === action.payload.productId
      );
      if (item) {
        item.quantity = Math.max(1, Math.min(action.payload.quantity, item.stock));
      }
      saveCartToStorage(state.items);
    },
    clearCart: (state) => {
      state.items = [];
      state.coupon = null;
      state.couponDiscount = 0;
      saveCartToStorage([]);
    },
    applyCoupon: (
      state,
      action: PayloadAction<{ code: string; discount: number }>
    ) => {
      state.coupon = action.payload.code;
      state.couponDiscount = action.payload.discount;
    },
    removeCoupon: (state) => {
      state.coupon = null;
      state.couponDiscount = 0;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  applyCoupon,
  removeCoupon,
} = cartSlice.actions;
export default cartSlice.reducer;
