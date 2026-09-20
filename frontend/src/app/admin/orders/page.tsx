'use client';

import { useState, useEffect } from 'react';
import { Search, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { adminService, AdminOrder } from '@/services/admin.service';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await adminService.getOrders({ page, limit: 12, status: statusFilter || undefined });
      setOrders(res.data);
      setTotal(res.total);
    } catch (error) {
      console.error('Failed to fetch orders', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page, statusFilter]);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await adminService.updateOrderStatus(orderId, newStatus);
      // Optimistically update the UI
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to update order status');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'DELIVERED': return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">Delivered</Badge>;
      case 'OUT_FOR_DELIVERY': return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Out for Delivery</Badge>;
      case 'PREPARING': return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">Preparing</Badge>;
      case 'PENDING': return <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100">Pending</Badge>;
      case 'CONFIRMED': return <Badge className="bg-indigo-100 text-indigo-700 hover:bg-indigo-100">Confirmed</Badge>;
      case 'CANCELLED': return <Badge className="bg-rose-100 text-rose-700 hover:bg-rose-100">Cancelled</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPaymentBadge = (status: string) => {
    switch(status) {
      case 'PAID': return <Badge className="bg-emerald-100 text-emerald-700">Paid</Badge>;
      case 'PENDING': return <Badge className="bg-amber-100 text-amber-700">Pending</Badge>;
      case 'FAILED': return <Badge className="bg-rose-100 text-rose-700">Failed</Badge>;
      case 'REFUNDED': return <Badge className="bg-blue-100 text-blue-700">Refunded</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  }

  const ORDER_STATUSES = ['PENDING', 'CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Order Management</h1>
          <p className="text-muted-foreground mt-1">View and manage customer orders.</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <select 
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className="flex h-10 w-full sm:w-48 items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          <option value="">All Statuses</option>
          {ORDER_STATUSES.map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
      </div>

      <div className="rounded-md border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50 text-left text-muted-foreground">
                <th className="p-4 font-medium">Order ID</th>
                <th className="p-4 font-medium">Customer</th>
                <th className="p-4 font-medium">Date</th>
                <th className="p-4 font-medium text-right">Amount</th>
                <th className="p-4 font-medium text-center">Payment</th>
                <th className="p-4 font-medium text-center">Status</th>
                <th className="p-4 font-medium text-right">Update Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-muted-foreground">Loading...</td>
                </tr>
              ) : orders.length > 0 ? (
                orders.map((order) => (
                  <tr key={order.id} className="group hover:bg-muted/50 transition-colors">
                    <td className="p-4 font-medium">{order.id.slice(-6).toUpperCase()}</td>
                    <td className="p-4">
                      <div>
                        <p className="font-medium text-foreground">{order.user?.name}</p>
                        <p className="text-xs text-muted-foreground">{order.user?.email}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="p-4 text-right font-medium">₹{order.totalAmount.toLocaleString('en-IN')}</td>
                    <td className="p-4 text-center">{getPaymentBadge(order.paymentStatus)}</td>
                    <td className="p-4 text-center">{getStatusBadge(order.status)}</td>
                    <td className="p-4 text-right">
                      <select 
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className="flex h-8 w-full sm:w-32 items-center justify-between rounded-md border border-input bg-background px-3 text-xs ring-offset-background ml-auto"
                      >
                        {ORDER_STATUSES.map(status => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-muted-foreground">No orders found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Basic Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {orders.length} of {total} orders
        </p>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            disabled={page === 1}
            onClick={() => setPage(p => Math.max(1, p - 1))}
          >
            Previous
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            disabled={orders.length < 12}
            onClick={() => setPage(p => p + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
