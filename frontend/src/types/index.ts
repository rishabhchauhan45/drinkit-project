// ============================================
// DrinkIt — Complete TypeScript Type Definitions
// ============================================

// ---------- Enums ----------

export type ProductCategory =
  | 'WHISKEY'
  | 'VODKA'
  | 'RUM'
  | 'GIN'
  | 'WINE'
  | 'BEER'
  | 'SNACKS'
  | 'MIXERS';

export type UserRole = 'USER' | 'ADMIN' | 'DELIVERY_PARTNER';

export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PREPARING'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED';

export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';

export type DeliveryStatus = 'ASSIGNED' | 'PICKED_UP' | 'IN_TRANSIT' | 'DELIVERED';

// ---------- Core Models ----------

export interface Product {
  _id: string;
  name: string;
  category: ProductCategory;
  subCategory?: string;
  price: number;
  mrp: number;
  discount: number;
  volume: string;
  abv: number;
  brand: string;
  description: string;
  images: string[];
  stock: number;
  tags: string[];
  pairings: Product[];
  ratings: {
    average: number;
    count: number;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  _id: string;
  name: string;
  icon: string;
  image: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  phone: string;
  name: string;
  age: number;
  isVerified: boolean;
  role: UserRole;
  addresses: Address[];
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  id: string;
  userId: string;
  lat: number;
  lng: number;
  address: string;
  landmark?: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface OrderProduct {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  userId: string;
  user?: Pick<User, 'name' | 'email' | 'phone'>;
  products: OrderProduct[];
  totalAmount: number;
  deliveryFee: number;
  tax: number;
  discount: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  deliveryId?: string;
  delivery?: Delivery;
  createdAt: string;
  updatedAt: string;
}

export interface Delivery {
  id: string;
  orderId: string;
  partnerId: string;
  partnerName: string;
  partnerPhone: string;
  currentLat: number;
  currentLng: number;
  status: DeliveryStatus;
  estimatedTime: number;
  startedAt?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  productId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

// ---------- Cart ----------

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  mrp: number;
  quantity: number;
  image: string;
  stock: number;
  volume?: string;
  brand?: string;
}

export interface Coupon {
  code: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue: number;
  minOrderAmount: number;
  maxDiscount?: number;
  isActive: boolean;
  expiresAt: string;
}

// ---------- API Types ----------

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  page: number;
  limit: number;
  total: number;
  cached?: boolean;
}

// ---------- Request Types ----------

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  phone: string;
  age: number;
  password: string;
}

export interface ProductFilters {
  category?: ProductCategory;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  brand?: string;
  page?: number;
  limit?: number;
  sort?: 'price_asc' | 'price_desc' | 'newest' | 'popular' | 'discount';
}

export interface CreateOrderRequest {
  products: Array<{ productId: string; quantity: number }>;
  address: string;
  paymentMethod: string;
}

// ---------- Auth Response ----------

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: UserRole;
  };
}

// ---------- Delivery Dashboard ----------

export interface DeliveryEarnings {
  today: number;
  week: number;
  month: number;
  totalDeliveries: number;
}

// ---------- Admin Dashboard ----------

export interface AdminStats {
  totalRevenue: number;
  totalOrders: number;
  totalUsers: number;
  totalProducts: number;
  revenueChange: number;
  ordersChange: number;
  usersChange: number;
}

export interface ChartData {
  label: string;
  value: number;
}

// ---------- Component Props ----------

export interface NavItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
  badge?: string;
  children?: NavItem[];
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface DeliverySlot {
  id: string;
  label: string;
  startTime: string;
  endTime: string;
  available: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  comment: string;
  location: string;
}

export interface Brand {
  id: string;
  name: string;
  logo: string;
  productCount: number;
}
