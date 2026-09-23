import api from '@/lib/api';

export interface Coupon {
  id?: string;
  code: string;
  discountType: 'PERCENTAGE' | 'FLAT';
  discountValue: number;
  minOrderValue?: number | null;
  maxDiscount?: number | null;
  expiryDate: string;
  isActive?: boolean;
  usageLimit: number;
  usedCount?: number;
}

export const couponService = {
  // Admin routes
  getCoupons: async () => {
    const res = await api.get('/coupons');
    return res.data;
  },
  
  createCoupon: async (data: Partial<Coupon>) => {
    const res = await api.post('/coupons', data);
    return res.data;
  },

  updateCoupon: async (id: string, data: Partial<Coupon>) => {
    const res = await api.put(`/coupons/${id}`, data);
    return res.data;
  },

  deactivateCoupon: async (id: string) => {
    const res = await api.patch(`/coupons/${id}/deactivate`);
    return res.data;
  },

  // Public routes
  applyCoupon: async (code: string, cartTotal: number) => {
    const res = await api.post('/coupons/apply', { code, cartTotal });
    return res.data;
  }
};
