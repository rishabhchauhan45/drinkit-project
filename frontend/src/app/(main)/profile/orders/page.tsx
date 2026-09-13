'use client';

import Link from 'next/link';
import { PackageOpen, ChevronRight, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useUserOrders } from '@/hooks/useOrders';
import { EmptyState } from '@/components/ui/empty-state';
import { PageLoader } from '@/components/ui/loading-spinner';
import type { OrderStatus } from '@/types';

export default function OrdersPage() {
  const { user } = useAuth();
  const { data: orders, isLoading } = useUserOrders(user?.id || '');

  if (isLoading) return <PageLoader />;

  if (!orders || orders.length === 0) {
    return (
      <Card>
        <CardContent className="p-0">
          <EmptyState
            icon="orders"
            title="No orders yet"
            description="You haven't placed any orders yet. Start exploring our premium collection!"
            actionLabel="Start Shopping"
            onAction={() => window.location.href = '/products'}
          />
        </CardContent>
      </Card>
    );
  }

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'DELIVERED':
        return <Badge variant="success">Delivered</Badge>;
      case 'CANCELLED':
        return <Badge variant="destructive">Cancelled</Badge>;
      case 'OUT_FOR_DELIVERY':
        return <Badge variant="warning" className="bg-blue-100 text-blue-700 border-blue-200">Out for Delivery</Badge>;
      default:
        return <Badge variant="outline" className="bg-amber-100 text-amber-700 border-amber-200">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">My Orders</h1>
      
      <div className="space-y-4">
        {orders.map((order) => (
          <Link key={order.id} href={`/profile/orders/${order.id}`} className="block group">
            <Card className="hover:border-primary/40 transition-colors">
              <CardContent className="p-0">
                
                {/* Header */}
                <div className="flex items-center justify-between border-b bg-muted/30 px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">Order ID</p>
                      <p className="font-medium">#{order.id.slice(-6).toUpperCase()}</p>
                    </div>
                    <div className="hidden sm:block h-8 w-px bg-border" />
                    <div className="hidden sm:block">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">Date</p>
                      <p className="font-medium text-sm flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric', month: 'short', year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">Total</p>
                    <p className="font-bold text-lg">₹{Math.round(order.totalAmount).toLocaleString('en-IN')}</p>
                  </div>
                </div>

                {/* Body */}
                <div className="flex items-center justify-between px-6 py-5">
                  <div className="flex items-center gap-4">
                    <div className="flex -space-x-4">
                      {order.products.slice(0, 3).map((product, idx) => (
                        <div key={idx} className="h-14 w-14 rounded-full border-2 border-background bg-white shadow-sm overflow-hidden z-10">
                          <img src={product.image} alt={product.name} className="h-full w-full object-cover mix-blend-multiply" />
                        </div>
                      ))}
                      {order.products.length > 3 && (
                        <div className="h-14 w-14 rounded-full border-2 border-background bg-muted flex items-center justify-center text-xs font-medium z-0">
                          +{order.products.length - 3}
                        </div>
                      )}
                    </div>
                    <div className="hidden sm:block ml-2">
                      <p className="text-sm font-medium">
                        {order.products[0].name}
                        {order.products.length > 1 && <span className="text-muted-foreground font-normal"> + {order.products.length - 1} more item(s)</span>}
                      </p>
                      <div className="mt-1">{getStatusBadge(order.status)}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-primary font-medium text-sm gap-1 group-hover:translate-x-1 transition-transform">
                    View Details
                    <ChevronRight className="h-4 w-4" />
                  </div>
                </div>

                {/* Mobile Status */}
                <div className="sm:hidden px-6 pb-4 pt-1">
                  {getStatusBadge(order.status)}
                </div>

              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
