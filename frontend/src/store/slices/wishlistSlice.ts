import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface WishlistState {
  items: string[]; // product IDs
}

function loadWishlistFromStorage(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem('drinkit_wishlist');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveWishlistToStorage(items: string[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('drinkit_wishlist', JSON.stringify(items));
  }
}

const initialState: WishlistState = {
  items: loadWishlistFromStorage(),
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    toggleWishlist: (state, action: PayloadAction<string>) => {
      const index = state.items.indexOf(action.payload);
      if (index >= 0) {
        state.items.splice(index, 1);
      } else {
        state.items.push(action.payload);
      }
      saveWishlistToStorage(state.items);
    },
    removeFromWishlist: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((id) => id !== action.payload);
      saveWishlistToStorage(state.items);
    },
    clearWishlist: (state) => {
      state.items = [];
      saveWishlistToStorage([]);
    },
  },
});

export const { toggleWishlist, removeFromWishlist, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
