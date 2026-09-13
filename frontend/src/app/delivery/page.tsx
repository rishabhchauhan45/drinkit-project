'use client';

import { useState } from 'react';
import { 
  MapPin, 
  Phone, 
  Navigation2, 
  CheckCircle2, 
  Clock, 
  Package,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// Mock active order for delivery partner
const mockActiveOrder = {
  id: 'ORD-7295',
  customer: {
    name: 'Priya Patel',
    phone: '+91 98765 43210',
    address: 'Apt 402, Sunrise Towers, 100ft Road, Indiranagar, Bangalore - 560038',
  },
  store: {
    name: 'DrinkIt Hub - Indiranagar',
    address: '12th Main, Indiranagar, Bangalore - 560038',
  },
  items: [
    { name: 'Johnnie Walker Black Label', qty: 1, volume: '750ml' },
    { name: 'Coca Cola Cans', qty: 4, volume: '330ml' },
    { name: 'Lays Magic Masala', qty: 2, volume: '90g' },
  ],
  amount: 4250,
  payment: 'PREPAID',
  status: 'PICKED_UP', // PENDING_PICKUP, PICKED_UP, REACHED_LOCATION
  timeElapsed: '12 mins',
  estimatedRemaining: '8 mins',
};

export default function DeliveryDashboardPage() {
  const [orderStatus, setOrderStatus] = useState(mockActiveOrder.status);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Active Delivery</h1>
        <Badge variant="warning" className="bg-emerald-100 text-emerald-700 border-emerald-200">
          In Progress
        </Badge>
      </div>

      <Card className="border-primary/20 shadow-soft-md overflow-hidden">
        {/* Map Placeholder */}
        <div className="h-48 bg-slate-200 relative w-full flex items-center justify-center overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&auto=format&fit=crop&q=60" 
            alt="Map" 
            className="w-full h-full object-cover opacity-60 mix-blend-multiply grayscale"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg font-medium text-sm flex items-center gap-2">
              <Navigation2 className="h-4 w-4 text-primary" />
              Live Route tracking active
            </div>
          </div>
        </div>

        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Order #{mockActiveOrder.id}</p>
              <h2 className="text-xl font-bold mt-1">
                {orderStatus === 'PENDING_PICKUP' ? 'Pickup from Store' : 'Deliver to Customer'}
              </h2>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1.5 text-primary font-bold text-lg">
                <Clock className="h-5 w-5" />
                {mockActiveOrder.estimatedRemaining}
              </div>
              <p className="text-xs text-muted-foreground">remaining</p>
            </div>
          </div>

          <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
            
            {/* Store Location */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-emerald-500 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                <Package className="h-4 w-4" />
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border bg-muted/30 shadow-sm">
                <p className="font-semibold text-sm">{mockActiveOrder.store.name}</p>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{mockActiveOrder.store.address}</p>
              </div>
            </div>

            {/* Customer Location */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 ${orderStatus === 'PENDING_PICKUP' ? 'bg-muted text-muted-foreground' : 'bg-primary text-white'}`}>
                <MapPin className="h-4 w-4" />
              </div>
              <div className={`w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border shadow-sm ${orderStatus === 'PENDING_PICKUP' ? 'opacity-60 bg-transparent' : 'bg-white border-primary/20'}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-sm">{mockActiveOrder.customer.name}</p>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{mockActiveOrder.customer.address}</p>
                  </div>
                  <Button size="icon" variant="outline" className="h-8 w-8 rounded-full shrink-0">
                    <Phone className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t space-y-4">
            <h3 className="font-semibold text-sm">Order Details</h3>
            <div className="bg-muted/50 rounded-lg p-4 text-sm">
              <ul className="space-y-2 mb-3">
                {mockActiveOrder.items.map((item, idx) => (
                  <li key={idx} className="flex justify-between">
                    <span>{item.qty}x {item.name} <span className="text-muted-foreground text-xs">({item.volume})</span></span>
                  </li>
                ))}
              </ul>
              <div className="flex justify-between font-bold pt-2 border-t border-dashed">
                <span>Total Collectable</span>
                <span className={mockActiveOrder.payment === 'PREPAID' ? 'text-emerald-600' : ''}>
                  {mockActiveOrder.payment === 'PREPAID' ? 'PAID ONLINE (₹0)' : `₹${mockActiveOrder.amount}`}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <Button variant="outline" className="w-14 shrink-0">
              <AlertCircle className="h-5 w-5 text-destructive" />
            </Button>
            
            {orderStatus === 'PENDING_PICKUP' ? (
              <Button className="flex-1 text-base h-12" onClick={() => setOrderStatus('PICKED_UP')}>
                Confirm Pickup
              </Button>
            ) : orderStatus === 'PICKED_UP' ? (
              <Button className="flex-1 text-base h-12" onClick={() => setOrderStatus('REACHED_LOCATION')}>
                Reached Location
              </Button>
            ) : (
              <Button className="flex-1 text-base h-12 bg-emerald-600 hover:bg-emerald-700" onClick={() => alert('Order Delivered!')}>
                Mark as Delivered <CheckCircle2 className="ml-2 h-5 w-5" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
