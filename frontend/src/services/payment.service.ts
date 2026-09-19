import api from '@/lib/api';

export const paymentService = {
  async createPaymentOrder(orderId: string) {
    const response = await api.post('/payments/create-order', { orderId });
    return response.data.data; // { razorpayOrderId, amount, currency, keyId }
  },

  async verifyPayment(data: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
    orderId: string;
  }) {
    const response = await api.post('/payments/verify', data);
    return response.data;
  }
};
