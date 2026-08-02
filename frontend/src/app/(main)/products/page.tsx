'use client';

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useSearchParams } from 'next/navigation';
import { ProductCard, Product } from '@/components/products/ProductCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter } from 'lucide-react';
import { useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category') || '';
  
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState(categoryParam);

  const fetchProducts = async () => {
    let url = `${process.env.NEXT_PUBLIC_API_URL}/products?`;
    if (activeCategory) url += `category=${activeCategory}&`;
    if (search) url += `search=${search}&`;
    
    const { data } = await axios.get(url);
    return data.data as Product[];
  };

  const { data: products, isLoading, error, refetch } = useQuery({
    queryKey: ['products', activeCategory, search],
    queryFn: fetchProducts,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    refetch();
  };

  const categories = ['All', 'WHISKEY', 'BEER', 'WINE', 'VODKA', 'GIN', 'RUM', 'MIXERS', 'SNACKS'];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Filters */}
        <div className="w-full md:w-64 space-y-6">
          <div>
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <Filter className="h-5 w-5" /> Filters
            </h3>
            <div className="space-y-2">
              <h4 className="font-medium text-sm text-muted-foreground mb-2">Categories</h4>
              <div className="flex flex-col space-y-1">
                {categories.map((cat) => (
                  <Button
                    key={cat}
                    variant={activeCategory === (cat === 'All' ? '' : cat) ? 'secondary' : 'ghost'}
                    className="justify-start w-full"
                    onClick={() => setActiveCategory(cat === 'All' ? '' : cat)}
                  >
                    {cat === 'All' ? 'All Products' : cat.charAt(0) + cat.slice(1).toLowerCase()}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h1 className="text-3xl font-bold">
              {activeCategory ? activeCategory.charAt(0) + activeCategory.slice(1).toLowerCase() : 'All Products'}
            </h1>
            
            <form onSubmit={handleSearch} className="flex w-full sm:w-auto gap-2">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search products..."
                  className="pl-8"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <Button type="submit" variant="secondary">Search</Button>
            </form>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="flex flex-col space-y-3">
                  <Skeleton className="h-[250px] w-full rounded-xl" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-20 text-destructive">
              Error loading products. Make sure the backend server is running.
            </div>
          ) : products?.length === 0 ? (
            <div className="text-center py-20">
              <h3 className="text-xl font-semibold mb-2">No products found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filters.</p>
              <Button variant="outline" className="mt-4" onClick={() => { setSearch(''); setActiveCategory(''); }}>
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products?.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
