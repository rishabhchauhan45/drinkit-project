'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Ticket,
  Truck,
  Settings,
  LogOut,
  Menu,
  Bell
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const adminNavItems = [
  { name: 'Dashboard', href: '/admin', icon: <LayoutDashboard className="h-5 w-5" />, exact: true },
  { name: 'Products', href: '/admin/products', icon: <Package className="h-5 w-5" /> },
  { name: 'Orders', href: '/admin/orders', icon: <ShoppingCart className="h-5 w-5" /> },
  { name: 'Users', href: '/admin/users', icon: <Users className="h-5 w-5" /> },
  { name: 'Coupons', href: '/admin/coupons', icon: <Ticket className="h-5 w-5" /> },
  { name: 'Delivery Partners', href: '/admin/delivery', icon: <Truck className="h-5 w-5" /> },
  { name: 'Settings', href: '/admin/settings', icon: <Settings className="h-5 w-5" /> },
];

export default function AdminLayout({
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
      router.push('/login?returnUrl=/admin');
    } else if (user?.role !== 'ADMIN') {
      router.push('/'); // Or an unauthorized page
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || user?.role !== 'ADMIN') return null;

  const NavContent = () => (
    <div className="flex h-full flex-col">
      <div className="p-6">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <span className="text-sm font-bold text-white">D</span>
          </div>
          <span className="text-xl font-bold tracking-tight">DrinkIt Admin</span>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 px-4">
        {adminNavItems.map((item) => {
          const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive 
                  ? 'bg-primary/10 text-primary' 
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <div className={isActive ? 'text-primary' : 'text-muted-foreground'}>
                {item.icon}
              </div>
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="border-t p-4">
        <button 
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
        >
          <LogOut className="h-5 w-5" />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-muted/30">
      
      {/* Desktop Sidebar */}
      <aside className="hidden w-64 shrink-0 border-r bg-background lg:block">
        <NavContent />
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        
        {/* Top Header */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b bg-background px-4 sm:px-6">
          <div className="flex items-center gap-4 lg:hidden">
            <Sheet>
              <SheetTrigger render={<Button variant="ghost" size="icon" className="-ml-2" />}>
                <Menu className="h-5 w-5" />
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0">
                <NavContent />
              </SheetContent>
            </Sheet>
            <span className="font-bold">DrinkIt Admin</span>
          </div>

          <div className="hidden lg:block">
            {/* Context-aware title or breadcrumbs could go here */}
          </div>

          <div className="flex items-center gap-4 ml-auto">
            <Button variant="ghost" size="icon" className="relative rounded-full">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive border-2 border-background" />
            </Button>
            
            <div className="flex items-center gap-3 pl-4 border-l">
              <div className="hidden text-right sm:block">
                <p className="text-sm font-medium leading-none">{user.name}</p>
                <p className="text-xs text-muted-foreground mt-1">Admin</p>
              </div>
              <Avatar 
                src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`} 
                fallback="A" 
                size="sm"
              />
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
