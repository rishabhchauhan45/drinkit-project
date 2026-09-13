'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  MapPin, 
  Package, 
  History,
  Settings,
  LogOut,
  Bell,
  Menu,
  Bike
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const deliveryNavItems = [
  { name: 'Active Orders', href: '/delivery', icon: <Package className="h-5 w-5" />, exact: true },
  { name: 'Route Map', href: '/delivery/route', icon: <MapPin className="h-5 w-5" /> },
  { name: 'History', href: '/delivery/history', icon: <History className="h-5 w-5" /> },
  { name: 'Settings', href: '/delivery/settings', icon: <Settings className="h-5 w-5" /> },
];

export default function DeliveryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, user, logout } = useAuth();

  // Basic role-based protection
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login?returnUrl=/delivery');
    } else if (user?.role !== 'DELIVERY') {
      // Allow ADMIN to view it too for demo purposes, but normally just DELIVERY
      if (user?.role !== 'ADMIN') {
        router.push('/');
      }
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || (user?.role !== 'DELIVERY' && user?.role !== 'ADMIN')) return null;

  const NavContent = () => (
    <div className="flex h-full flex-col bg-emerald-950 text-white">
      <div className="p-6">
        <Link href="/delivery" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500">
            <Bike className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">DrinkIt Partner</span>
        </Link>
      </div>

      <div className="px-6 py-4 mb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <Avatar 
            src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`} 
            fallback="D" 
          />
          <div>
            <p className="font-semibold leading-none">{user.name}</p>
            <div className="flex items-center gap-1.5 mt-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-xs text-emerald-400 font-medium">Online</span>
            </div>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-4">
        {deliveryNavItems.map((item) => {
          const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors ${
                isActive 
                  ? 'bg-emerald-500/20 text-emerald-400' 
                  : 'text-white/70 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className={isActive ? 'text-emerald-400' : 'text-white/70'}>
                {item.icon}
              </div>
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        <button 
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-rose-400 hover:bg-rose-500/10 transition-colors"
        >
          <LogOut className="h-5 w-5" />
          Go Offline & Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-slate-50">
      
      {/* Desktop Sidebar */}
      <aside className="hidden w-64 shrink-0 lg:block">
        <NavContent />
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        
        {/* Top Header - Mobile Only mostly */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b bg-white px-4 sm:px-6 lg:hidden">
          <div className="flex items-center gap-3">
            <Sheet>
              <SheetTrigger render={<Button variant="ghost" size="icon" className="-ml-2" />}>
                <Menu className="h-5 w-5" />
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0 border-none">
                <NavContent />
              </SheetContent>
            </Sheet>
            <span className="font-bold">Partner App</span>
          </div>

          <Button variant="ghost" size="icon" className="relative rounded-full">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-white" />
          </Button>
        </header>

        {/* Global Alert for Delivery */}
        <div className="bg-emerald-500 text-white px-4 py-2 text-sm font-medium text-center flex items-center justify-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
          </span>
          You are currently accepting orders in Bangalore North
        </div>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
