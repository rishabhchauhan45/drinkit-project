'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Ticket, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { couponService, type Coupon } from '@/services/coupon.service';

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [formData, setFormData] = useState<Partial<Coupon>>({
    code: '',
    discountType: 'PERCENTAGE',
    discountValue: 0,
    minOrderValue: 0,
    maxDiscount: 0,
    usageLimit: 100,
    isActive: true,
    expiryDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0]
  });

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const res = await couponService.getCoupons();
      setCoupons(res.data);
    } catch (error) {
      console.error('Failed to fetch coupons', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleDeactivate = async (id: string) => {
    if (confirm('Are you sure you want to deactivate this coupon?')) {
      try {
        await couponService.deactivateCoupon(id);
        fetchCoupons();
      } catch (error) {
        alert('Failed to deactivate coupon');
      }
    }
  };

  const handleSave = async () => {
    try {
      if (editingCoupon && editingCoupon.id) {
        await couponService.updateCoupon(editingCoupon.id, formData);
      } else {
        await couponService.createCoupon(formData);
      }
      setIsFormOpen(false);
      setEditingCoupon(null);
      fetchCoupons();
    } catch (error: any) {
      alert(error?.response?.data?.error || 'Failed to save coupon');
    }
  };

  const openForm = (coupon?: Coupon) => {
    if (coupon) {
      setEditingCoupon(coupon);
      setFormData({
        ...coupon,
        expiryDate: new Date(coupon.expiryDate).toISOString().split('T')[0]
      });
    } else {
      setEditingCoupon(null);
      setFormData({
        code: '',
        discountType: 'PERCENTAGE',
        discountValue: 0,
        minOrderValue: 0,
        maxDiscount: 0,
        usageLimit: 100,
        isActive: true,
        expiryDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0]
      });
    }
    setIsFormOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Coupons</h1>
          <p className="text-muted-foreground mt-1">Manage discount codes and promo campaigns.</p>
        </div>
        <Button className="w-full sm:w-auto" onClick={() => openForm()}>
          <Plus className="mr-2 h-4 w-4" /> Add Coupon
        </Button>
      </div>

      {isFormOpen && (
        <div className="rounded-md border bg-card p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">{editingCoupon ? 'Edit Coupon' : 'Create New Coupon'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Coupon Code</label>
              <Input 
                value={formData.code} 
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })} 
                placeholder="e.g. FESTIVE50" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Discount Type</label>
              <select 
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={formData.discountType}
                onChange={(e) => setFormData({ ...formData, discountType: e.target.value as 'PERCENTAGE' | 'FLAT' })}
              >
                <option value="PERCENTAGE">Percentage (%)</option>
                <option value="FLAT">Flat Amount (₹)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Discount Value</label>
              <Input 
                type="number" 
                value={formData.discountValue} 
                onChange={(e) => setFormData({ ...formData, discountValue: Number(e.target.value) })} 
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Minimum Order Value (Optional)</label>
              <Input 
                type="number" 
                value={formData.minOrderValue || ''} 
                onChange={(e) => setFormData({ ...formData, minOrderValue: Number(e.target.value) })} 
              />
            </div>
            {formData.discountType === 'PERCENTAGE' && (
              <div>
                <label className="block text-sm font-medium mb-1">Maximum Discount (Optional)</label>
                <Input 
                  type="number" 
                  value={formData.maxDiscount || ''} 
                  onChange={(e) => setFormData({ ...formData, maxDiscount: Number(e.target.value) })} 
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium mb-1">Usage Limit</label>
              <Input 
                type="number" 
                value={formData.usageLimit} 
                onChange={(e) => setFormData({ ...formData, usageLimit: Number(e.target.value) })} 
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Expiry Date</label>
              <Input 
                type="date" 
                value={formData.expiryDate} 
                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })} 
              />
            </div>
            <div className="flex items-center gap-2 mt-6">
              <input 
                type="checkbox" 
                id="isActive" 
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              />
              <label htmlFor="isActive" className="text-sm font-medium">Active</label>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={() => setIsFormOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>Save Coupon</Button>
          </div>
        </div>
      )}

      <div className="rounded-md border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50 text-left text-muted-foreground">
                <th className="p-4 font-medium">Code</th>
                <th className="p-4 font-medium">Type</th>
                <th className="p-4 font-medium">Value</th>
                <th className="p-4 font-medium">Usage</th>
                <th className="p-4 font-medium">Expiry</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-muted-foreground">Loading...</td>
                </tr>
              ) : coupons.length > 0 ? (
                coupons.map((coupon) => (
                  <tr key={coupon.id} className="group hover:bg-muted/50 transition-colors">
                    <td className="p-4 font-bold tracking-wider">{coupon.code}</td>
                    <td className="p-4">{coupon.discountType === 'PERCENTAGE' ? 'Percentage' : 'Flat'}</td>
                    <td className="p-4">
                      {coupon.discountType === 'PERCENTAGE' ? `${coupon.discountValue}%` : `₹${coupon.discountValue}`}
                      {coupon.maxDiscount ? <span className="text-xs text-muted-foreground block">Up to ₹{coupon.maxDiscount}</span> : null}
                    </td>
                    <td className="p-4">
                      <div className="w-full bg-secondary rounded-full h-2 mt-2 max-w-[100px]">
                        <div 
                          className="bg-primary h-2 rounded-full" 
                          style={{ width: `${Math.min(100, ((coupon.usedCount || 0) / coupon.usageLimit) * 100)}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-muted-foreground">{coupon.usedCount} / {coupon.usageLimit}</span>
                    </td>
                    <td className="p-4">{new Date(coupon.expiryDate).toLocaleDateString()}</td>
                    <td className="p-4">
                      {coupon.isActive ? (
                        <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">Active</Badge>
                      ) : (
                        <Badge variant="outline" className="text-muted-foreground">Inactive</Badge>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openForm(coupon)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        {coupon.isActive && (
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => handleDeactivate(coupon.id!)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-muted-foreground">No coupons found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
