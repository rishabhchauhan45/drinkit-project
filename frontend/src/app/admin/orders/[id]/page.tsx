'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Clock, MapPin, Package, CreditCard, Truck, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { orderService } from '@/services/order.service';
import type { Order } from '@/types';

import { adminService } from '@/services/admin.service';

export default function AdminOrderDetailsPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [deliveryPartners, setDeliveryPartners] = useState<any[]>([]);
  const [selectedPartner, setSelectedPartner] = useState('');

  useEffect(() => {
    const fetchOrderAndPartners = async () => {
      try {
        setLoading(true);
        const data = await orderService.getOrderById(id);
        setOrder(data);
        
        // Also fetch delivery partners for assignment
        const partners = await adminService.getDeliveryPartners();
        setDeliveryPartners(partners);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to load order details');
      } finally {
        setLoading(false);
      }
    };
    fetchOrderAndPartners();
  }, [id]);

  const handleStatusChange = async (newStatus: string) => {
    try {
      await orderService.updateOrderStatus(id, newStatus);
      setOrder(prev => prev ? { ...prev, status: newStatus as any } : null);
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to update order status');
    }
  };

  const handleAssignPartner = async () => {
    if (!selectedPartner) return;
    try {
      await adminService.assignDeliveryPartner(id, selectedPartner);
      alert('Delivery Partner Assigned Successfully!');
      setOrder(prev => prev ? { ...prev, deliveryPartnerId: selectedPartner, status: 'OUT_FOR_DELIVERY' as any } : null);
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to assign partner');
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
  };

  if (loading) {
    return <div className="p-8 text-center text-muted-foreground">Loading order details...</div>;
  }

  if (error || !order) {
    return (
      <div className="p-8 text-center text-rose-500 font-medium space-y-4">
        <p>{error || 'Order not found'}</p>
        <Button onClick={() => router.push('/admin/orders')} variant="outline">Back to Orders</Button>
      </div>
    );
  }

  const ORDER_STATUSES = ['PENDING', 'CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/admin/orders">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Order #{order.id.slice(-6).toUpperCase()}</h1>
            <p className="text-muted-foreground mt-1 flex items-center gap-2">
              <Clock className="h-4 w-4" /> 
              {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <select 
            value={order.status}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="flex h-10 w-40 items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            {ORDER_STATUSES.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Package className="h-5 w-5" /> Order Items
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="divide-y">
                {(order.products as any[]).map((item: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
                    <div className="flex items-center gap-4">
                      {item.image && (
                        <img src={item.image} alt={item.name} className="h-12 w-12 rounded-md object-cover bg-muted" />
                      )}
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">Qty: {item.quantity} × ₹{item.price.toLocaleString('en-IN')}</p>
                      </div>
                    </div>
                    <div className="font-medium text-right">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <User className="h-5 w-5" /> Customer Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Name</p>
                <p className="font-medium">{(order.user as any)?.name || 'Unknown'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Email</p>
                <p className="font-medium">{(order.user as any)?.email || 'Unknown'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Phone</p>
                <p className="font-medium">{(order.user as any)?.phone || 'Unknown'}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Truck className="h-5 w-5" /> Delivery Partner
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {(order as any).deliveryPartnerId ? (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Assigned Partner ID</p>
                  <p className="font-medium">{(order as any).deliveryPartnerId}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">No partner assigned yet.</p>
                  <select
                    value={selectedPartner}
                    onChange={(e) => setSelectedPartner(e.target.value)}
                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                  >
                    <option value="">Select a partner</option>
                    {deliveryPartners.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.deliveryProfile?.isOnline ? 'Online' : 'Offline'})
                      </option>
                    ))}
                  </select>
                  <Button onClick={handleAssignPartner} disabled={!selectedPartner} className="w-full">
                    Assign Partner
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <CreditCard className="h-5 w-5" /> Payment Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Payment Status</span>
                {getPaymentBadge(order.paymentStatus)}
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Order Status</span>
                {getStatusBadge(order.status)}
              </div>
              <div className="border-t pt-4 space-y-2 mt-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>₹{(order.totalAmount - order.deliveryFee - order.tax).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax (18%)</span>
                  <span>₹{order.tax.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Delivery Fee</span>
                  <span>₹{order.deliveryFee.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-base font-bold pt-2 border-t">
                  <span>Total</span>
                  <span>₹{order.totalAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
