import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  user: null | { id: string; email: string; name: string; role: string };
  token: string | null;
  isAuthenticated: boolean;
  isAgeVerified: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isAgeVerified: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: AuthState['user']; token: string }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isAgeVerified = false;
    },
    setAgeVerified: (state, action: PayloadAction<boolean>) => {
      state.isAgeVerified = action.payload;
    },
  },
});

export const { setCredentials, logout, setAgeVerified } = authSlice.actions;
export default authSlice.reducer;
