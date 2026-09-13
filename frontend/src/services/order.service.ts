import api from '@/lib/api';
import type { ApiResponse, Order, CreateOrderRequest } from '@/types';

export const orderService = {
  async createOrder(data: CreateOrderRequest): Promise<Order> {
    const response = await api.post<ApiResponse<Order>>('/orders', data);
    return response.data.data;
  },

  async getOrderById(id: string): Promise<Order> {
    const response = await api.get<ApiResponse<Order>>(`/orders/${id}`);
    return response.data.data;
  },

  async getUserOrders(userId: string): Promise<Order[]> {
    const response = await api.get<ApiResponse<Order[]>>(`/orders/user/${userId}`);
    return response.data.data;
  },

  async updateOrderStatus(id: string, status: string): Promise<Order> {
    const response = await api.put<ApiResponse<Order>>(`/orders/${id}/status`, { status });
    return response.data.data;
  },
};
