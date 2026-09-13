'use client';

import { 
  TrendingUp, 
  Users, 
  Package, 
  ShoppingCart, 
  ArrowUpRight,
  ArrowDownRight,
  Clock
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

// Mock data for the dashboard
const stats = [
  {
    title: 'Total Revenue',
    value: '₹12,45,600',
    change: '+14.5%',
    trend: 'up',
    icon: TrendingUp,
  },
  {
    title: 'Active Users',
    value: '8,432',
    change: '+5.2%',
    trend: 'up',
    icon: Users,
  },
  {
    title: 'Total Orders',
    value: '1,245',
    change: '-2.1%',
    trend: 'down',
    icon: ShoppingCart,
  },
  {
    title: 'Products in Stock',
    value: '456',
    change: '+12',
    trend: 'up',
    icon: Package,
  },
];

const recentOrders = [
  { id: 'ORD-7294', customer: 'Rahul Sharma', amount: 5499, status: 'DELIVERED', time: '10 mins ago' },
  { id: 'ORD-7295', customer: 'Priya Patel', amount: 2150, status: 'OUT_FOR_DELIVERY', time: '25 mins ago' },
  { id: 'ORD-7296', customer: 'Vikram Singh', amount: 8900, status: 'PREPARING', time: '1 hour ago' },
  { id: 'ORD-7297', customer: 'Neha Gupta', amount: 1240, status: 'PENDING', time: '2 hours ago' },
  { id: 'ORD-7298', customer: 'Arjun Kapoor', amount: 15600, status: 'CONFIRMED', time: '3 hours ago' },
];

export default function AdminDashboardPage() {
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'DELIVERED':
        return <Badge variant="success">Delivered</Badge>;
      case 'OUT_FOR_DELIVERY':
        return <Badge variant="warning" className="bg-blue-100 text-blue-700 border-blue-200">Out for Delivery</Badge>;
      case 'PREPARING':
        return <Badge variant="warning" className="bg-amber-100 text-amber-700">Preparing</Badge>;
      case 'PENDING':
        return <Badge variant="secondary">Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
        <p className="text-muted-foreground mt-2">
          Welcome back! Here's what's happening with your store today.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const isUp = stat.trend === 'up';
          return (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className="mt-2 text-3xl font-bold tracking-tight">{stat.value}</p>
                  </div>
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${isUp ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2 text-sm">
                  <span className={`flex items-center font-medium ${isUp ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {isUp ? <ArrowUpRight className="mr-1 h-4 w-4" /> : <ArrowDownRight className="mr-1 h-4 w-4" />}
                    {stat.change}
                  </span>
                  <span className="text-muted-foreground">vs last month</span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Recent Orders */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Orders</CardTitle>
            <Button variant="outline" size="sm">View All</Button>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="pb-3 font-medium">Order ID</th>
                    <th className="pb-3 font-medium">Customer</th>
                    <th className="pb-3 font-medium text-right">Amount</th>
                    <th className="pb-3 font-medium text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="group transition-colors hover:bg-muted/50 cursor-pointer">
                      <td className="py-4 font-medium">{order.id}</td>
                      <td className="py-4">
                        <div>
                          <p className="font-medium text-foreground">{order.customer}</p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                            <Clock className="h-3 w-3" /> {order.time}
                          </p>
                        </div>
                      </td>
                      <td className="py-4 text-right font-medium">₹{order.amount.toLocaleString('en-IN')}</td>
                      <td className="py-4 text-center">{getStatusBadge(order.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Top Products / Activities */}
        <Card>
          <CardHeader>
            <CardTitle>Top Selling Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {[
                { name: 'Whiskey', sales: 450, percentage: 35, color: 'bg-amber-500' },
                { name: 'Beer', sales: 320, percentage: 25, color: 'bg-yellow-500' },
                { name: 'Wine', sales: 280, percentage: 22, color: 'bg-rose-500' },
                { name: 'Vodka', sales: 150, percentage: 12, color: 'bg-blue-500' },
                { name: 'Snacks', sales: 75, percentage: 6, color: 'bg-emerald-500' },
              ].map((cat) => (
                <div key={cat.name}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium">{cat.name}</span>
                    <span className="text-muted-foreground">{cat.sales} orders</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${cat.color}`} 
                      style={{ width: `${cat.percentage}%` }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
