'use client';

import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, Home, ShoppingBag, Heart, User, LogIn, Phone } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '@/store/store';
import { setMobileMenuOpen } from '@/store/slices/uiSlice';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { useState } from 'react';

const categories = [
  { name: 'All Products', href: '/products' },
  { name: 'Whiskey & Spirits', href: '/products?category=WHISKEY' },
  { name: 'Beer & Cider', href: '/products?category=BEER' },
  { name: 'Wine & Champagne', href: '/products?category=WINE' },
  { name: 'Vodka', href: '/products?category=VODKA' },
  { name: 'Gin', href: '/products?category=GIN' },
  { name: 'Rum', href: '/products?category=RUM' },
  { name: 'Mixers & Cocktails', href: '/products?category=MIXERS' },
  { name: 'Snacks & Accompaniments', href: '/products?category=SNACKS' },
];

export default function MobileMenu() {
  const dispatch = useDispatch();
  const isOpen = useSelector((state: RootState) => state.ui.isMobileMenuOpen);
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  const handleClose = () => dispatch(setMobileMenuOpen(false));

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm lg:hidden"
            onClick={handleClose}
          />
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed inset-y-0 left-0 z-50 w-full max-w-xs bg-background shadow-soft-lg lg:hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b px-4 py-4">
              <Link href="/" className="flex items-center gap-2" onClick={handleClose}>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                  <span className="text-sm font-bold text-white">D</span>
                </div>
                <span className="text-lg font-bold">
                  Drink<span className="text-primary">It</span>
                </span>
              </Link>
              <button
                onClick={handleClose}
                className="rounded-lg p-2 hover:bg-muted transition-colors"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* User Section */}
            <div className="border-b px-4 py-4">
              {isAuthenticated ? (
                <Link href="/profile" onClick={handleClose} className="flex items-center gap-3">
                  <Avatar fallback={user?.name} size="md" />
                  <div>
                    <p className="text-sm font-medium">{user?.name}</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                  </div>
                </Link>
              ) : (
                <div className="flex gap-2">
                  <Link href="/login" onClick={handleClose} className="flex-1">
                    <Button variant="outline" className="w-full" size="sm">
                      Login
                    </Button>
                  </Link>
                  <Link href="/register" onClick={handleClose} className="flex-1">
                    <Button className="w-full" size="sm">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto py-4 scrollbar-thin">
              <div className="px-4 space-y-1">
                <Link
                  href="/"
                  onClick={handleClose}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-muted transition-colors"
                >
                  <Home className="h-4 w-4 text-muted-foreground" />
                  Home
                </Link>

                <div className="pt-3 pb-1">
                  <p className="px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Categories
                  </p>
                </div>
                {categories.map((cat) => (
                  <Link
                    key={cat.name}
                    href={cat.href}
                    onClick={handleClose}
                    className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm hover:bg-muted transition-colors"
                  >
                    {cat.name}
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </Link>
                ))}

                <div className="pt-3 pb-1">
                  <p className="px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Account
                  </p>
                </div>
                <Link
                  href="/profile/orders"
                  onClick={handleClose}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm hover:bg-muted transition-colors"
                >
                  <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                  My Orders
                </Link>
                <Link
                  href="/profile/wishlist"
                  onClick={handleClose}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm hover:bg-muted transition-colors"
                >
                  <Heart className="h-4 w-4 text-muted-foreground" />
                  Wishlist
                </Link>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t px-4 py-4">
              <a
                href="tel:1800-DRINKIT"
                className="flex items-center gap-3 text-sm text-muted-foreground"
              >
                <Phone className="h-4 w-4" />
                Need help? 1800-DRINKIT
              </a>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
