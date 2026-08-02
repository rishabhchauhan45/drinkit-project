'use client';

import Link from 'next/link';
import { ShoppingCart, User, Search, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

export default function Header() {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const cartItems = useSelector((state: RootState) => state.cart.items);
  
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        
        {/* Logo and Mobile Menu */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-primary">DrinkIt</span>
          </Link>
        </div>

        {/* Desktop Navigation & Search */}
        <div className="hidden flex-1 items-center justify-center gap-6 px-6 md:flex">
          <nav className="flex items-center gap-6 text-sm font-medium">
            <Link href="/products?category=WHISKEY" className="transition-colors hover:text-primary">Whiskey</Link>
            <Link href="/products?category=BEER" className="transition-colors hover:text-primary">Beer</Link>
            <Link href="/products?category=WINE" className="transition-colors hover:text-primary">Wine</Link>
            <Link href="/products?category=SNACKS" className="transition-colors hover:text-primary">Snacks</Link>
          </nav>
          
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products..."
              className="w-full bg-background pl-8 shadow-none"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <Link href="/cart">
            <Button variant="outline" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  {cartCount}
                </span>
              )}
            </Button>
          </Link>
          
          {isAuthenticated ? (
            <Link href="/profile">
              <Button variant="ghost" className="hidden gap-2 md:flex">
                <User className="h-5 w-5" />
                <span>{user?.name?.split(' ')[0] || 'Profile'}</span>
              </Button>
            </Link>
          ) : (
            <div className="hidden gap-2 md:flex">
              <Link href="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link href="/register">
                <Button>Sign Up</Button>
              </Link>
            </div>
          )}
        </div>
        
      </div>
    </header>
  );
}
