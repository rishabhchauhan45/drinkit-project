'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { productService } from '@/services/product.service';
import Link from 'next/link';

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    category: 'WHISKEY',
    subCategory: '',
    price: '',
    mrp: '',
    discount: '0',
    volume: '',
    abv: '',
    brand: '',
    description: '',
    stock: '0',
    images: '',
    isActive: true
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        mrp: formData.mrp ? Number(formData.mrp) : undefined,
        discount: Number(formData.discount),
        abv: formData.abv ? Number(formData.abv) : undefined,
        stock: Number(formData.stock),
        images: formData.images.split(',').map(s => s.trim()).filter(Boolean)
      };

      await productService.createProduct(payload as any);
      router.push('/admin/products');
    } catch (err: any) {
      setError(err.response?.data?.message || err.response?.data?.error || 'Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/products">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Add New Product</h1>
          <p className="text-muted-foreground mt-1">Create a new product in the inventory.</p>
        </div>
      </div>

      <div className="bg-card rounded-md border p-6">
        {error && (
          <div className="mb-6 p-4 bg-rose-100 text-rose-700 rounded-md text-sm font-medium">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Name *</label>
              <Input name="name" required value={formData.name} onChange={handleChange} placeholder="e.g. Blue Label" />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Brand *</label>
              <Input name="brand" required value={formData.brand} onChange={handleChange} placeholder="e.g. Johnnie Walker" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Category *</label>
              <select 
                name="category" 
                value={formData.category} 
                onChange={handleChange}
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {['WHISKEY', 'VODKA', 'RUM', 'GIN', 'WINE', 'BEER', 'SNACKS', 'MIXERS'].map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Sub Category</label>
              <Input name="subCategory" value={formData.subCategory} onChange={handleChange} placeholder="e.g. Blended Scotch" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Price (₹) *</label>
              <Input type="number" step="0.01" min="0" name="price" required value={formData.price} onChange={handleChange} />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">MRP (₹)</label>
              <Input type="number" step="0.01" min="0" name="mrp" value={formData.mrp} onChange={handleChange} />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Initial Stock *</label>
              <Input type="number" min="0" name="stock" required value={formData.stock} onChange={handleChange} />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Discount (%)</label>
              <Input type="number" min="0" max="100" name="discount" value={formData.discount} onChange={handleChange} />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Volume (e.g., 750ml)</label>
              <Input name="volume" value={formData.volume} onChange={handleChange} />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">ABV (%)</label>
              <Input type="number" step="0.1" min="0" max="100" name="abv" value={formData.abv} onChange={handleChange} />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Images (comma separated URLs)</label>
            <Input name="images" value={formData.images} onChange={handleChange} placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <textarea 
              name="description" 
              rows={4} 
              value={formData.description} 
              onChange={handleChange}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <div className="flex items-center gap-2">
            <input 
              type="checkbox" 
              name="isActive" 
              id="isActive" 
              checked={formData.isActive} 
              onChange={handleChange}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <label htmlFor="isActive" className="text-sm font-medium">Active (Visible to customers)</label>
          </div>

          <div className="flex justify-end pt-4 border-t">
            <Button type="submit" disabled={loading}>
              <Save className="mr-2 h-4 w-4" /> 
              {loading ? 'Saving...' : 'Save Product'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
