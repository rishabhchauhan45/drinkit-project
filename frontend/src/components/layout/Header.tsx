'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Search,
  ShoppingCart,
  User,
  Menu,
  X,
  Heart,
  ChevronDown,
  MapPin,
  LogOut,
  Package,
  Settings,
  LayoutDashboard,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { RootState } from '@/store/store';
import { setCartDrawerOpen, setMobileMenuOpen, setSearchOpen } from '@/store/slices/uiSlice';

const categories = [
  { name: 'Whiskey', href: '/products?category=WHISKEY' },
  { name: 'Beer', href: '/products?category=BEER' },
  { name: 'Wine', href: '/products?category=WINE' },
  { name: 'Vodka', href: '/products?category=VODKA' },
  { name: 'Gin', href: '/products?category=GIN' },
  { name: 'Rum', href: '/products?category=RUM' },
  { name: 'Mixers', href: '/products?category=MIXERS' },
  { name: 'Snacks', href: '/products?category=SNACKS' },
];

export default function Header() {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);
  const [scrolled, setScrolled] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={cn(
        'sticky top-0 z-40 w-full transition-all duration-300',
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-soft-sm border-b border-border/50'
          : 'bg-white border-b border-border/30'
      )}
    >
      {/* Top Bar */}
      <div className="border-b border-border/30 bg-primary text-primary-foreground">
        <div className="container mx-auto flex h-8 items-center justify-between px-4 text-xs">
          <div className="flex items-center gap-2">
            <MapPin className="h-3 w-3" />
            <span>Deliver to your doorstep in minutes</span>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <span>Need help? Call us: 1800-DRINKIT</span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-4">
        {/* Left: Logo & Mobile Menu */}
        <div className="flex items-center gap-3">
          <button
            className="lg:hidden rounded-lg p-2 hover:bg-muted transition-colors"
            onClick={() => dispatch(setMobileMenuOpen(true))}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary">
              <span className="text-lg font-bold text-white">D</span>
            </div>
            <span className="text-xl font-bold text-foreground hidden sm:block">
              Drink<span className="text-primary">It</span>
            </span>
          </Link>
        </div>

        {/* Center: Search */}
        <div className="flex-1 max-w-2xl mx-4 hidden md:block">
          <button
            onClick={() => dispatch(setSearchOpen(true))}
            className="flex w-full items-center gap-3 rounded-xl border border-border bg-muted/50 px-4 py-2.5 text-sm text-muted-foreground hover:border-primary/30 hover:bg-muted transition-all"
          >
            <Search className="h-4 w-4" />
            <span>Search for drinks, brands, snacks...</span>
            <kbd className="ml-auto hidden rounded-md border bg-background px-2 py-0.5 text-[10px] font-mono text-muted-foreground lg:inline">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Mobile Search */}
          <button
            className="md:hidden rounded-lg p-2 hover:bg-muted transition-colors"
            onClick={() => dispatch(setSearchOpen(true))}
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </button>

          {/* Wishlist */}
          <Link href="/profile/wishlist" className="hidden sm:flex">
            <Button variant="ghost" size="icon" className="relative">
              <Heart className="h-5 w-5" />
              {wishlistItems.length > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[9px] font-bold text-white">
                  {wishlistItems.length}
                </span>
              )}
            </Button>
          </Link>

          {/* Cart */}
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            onClick={() => dispatch(setCartDrawerOpen(true))}
            aria-label="Open cart"
          >
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                {cartCount}
              </span>
            )}
          </Button>

          {/* User */}
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-muted transition-colors"
              >
                <Avatar
                  fallback={user?.name}
                  size="sm"
                />
                <span className="hidden lg:block text-sm font-medium max-w-[100px] truncate">
                  {user?.name?.split(' ')[0]}
                </span>
                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground hidden lg:block" />
              </button>

              {/* User Dropdown */}
              {showUserMenu && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowUserMenu(false)}
                  />
                  <div className="absolute right-0 top-full mt-2 z-50 w-56 rounded-xl border bg-background p-2 shadow-soft-md animate-scale-in">
                    <div className="px-3 py-2 border-b mb-1">
                      <p className="text-sm font-medium">{user?.name}</p>
                      <p className="text-xs text-muted-foreground">{user?.email}</p>
                    </div>
                    <Link
                      href="/profile"
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-muted transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <User className="h-4 w-4" />
                      My Profile
                    </Link>
                    <Link
                      href="/profile/orders"
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-muted transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <Package className="h-4 w-4" />
                      My Orders
                    </Link>
                    <Link
                      href="/profile/wishlist"
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-muted transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <Heart className="h-4 w-4" />
                      Wishlist
                    </Link>
                    <Link
                      href="/profile/settings"
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-muted transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <Settings className="h-4 w-4" />
                      Settings
                    </Link>
                    {user?.role === 'ADMIN' && (
                      <Link
                        href="/admin"
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-muted transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        Admin Dashboard
                      </Link>
                    )}
                    <div className="border-t mt-1 pt-1">
                      <button
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                        onClick={() => {
                          setShowUserMenu(false);
                          // logout handled by the page
                        }}
                      >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Sign Up</Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Category Navigation */}
      <div className="border-t border-border/30 hidden lg:block">
        <div className="container mx-auto px-4">
          <nav className="flex items-center gap-1 h-10 -mb-px">
            <Link
              href="/products"
              className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors rounded-lg hover:bg-primary/5"
            >
              All Products
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.name}
                href={cat.href}
                className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors rounded-lg hover:bg-primary/5"
              >
                {cat.name}
              </Link>
            ))}
            <Link
              href="/products?sort=discount"
              className="flex items-center gap-1 px-3 py-2 text-sm font-medium transition-colors rounded-lg"
            >
              <Badge variant="accent" className="text-[10px]">
                🔥 Deals
              </Badge>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
