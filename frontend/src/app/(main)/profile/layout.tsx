'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, ShoppingBag, Heart, MapPin, Settings, LogOut } from 'lucide-react';
import Sidebar from '@/components/layout/Sidebar';
import { useAuth } from '@/hooks/useAuth';

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login?returnUrl=/profile');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  const sidebarItems = [
    { name: 'My Profile', href: '/profile', icon: <User className="h-5 w-5" />, exact: true },
    { name: 'My Orders', href: '/profile/orders', icon: <ShoppingBag className="h-5 w-5" /> },
    { name: 'Wishlist', href: '/profile/wishlist', icon: <Heart className="h-5 w-5" /> },
    { name: 'Addresses', href: '/profile/addresses', icon: <MapPin className="h-5 w-5" /> },
    { name: 'Settings', href: '/profile/settings', icon: <Settings className="h-5 w-5" /> },
  ];

  return (
    <div className="container mx-auto px-4 py-8 lg:py-12">
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Sidebar */}
        <div className="w-full lg:w-64 shrink-0 space-y-4">
          <Sidebar 
            items={sidebarItems} 
            title={user?.name}
            description={user?.email}
          />
          
          <button 
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-xl px-7 py-3 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
          >
            <LogOut className="h-5 w-5" />
            Sign Out
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {children}
        </div>
        
      </div>
    </div>
  );
}
