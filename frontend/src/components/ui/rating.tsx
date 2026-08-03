'use client';

import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RatingProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  count?: number;
  interactive?: boolean;
  onChange?: (value: number) => void;
  className?: string;
}

function Rating({
  value,
  max = 5,
  size = 'md',
  showValue = false,
  count,
  interactive = false,
  onChange,
  className,
}: RatingProps) {
  const sizes = {
    sm: 'h-3.5 w-3.5',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  return (
    <div className={cn('flex items-center gap-1', className)} role="img" aria-label={`Rating: ${value} out of ${max}`}>
      <div className="flex items-center gap-0.5">
        {Array.from({ length: max }).map((_, i) => {
          const filled = i < Math.floor(value);
          const halfFilled = !filled && i < value;

          return (
            <button
              key={i}
              type="button"
              disabled={!interactive}
              onClick={() => interactive && onChange?.(i + 1)}
              className={cn(
                'relative',
                interactive && 'cursor-pointer hover:scale-110 transition-transform'
              )}
              aria-label={interactive ? `Rate ${i + 1} stars` : undefined}
            >
              <Star
                className={cn(
                  sizes[size],
                  'transition-colors',
                  filled
                    ? 'fill-amber-400 text-amber-400'
                    : halfFilled
                    ? 'fill-amber-400/50 text-amber-400'
                    : 'fill-gray-200 text-gray-200'
                )}
              />
            </button>
          );
        })}
      </div>
      {showValue && (
        <span className={cn('font-medium text-foreground', textSizes[size])}>
          {value.toFixed(1)}
        </span>
      )}
      {count !== undefined && (
        <span className={cn('text-muted-foreground', textSizes[size])}>
          ({count})
        </span>
      )}
    </div>
  );
}

export { Rating };
