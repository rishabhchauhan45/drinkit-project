import api from '@/lib/api';

export const deliveryService = {
  async getAssignedOrders(): Promise<any[]> {
    const response = await api.get('/delivery/orders');
    return response.data.data;
  },

  async updateOrderStatus(orderId: string, status: string): Promise<any> {
    const response = await api.put(`/delivery/orders/${orderId}/status`, { status });
    return response.data.data;
  },

  async updateLocation(lat: number, lng: number, orderId?: string): Promise<any> {
    const response = await api.post('/delivery/location', { lat, lng, orderId });
    return response.data;
  },

  async toggleOnlineStatus(isOnline: boolean): Promise<any> {
    const response = await api.post('/delivery/status', { isOnline });
    return response.data.data;
  }
};
