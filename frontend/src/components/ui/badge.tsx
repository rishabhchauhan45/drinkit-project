import * as React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' | 'accent' | 'discount' | 'new' | 'trending' | 'outOfStock';
}

function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  const variants = {
    default: 'bg-primary text-primary-foreground',
    secondary: 'bg-secondary text-secondary-foreground',
    destructive: 'bg-destructive text-destructive-foreground',
    outline: 'border border-input text-foreground bg-background',
    success: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-100 text-amber-700 border-amber-200',
    accent: 'bg-accent text-accent-foreground',
    discount: 'bg-red-500 text-white font-bold',
    new: 'bg-emerald-500 text-white font-semibold',
    trending: 'bg-gradient-to-r from-amber-400 to-orange-500 text-white font-semibold',
    outOfStock: 'bg-gray-200 text-gray-600',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-medium transition-colors border border-transparent',
        variants[variant],
        className
      )}
      {...props}
    />
  );
}

export { Badge };
