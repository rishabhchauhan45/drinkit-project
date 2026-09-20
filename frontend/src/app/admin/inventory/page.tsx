'use client';

import { useState, useEffect } from 'react';
import { Search, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { adminService, InventoryItem } from '@/services/admin.service';

export default function AdminInventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  // Editing state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editStock, setEditStock] = useState<string>('');
  const [saving, setSaving] = useState(false);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const res = await adminService.getInventory({ page, limit: 12, search });
      setItems(res.data);
      setTotal(res.total);
    } catch (error) {
      console.error('Failed to fetch inventory', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, [page, search]);

  const handleEditClick = (item: InventoryItem) => {
    setEditingId(item._id);
    setEditStock(item.stock.toString());
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditStock('');
  };

  const handleSaveStock = async (id: string) => {
    const stockVal = Number(editStock);
    if (isNaN(stockVal) || stockVal < 0) {
      alert('Invalid stock value');
      return;
    }
    
    try {
      setSaving(true);
      const updatedItem = await adminService.updateInventoryStock(id, stockVal);
      setItems(items.map(item => item._id === id ? { ...item, stock: updatedItem.stock, stockStatus: updatedItem.stockStatus } : item));
      setEditingId(null);
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to update stock');
    } finally {
      setSaving(false);
    }
  };

  const getStockBadge = (status: string) => {
    switch(status) {
      case 'IN_STOCK': return <Badge className="bg-emerald-100 text-emerald-700">In Stock</Badge>;
      case 'LOW_STOCK': return <Badge className="bg-amber-100 text-amber-700">Low Stock</Badge>;
      case 'OUT_OF_STOCK': return <Badge className="bg-rose-100 text-rose-700">Out of Stock</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventory Management</h1>
          <p className="text-muted-foreground mt-1">Monitor stock levels and adjust inventory manually.</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search products..." 
            className="pl-9"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
      </div>

      <div className="rounded-md border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50 text-left text-muted-foreground">
                <th className="p-4 font-medium">Product</th>
                <th className="p-4 font-medium">Category</th>
                <th className="p-4 font-medium text-center">Status</th>
                <th className="p-4 font-medium text-right">Current Stock</th>
                <th className="p-4 font-medium text-right w-48">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-muted-foreground">Loading...</td>
                </tr>
              ) : items.length > 0 ? (
                items.map((item) => (
                  <tr key={item._id} className="group hover:bg-muted/50 transition-colors">
                    <td className="p-4 font-medium text-foreground">{item.name}</td>
                    <td className="p-4 text-muted-foreground">{item.category}</td>
                    <td className="p-4 text-center">{getStockBadge(item.stockStatus)}</td>
                    <td className="p-4 text-right">
                      {editingId === item._id ? (
                        <Input 
                          type="number" 
                          min="0" 
                          className="w-20 text-right ml-auto h-8"
                          value={editStock}
                          onChange={(e) => setEditStock(e.target.value)}
                        />
                      ) : (
                        <span className="font-medium text-lg">{item.stock}</span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      {editingId === item._id ? (
                        <div className="flex items-center justify-end gap-1">
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-100" onClick={() => handleSaveStock(item._id)} disabled={saving}>
                            <Save className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-rose-600 hover:text-rose-700 hover:bg-rose-100" onClick={handleCancelEdit} disabled={saving}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <Button variant="outline" size="sm" onClick={() => handleEditClick(item)}>
                          Update Stock
                        </Button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-muted-foreground">No products found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Basic Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {items.length} of {total} products
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
            disabled={items.length < 12}
            onClick={() => setPage(p => p + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
