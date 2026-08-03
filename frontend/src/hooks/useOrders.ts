'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { orderService } from '@/services/order.service';
import type { CreateOrderRequest } from '@/types';

export function useUserOrders(userId: string) {
  return useQuery({
    queryKey: ['user-orders', userId],
    queryFn: () => orderService.getUserOrders(userId),
    enabled: !!userId,
    staleTime: 60 * 1000, // 1 minute
  });
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: ['order', id],
    queryFn: () => orderService.getOrderById(id),
    enabled: !!id,
    staleTime: 30 * 1000, // 30 seconds — orders update frequently
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateOrderRequest) => orderService.createOrder(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-orders'] });
    },
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      orderService.updateOrderStatus(id, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['order', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['user-orders'] });
    },
  });
}
