import api from '@/lib/api';
import type { ApiResponse } from '@/types';

export interface DashboardStats {
  metrics: {
    totalProducts: number;
    activeProducts: number;
    lowStockProducts: number;
    outOfStockProducts: number;
    totalOrders: number;
    pendingOrders: number;
    confirmedOrders: number;
    deliveredOrders: number;
    totalRevenue: number;
    activeUsers: number;
  };
  recentOrders: Array<{
    id: string;
    customer: string;
    amount: number;
    status: string;
    time: string;
  }>;
}

export interface AdminOrder {
  id: string;
  userId: string;
  user: { name: string; email: string; phone: string; };
  products: any;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
}

export interface InventoryItem {
  _id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  stockStatus: string;
}

export const adminService = {
  async getDashboardStats(): Promise<DashboardStats> {
    const response = await api.get<ApiResponse<DashboardStats>>('/admin/dashboard');
    return response.data.data;
  },

  async getOrders(params?: any): Promise<{ data: AdminOrder[], total: number, page: number }> {
    const response = await api.get('/admin/orders', { params });
    return response.data;
  },

  async getInventory(params?: any): Promise<{ data: InventoryItem[], total: number, page: number }> {
    const response = await api.get('/admin/inventory', { params });
    return response.data;
  },

  async updateInventoryStock(productId: string, stock: number): Promise<InventoryItem> {
    const response = await api.put(`/admin/inventory/${productId}`, { stock });
    return response.data.data;
  },
  
  async updateOrderStatus(orderId: string, status: string): Promise<any> {
    const response = await api.put(`/orders/${orderId}/status`, { status });
    return response.data.data;
  }
};
