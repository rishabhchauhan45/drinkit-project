'use client';

import { useEffect, useState } from 'react';
import { 
  TrendingUp, 
  Users, 
  Package, 
  ShoppingCart, 
  Clock
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { adminService, DashboardStats } from '@/services/admin.service';

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const stats = await adminService.getDashboardStats();
        setData(stats);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to load dashboard metrics');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'DELIVERED':
        return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">Delivered</Badge>;
      case 'OUT_FOR_DELIVERY':
        return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Out for Delivery</Badge>;
      case 'PREPARING':
        return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">Preparing</Badge>;
      case 'PENDING':
        return <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100">Pending</Badge>;
      case 'CONFIRMED':
        return <Badge className="bg-indigo-100 text-indigo-700 hover:bg-indigo-100">Confirmed</Badge>;
      case 'CANCELLED':
        return <Badge className="bg-rose-100 text-rose-700 hover:bg-rose-100">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-muted-foreground">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-rose-500 font-medium">{error}</div>;
  }

  if (!data) return null;

  const stats = [
    {
      title: 'Total Revenue',
      value: `₹${data.metrics.totalRevenue.toLocaleString('en-IN')}`,
      icon: TrendingUp,
      color: 'bg-emerald-100 text-emerald-600'
    },
    {
      title: 'Active Users',
      value: data.metrics.activeUsers.toLocaleString(),
      icon: Users,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      title: 'Total Orders',
      value: data.metrics.totalOrders.toLocaleString(),
      icon: ShoppingCart,
      color: 'bg-indigo-100 text-indigo-600'
    },
    {
      title: 'Products in Stock',
      value: data.metrics.activeProducts.toLocaleString(),
      icon: Package,
      color: 'bg-amber-100 text-amber-600'
    },
  ];

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
          return (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className="mt-2 text-3xl font-bold tracking-tight">{stat.value}</p>
                  </div>
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
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
                  {data.recentOrders.length > 0 ? (
                    data.recentOrders.map((order) => (
                      <tr key={order.id} className="group transition-colors hover:bg-muted/50">
                        <td className="py-4 font-medium">{order.id.slice(-6).toUpperCase()}</td>
                        <td className="py-4">
                          <div>
                            <p className="font-medium text-foreground">{order.customer}</p>
                            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                              <Clock className="h-3 w-3" /> {new Date(order.time).toLocaleDateString()}
                            </p>
                          </div>
                        </td>
                        <td className="py-4 text-right font-medium">₹{order.amount.toLocaleString('en-IN')}</td>
                        <td className="py-4 text-center">{getStatusBadge(order.status)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-muted-foreground">No recent orders found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Actionable Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>Actionable Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium text-amber-600">Low Stock Products</span>
                  <span className="font-bold text-amber-600">{data.metrics.lowStockProducts}</span>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium text-rose-600">Out of Stock</span>
                  <span className="font-bold text-rose-600">{data.metrics.outOfStockProducts}</span>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium text-indigo-600">Pending Orders</span>
                  <span className="font-bold text-indigo-600">{data.metrics.pendingOrders}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
