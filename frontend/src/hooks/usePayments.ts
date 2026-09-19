'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { paymentService } from '@/services/payment.service';

export function useCreatePaymentOrder() {
  return useMutation({
    mutationFn: (orderId: string) => paymentService.createPaymentOrder(orderId),
  });
}

export function useVerifyPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      razorpay_order_id: string;
      razorpay_payment_id: string;
      razorpay_signature: string;
      orderId: string;
    }) => paymentService.verifyPayment(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['order', variables.orderId] });
      queryClient.invalidateQueries({ queryKey: ['user-orders'] });
    },
  });
}
