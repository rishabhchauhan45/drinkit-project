import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
  phone?: string;
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isAgeVerified: boolean;
  isLoading: boolean;
}

// Hydrate from localStorage
function getInitialState(): AuthState {
  if (typeof window === 'undefined') {
    return {
      user: null,
      token: null,
      isAuthenticated: false,
      isAgeVerified: false,
      isLoading: false,
    };
  }

  try {
    const token = localStorage.getItem('drinkit_token');
    const userStr = localStorage.getItem('drinkit_user');
    const user = userStr ? JSON.parse(userStr) : null;
    const isAgeVerified = localStorage.getItem('drinkit_age_verified') === 'true';

    return {
      user,
      token,
      isAuthenticated: !!token && !!user,
      isAgeVerified,
      isLoading: false,
    };
  } catch {
    return {
      user: null,
      token: null,
      isAuthenticated: false,
      isAgeVerified: false,
      isLoading: false,
    };
  }
}

const authSlice = createSlice({
  name: 'auth',
  initialState: getInitialState(),
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: AuthUser; token: string }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.isLoading = false;

      if (typeof window !== 'undefined') {
        localStorage.setItem('drinkit_token', action.payload.token);
        localStorage.setItem('drinkit_user', JSON.stringify(action.payload.user));
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isAgeVerified = false;
      state.isLoading = false;

      if (typeof window !== 'undefined') {
        localStorage.removeItem('drinkit_token');
        localStorage.removeItem('drinkit_user');
        localStorage.removeItem('drinkit_age_verified');
      }
    },
    setAgeVerified: (state, action: PayloadAction<boolean>) => {
      state.isAgeVerified = action.payload;
      if (typeof window !== 'undefined') {
        localStorage.setItem('drinkit_age_verified', String(action.payload));
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setCredentials, logout, setAgeVerified, setLoading } = authSlice.actions;
export default authSlice.reducer;
