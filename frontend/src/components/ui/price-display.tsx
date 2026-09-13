import { cn } from '@/lib/utils';

interface PriceDisplayProps {
  price: number;
  mrp?: number;
  discount?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  currency?: string;
}

function PriceDisplay({
  price,
  mrp,
  discount,
  size = 'md',
  className,
  currency = '₹',
}: PriceDisplayProps) {
  const textSizes = {
    sm: { price: 'text-sm', mrp: 'text-xs', discount: 'text-xs' },
    md: { price: 'text-xl', mrp: 'text-sm', discount: 'text-xs' },
    lg: { price: 'text-3xl', mrp: 'text-base', discount: 'text-sm' },
  };

  const s = textSizes[size];
  const hasDiscount = mrp && mrp > price;
  const discountPct = discount || (hasDiscount ? Math.round(((mrp - price) / mrp) * 100) : 0);

  return (
    <div className={cn('flex items-baseline gap-2 flex-wrap', className)}>
      <span className={cn('font-bold text-foreground', s.price)}>
        {currency}{price.toLocaleString('en-IN')}
      </span>
      {hasDiscount && (
        <>
          <span
            className={cn(
              'text-muted-foreground line-through',
              s.mrp
            )}
          >
            {currency}{mrp.toLocaleString('en-IN')}
          </span>
          {discountPct > 0 && (
            <span className={cn('font-semibold text-emerald-600', s.discount)}>
              {discountPct}% off
            </span>
          )}
        </>
      )}
    </div>
  );
}

export { PriceDisplay };
