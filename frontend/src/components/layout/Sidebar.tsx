'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export interface SidebarItem {
  name: string;
  href: string;
  icon: React.ReactNode;
  badge?: string;
  exact?: boolean;
}

export interface SidebarProps {
  items: SidebarItem[];
  title?: string;
  description?: string;
}

export default function Sidebar({ items, title, description }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div className="w-full lg:w-64 shrink-0">
      <div className="sticky top-24 rounded-2xl border bg-card p-4 shadow-soft-sm">
        {(title || description) && (
          <div className="mb-6 px-2">
            {title && <h2 className="text-lg font-semibold">{title}</h2>}
            {description && (
              <p className="mt-1 text-sm text-muted-foreground">{description}</p>
            )}
          </div>
        )}

        <nav className="flex flex-col gap-1">
          {items.map((item) => {
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'group relative flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'text-primary'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute inset-0 rounded-xl bg-primary/10"
                    initial={false}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                  />
                )}
                
                <div className="relative flex items-center gap-3">
                  <div
                    className={cn(
                      'flex items-center justify-center transition-colors',
                      isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'
                    )}
                  >
                    {item.icon}
                  </div>
                  <span>{item.name}</span>
                </div>

                {item.badge && (
                  <span
                    className={cn(
                      'relative ml-auto flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[10px] font-bold',
                      isActive
                        ? 'bg-primary text-white'
                        : 'bg-muted-foreground/20 text-muted-foreground group-hover:bg-muted-foreground/30'
                    )}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
