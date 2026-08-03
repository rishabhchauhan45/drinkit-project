'use client';

import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle2, Clock, MapPin, Package, Truck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useOrder } from '@/hooks/useOrders';
import { PageLoader } from '@/components/ui/loading-spinner';
import { ErrorState } from '@/components/ui/error-state';

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: order, isLoading, isError, refetch } = useOrder(params.id as string);

  if (isLoading) return <PageLoader />;
  if (isError || !order) return <ErrorState onRetry={() => refetch()} />;

  const getStatusColor = (status: string) => {
    if (status === 'DELIVERED') return 'bg-emerald-500';
    if (status === 'CANCELLED') return 'bg-destructive';
    return 'bg-amber-500';
  };

  const timeline = [
    { status: 'PENDING', label: 'Order Placed', icon: Package, done: true },
    { status: 'CONFIRMED', label: 'Order Confirmed', icon: CheckCircle2, done: ['CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(order.status) },
    { status: 'PREPARING', label: 'Preparing', icon: Clock, done: ['PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(order.status) },
    { status: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', icon: Truck, done: ['OUT_FOR_DELIVERY', 'DELIVERED'].includes(order.status) },
    { status: 'DELIVERED', label: 'Delivered', icon: MapPin, done: order.status === 'DELIVERED' },
  ];

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3">
            Order #{order.id.slice(-6).toUpperCase()}
            {order.status === 'DELIVERED' && <Badge variant="success">Delivered</Badge>}
            {order.status === 'CANCELLED' && <Badge variant="destructive">Cancelled</Badge>}
            {['PENDING', 'CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY'].includes(order.status) && (
              <Badge variant="warning" className="bg-amber-100 text-amber-700">In Progress</Badge>
            )}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Placed on {new Date(order.createdAt).toLocaleString('en-IN')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Column: Items & Timeline */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Order Status Timeline (Only if not cancelled) */}
          {order.status !== 'CANCELLED' && (
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-6">Track Order</h3>
                <div className="relative flex justify-between">
                  {/* Progress Bar Background */}
                  <div className="absolute top-1/2 left-0 h-1 w-full -translate-y-1/2 bg-muted rounded-full" />
                  
                  {/* Active Progress Bar */}
                  <div 
                    className={`absolute top-1/2 left-0 h-1 -translate-y-1/2 ${getStatusColor(order.status)} rounded-full transition-all duration-500`}
                    style={{ 
                      width: `${(timeline.filter(t => t.done).length - 1) / (timeline.length - 1) * 100}%` 
                    }}
                  />
                  
                  {timeline.map((step, idx) => {
                    const Icon = step.icon;
                    return (
                      <div key={idx} className="relative z-10 flex flex-col items-center gap-2">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-full border-4 border-card transition-colors ${
                          step.done ? getStatusColor(order.status) + ' text-white' : 'bg-muted text-muted-foreground'
                        }`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <span className={`text-xs font-medium text-center hidden sm:block ${step.done ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {step.label}
                        </span>
                      </div>
                    )
                  })}
                </div>

                {order.delivery && order.status === 'OUT_FOR_DELIVERY' && (
                  <div className="mt-8 rounded-xl border border-primary/20 bg-primary/5 p-4 flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Truck className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">{order.delivery.partnerName} is arriving soon</h4>
                      <p className="text-sm text-muted-foreground mt-0.5">Contact: {order.delivery.partnerPhone}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Estimated Time</p>
                      <p className="font-bold text-lg text-primary">{order.delivery.estimatedTime} min</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Items */}
          <Card>
            <CardHeader className="px-6 py-4 border-b">
              <CardTitle className="text-lg">Items in this order</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {order.products.map(item => (
                  <div key={item.productId} className="flex gap-4 p-6">
                    <div className="h-16 w-16 rounded-xl bg-muted overflow-hidden shrink-0 border">
                      <img src={item.image} alt={item.name} className="h-full w-full object-cover mix-blend-multiply" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{item.name}</h4>
                      <p className="text-xs text-muted-foreground mt-1">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-sm">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Summary & Info */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="px-6 py-4 border-b">
              <CardTitle className="text-lg">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">₹{(order.totalAmount - order.tax - order.deliveryFee + order.discount).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Delivery Fee</span>
                  {order.deliveryFee === 0 ? (
                    <span className="font-medium text-emerald-600">Free</span>
                  ) : (
                    <span className="font-medium">₹{order.deliveryFee}</span>
                  )}
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Taxes</span>
                  <span className="font-medium">₹{Math.round(order.tax).toLocaleString('en-IN')}</span>
                </div>
                
                {order.discount > 0 && (
                  <div className="flex justify-between text-emerald-600 pb-3 border-b border-dashed">
                    <span>Discount</span>
                    <span className="font-medium">-₹{order.discount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                
                {!order.discount && <div className="border-b border-dashed pb-3" />}
                
                <div className="flex justify-between text-base font-bold pt-1">
                  <span>Total Paid</span>
                  <span>₹{Math.round(order.totalAmount).toLocaleString('en-IN')}</span>
                </div>
                <p className="text-xs text-muted-foreground text-right mt-1">via {order.paymentStatus}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                Delivery Info
              </h3>
              <p className="text-sm font-medium">{order.user?.name}</p>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-3">
                {/* In a real app, this would use the order's snapshot address */}
                123, Tech Park, Cyber City, Bangalore - 560001
              </p>
              <p className="text-sm text-muted-foreground mt-1">{order.user?.phone}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
