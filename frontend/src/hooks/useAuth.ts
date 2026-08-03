'use client';

import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import type { RootState, AppDispatch } from '@/store/store';
import { setCredentials, logout as logoutAction, setLoading } from '@/store/slices/authSlice';
import { authService } from '@/services/auth.service';
import type { LoginRequest, RegisterRequest } from '@/types';

export function useAuth() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { user, token, isAuthenticated, isAgeVerified, isLoading } = useSelector(
    (state: RootState) => state.auth
  );

  const login = useCallback(
    async (data: LoginRequest) => {
      dispatch(setLoading(true));
      try {
        const result = await authService.login(data);
        dispatch(setCredentials({ user: result.user, token: result.token }));
        return result;
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch]
  );

  const register = useCallback(
    async (data: RegisterRequest) => {
      dispatch(setLoading(true));
      try {
        const result = await authService.register(data);
        dispatch(setCredentials({ user: result.user, token: result.token }));
        return result;
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch]
  );

  const logout = useCallback(async () => {
    await authService.logout();
    dispatch(logoutAction());
    router.push('/');
  }, [dispatch, router]);

  const isAdmin = user?.role === 'ADMIN';
  const isDeliveryPartner = user?.role === 'DELIVERY_PARTNER';

  return {
    user,
    token,
    isAuthenticated,
    isAgeVerified,
    isLoading,
    isAdmin,
    isDeliveryPartner,
    login,
    register,
    logout,
  };
}
