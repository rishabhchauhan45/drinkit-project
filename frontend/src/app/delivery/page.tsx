'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Package, Clock, MapPin, Navigation2, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { deliveryService } from '@/services/delivery.service';

export default function DeliveryDashboardPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await deliveryService.getAssignedOrders();
        setOrders(data);
      } catch (err) {
        console.error('Failed to load orders', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-muted-foreground">Loading assigned orders...</div>;
  }

  const activeOrders = orders.filter(o => ['OUT_FOR_DELIVERY', 'CONFIRMED', 'PREPARING'].includes(o.status));
  const pastOrders = orders.filter(o => ['DELIVERED', 'CANCELLED'].includes(o.status));

  const OrderCard = ({ order }: { order: any }) => (
    <Card className="hover:border-emerald-500/50 transition-colors">
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-bold text-lg">Order #{order.id.slice(-6).toUpperCase()}</span>
              {order.status === 'OUT_FOR_DELIVERY' && (
                <Badge className="bg-emerald-100 text-emerald-700">In Progress</Badge>
              )}
              {order.status === 'DELIVERED' && (
                <Badge variant="outline" className="border-emerald-200 text-emerald-700">Delivered</Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>
          <div className="text-right sm:text-left text-xl font-bold">
            ₹{order.totalAmount}
          </div>
        </div>

        <div className="bg-muted/30 rounded-lg p-3 sm:p-4 mb-4">
          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-sm">{order.user?.name}</p>
              <p className="text-xs text-muted-foreground">Phone: {order.user?.phone}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {order.products.length} items
          </p>
          <Link href={`/delivery/orders/${order.id}`}>
            <Button variant={order.status === 'OUT_FOR_DELIVERY' ? 'default' : 'outline'} className={order.status === 'OUT_FOR_DELIVERY' ? 'bg-emerald-600 hover:bg-emerald-700' : ''}>
              View Details & Track
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold mb-2">My Deliveries</h1>
        <p className="text-muted-foreground">Manage your assigned orders.</p>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Navigation2 className="h-5 w-5 text-emerald-600" /> Active Orders ({activeOrders.length})
        </h2>
        {activeOrders.length === 0 ? (
          <div className="p-8 border border-dashed rounded-lg text-center text-muted-foreground">
            No active orders right now. Wait for new assignments.
          </div>
        ) : (
          <div className="grid gap-4">
            {activeOrders.map(order => <OrderCard key={order.id} order={order} />)}
          </div>
        )}
      </div>

      <div className="space-y-4 pt-4">
        <h2 className="text-xl font-semibold flex items-center gap-2 text-muted-foreground">
          <CheckCircle2 className="h-5 w-5" /> Past Deliveries ({pastOrders.length})
        </h2>
        {pastOrders.length > 0 && (
          <div className="grid gap-4 opacity-70">
            {pastOrders.map(order => <OrderCard key={order.id} order={order} />)}
          </div>
        )}
      </div>
    </div>
  );
}
