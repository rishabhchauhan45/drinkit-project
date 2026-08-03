import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  label?: string;
}

function LoadingSpinner({ size = 'md', className, label }: LoadingSpinnerProps) {
  const sizes = {
    sm: 'h-5 w-5 border-2',
    md: 'h-8 w-8 border-[3px]',
    lg: 'h-12 w-12 border-4',
  };

  return (
    <div className={cn('flex flex-col items-center justify-center gap-3', className)}>
      <div
        className={cn(
          'animate-spin rounded-full border-primary/20 border-t-primary',
          sizes[size]
        )}
        role="status"
        aria-label={label || 'Loading'}
      />
      {label && (
        <span className="text-sm text-muted-foreground">{label}</span>
      )}
    </div>
  );
}

function PageLoader() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <LoadingSpinner size="lg" label="Loading..." />
    </div>
  );
}

export { LoadingSpinner, PageLoader };
