'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, MapPin, Package, Phone, CheckCircle2, Navigation2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { deliveryService } from '@/services/delivery.service';
import { orderService } from '@/services/order.service';

export default function DeliveryOrderDetailsPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [trackingActive, setTrackingActive] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await orderService.getOrderById(id);
        setOrder(data);
        if (data.status === 'OUT_FOR_DELIVERY') {
          setTrackingActive(true);
        }
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to load order');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  // GPS Tracking Hook
  useEffect(() => {
    let watchId: number;

    if (trackingActive && navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // Send to backend
          deliveryService.updateLocation(latitude, longitude, id).catch(console.error);
        },
        (err) => {
          console.error('GPS Error:', err);
        },
        { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
      );
    }

    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
    };
  }, [trackingActive, id]);

  const handleStatusChange = async (newStatus: string) => {
    try {
      await deliveryService.updateOrderStatus(id, newStatus);
      setOrder((prev: any) => ({ ...prev, status: newStatus }));
      
      if (newStatus === 'OUT_FOR_DELIVERY') {
        setTrackingActive(true);
      } else if (newStatus === 'DELIVERED') {
        setTrackingActive(false);
        alert('Order Delivered Successfully!');
        router.push('/delivery');
      }
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to update status');
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error || !order) return <div className="p-8 text-center text-rose-500">{error || 'Order not found'}</div>;

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href="/delivery">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Order #{order.id.slice(-6).toUpperCase()}</h1>
          <p className="text-muted-foreground flex items-center gap-2">
            {order.status === 'OUT_FOR_DELIVERY' && <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>}
            {order.status}
          </p>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-4 mb-6">
            <div className="h-12 w-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
              <MapPin className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">{order.user?.name}</h3>
              <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
                {/* Assuming order address details are part of user or order. We display fallback if complex */}
                Customer Location Details
              </p>
              <div className="flex items-center gap-2 mt-3">
                <Button size="sm" variant="outline" className="gap-2">
                  <Phone className="h-4 w-4" /> Call {order.user?.phone}
                </Button>
                <Button size="sm" variant="outline" className="gap-2">
                  <Navigation2 className="h-4 w-4" /> Navigate
                </Button>
              </div>
            </div>
          </div>

          <div className="border-t pt-6 mb-6">
            <h4 className="font-medium flex items-center gap-2 mb-3">
              <Package className="h-4 w-4 text-muted-foreground" /> Order Items ({order.products.length})
            </h4>
            <div className="space-y-3 bg-muted/30 p-4 rounded-lg">
              {order.products.map((item: any, idx: number) => (
                <div key={idx} className="flex justify-between text-sm">
                  <span>{item.quantity} × {item.name}</span>
                </div>
              ))}
              <div className="pt-3 mt-3 border-t font-bold flex justify-between">
                <span>Collect Amount:</span>
                <span className={order.paymentStatus === 'PAID' ? 'text-emerald-600' : 'text-rose-600'}>
                  {order.paymentStatus === 'PAID' ? 'PAID ONLINE (₹0)' : `₹${order.totalAmount.toLocaleString('en-IN')}`}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-4 border-t">
            {order.status !== 'OUT_FOR_DELIVERY' && order.status !== 'DELIVERED' && (
              <Button 
                onClick={() => handleStatusChange('OUT_FOR_DELIVERY')}
                className="w-full bg-emerald-600 hover:bg-emerald-700 h-12 text-base"
              >
                Start Delivery (Live Tracking)
              </Button>
            )}
            
            {order.status === 'OUT_FOR_DELIVERY' && (
              <>
                <div className="bg-emerald-50 text-emerald-700 p-3 rounded-md text-sm flex items-center gap-2 mb-2">
                  <Navigation2 className="h-4 w-4 animate-pulse" /> Live GPS tracking is active
                </div>
                <Button 
                  onClick={() => handleStatusChange('DELIVERED')}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 h-12 text-base"
                >
                  <CheckCircle2 className="h-5 w-5 mr-2" /> Mark as Delivered
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
