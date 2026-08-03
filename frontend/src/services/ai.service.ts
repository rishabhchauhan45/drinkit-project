import api from '@/lib/api';
import type { ApiResponse, Product } from '@/types';

export const aiService = {
  async verifyAge(data: { userId: string; documentUrl?: string }): Promise<{ verified: boolean }> {
    const response = await api.post<ApiResponse<{ verified: boolean }>>('/ai/verify-age', data);
    return response.data.data;
  },

  async getRecommendations(userId: string): Promise<Product[]> {
    const response = await api.get<ApiResponse<Product[]>>(`/ai/recommendations/${userId}`);
    return response.data.data;
  },

  async getPairings(productId: string): Promise<Product[]> {
    const response = await api.get<ApiResponse<Product[]>>(`/ai/pairings/${productId}`);
    return response.data.data;
  },
};
