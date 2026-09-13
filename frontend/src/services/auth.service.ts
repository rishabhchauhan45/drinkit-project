import api from '@/lib/api';
import type { ApiResponse, AuthResponse, LoginRequest, RegisterRequest, User } from '@/types';

export const authService = {
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/login', data);
    const { token, user } = response.data.data;
    if (typeof window !== 'undefined') {
      localStorage.setItem('drinkit_token', token);
      localStorage.setItem('drinkit_user', JSON.stringify(user));
    }
    return response.data.data;
  },

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/register', data);
    const { token, user } = response.data.data;
    if (typeof window !== 'undefined') {
      localStorage.setItem('drinkit_token', token);
      localStorage.setItem('drinkit_user', JSON.stringify(user));
    }
    return response.data.data;
  },

  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } finally {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('drinkit_token');
        localStorage.removeItem('drinkit_user');
      }
    }
  },

  async refreshToken(): Promise<string> {
    const response = await api.post<ApiResponse<{ token: string }>>('/auth/refresh');
    const token = response.data.data.token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('drinkit_token', token);
    }
    return token;
  },

  async getProfile(): Promise<User> {
    const response = await api.get<ApiResponse<User>>('/auth/profile');
    return response.data.data;
  },

  getStoredUser(): AuthResponse['user'] | null {
    if (typeof window === 'undefined') return null;
    const stored = localStorage.getItem('drinkit_user');
    if (!stored) return null;
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  },

  getStoredToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('drinkit_token');
  },

  isAuthenticated(): boolean {
    return !!this.getStoredToken();
  },
};
