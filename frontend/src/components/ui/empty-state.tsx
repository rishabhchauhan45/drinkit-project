import { cn } from '@/lib/utils';
import { PackageOpen, Search, ShoppingCart, Heart, FileX } from 'lucide-react';
import { Button } from './button';

interface EmptyStateProps {
  icon?: 'cart' | 'search' | 'wishlist' | 'orders' | 'generic';
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

const iconMap = {
  cart: ShoppingCart,
  search: Search,
  wishlist: Heart,
  orders: PackageOpen,
  generic: FileX,
};

function EmptyState({
  icon = 'generic',
  title,
  description,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  const Icon = iconMap[icon];

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-16 px-6 text-center',
        className
      )}
    >
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
        <Icon className="h-10 w-10 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      {description && (
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          {description}
        </p>
      )}
      {actionLabel && onAction && (
        <Button onClick={onAction} className="mt-6">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

export { EmptyState };
