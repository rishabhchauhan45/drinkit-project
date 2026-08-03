import { cn } from '@/lib/utils';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from './button';

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}

function ErrorState({
  title = 'Something went wrong',
  description = 'An unexpected error occurred. Please try again.',
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-16 px-6 text-center',
        className
      )}
    >
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
        <AlertTriangle className="h-10 w-10 text-destructive" />
      </div>
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        {description}
      </p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline" className="mt-6 gap-2">
          <RefreshCw className="h-4 w-4" />
          Try Again
        </Button>
      )}
    </div>
  );
}

export { ErrorState };
