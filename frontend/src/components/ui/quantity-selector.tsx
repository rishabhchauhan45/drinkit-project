'use client';

import { Minus, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface QuantitySelectorProps {
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
  size?: 'sm' | 'md';
  className?: string;
}

function QuantitySelector({
  value,
  min = 1,
  max = 99,
  onChange,
  size = 'md',
  className,
}: QuantitySelectorProps) {
  const sizes = {
    sm: {
      button: 'h-7 w-7',
      icon: 'h-3 w-3',
      text: 'text-xs w-7',
    },
    md: {
      button: 'h-9 w-9',
      icon: 'h-4 w-4',
      text: 'text-sm w-9',
    },
  };

  const s = sizes[size];

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <button
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className={cn(
          'flex items-center justify-center rounded-lg border border-border bg-background transition-all hover:bg-muted disabled:opacity-40',
          s.button
        )}
        aria-label="Decrease quantity"
      >
        <Minus className={s.icon} />
      </button>

      <AnimatePresence mode="wait">
        <motion.span
          key={value}
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 5 }}
          transition={{ duration: 0.1 }}
          className={cn(
            'flex items-center justify-center font-semibold text-foreground',
            s.text
          )}
        >
          {value}
        </motion.span>
      </AnimatePresence>

      <button
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className={cn(
          'flex items-center justify-center rounded-lg border border-primary bg-primary text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-40',
          s.button
        )}
        aria-label="Increase quantity"
      >
        <Plus className={s.icon} />
      </button>
    </div>
  );
}

export { QuantitySelector };
