import api from '@/lib/api';
import type { ApiResponse, PaginatedResponse, Product, ProductFilters } from '@/types';

export const productService = {
  async getProducts(filters: ProductFilters = {}): Promise<PaginatedResponse<Product>> {
    const params = new URLSearchParams();

    if (filters.category) params.append('category', filters.category);
    if (filters.search) params.append('search', filters.search);
    if (filters.minPrice !== undefined) params.append('minPrice', String(filters.minPrice));
    if (filters.maxPrice !== undefined) params.append('maxPrice', String(filters.maxPrice));
    if (filters.brand) params.append('brand', filters.brand);
    if (filters.page) params.append('page', String(filters.page));
    if (filters.limit) params.append('limit', String(filters.limit));

    const response = await api.get<PaginatedResponse<Product>>(`/products?${params.toString()}`);
    return response.data;
  },

  async getProductById(id: string): Promise<Product> {
    const response = await api.get<ApiResponse<Product>>(`/products/${id}`);
    return response.data.data;
  },

  async searchProducts(query: string, limit = 5): Promise<Product[]> {
    const response = await api.get<PaginatedResponse<Product>>(
      `/products?search=${encodeURIComponent(query)}&limit=${limit}`
    );
    return response.data.data;
  },

  async getProductsByCategory(category: string, page = 1, limit = 12): Promise<PaginatedResponse<Product>> {
    const response = await api.get<PaginatedResponse<Product>>(
      `/products?category=${category}&page=${page}&limit=${limit}`
    );
    return response.data;
  },

  async getFeaturedProducts(limit = 8): Promise<Product[]> {
    const response = await api.get<PaginatedResponse<Product>>(
      `/products?limit=${limit}`
    );
    return response.data.data;
  },

  async getDeals(limit = 8): Promise<Product[]> {
    // Products with discount > 0
    const response = await api.get<PaginatedResponse<Product>>(
      `/products?limit=${limit}`
    );
    // Filter for products with discounts on client side
    return response.data.data.filter(p => p.discount > 0);
  },

  // Admin operations
  async createProduct(data: Partial<Product>): Promise<Product> {
    const response = await api.post<ApiResponse<Product>>('/products', data);
    return response.data.data;
  },

  async updateProduct(id: string, data: Partial<Product>): Promise<Product> {
    const response = await api.put<ApiResponse<Product>>(`/products/${id}`, data);
    return response.data.data;
  },

  async deleteProduct(id: string): Promise<void> {
    await api.delete(`/products/${id}`);
  },
};
