'use client';

import * as React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  fallbackSrc?: string;
  sizes?: string;
  priority?: boolean;
}

const DEFAULT_FALLBACK = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNGM0Y0RjYiLz48cGF0aCBkPSJNODAgOTBINjBWMTEwSDgwVjkwWiIgZmlsbD0iI0Q1RDdEQiIvPjxwYXRoIGQ9Ik0xNDAgOTBIMTIwVjExMEgxNDBWOTBaIiBmaWxsPSIjRDVEN0RCIi8+PHBhdGggZD0iTTEwMCA3MEg4MFYxMzBIMTIwVjcwSDEwMFoiIGZpbGw9IiNEMUQ1REIiLz48L3N2Zz4=';

function ImageWithFallback({
  src,
  alt,
  width,
  height,
  fill,
  className,
  fallbackSrc = DEFAULT_FALLBACK,
  sizes,
  priority = false,
}: ImageWithFallbackProps) {
  const [imgSrc, setImgSrc] = React.useState(src);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    setImgSrc(src);
    setIsLoading(true);
  }, [src]);

  return (
    <div className={cn('relative overflow-hidden', fill && 'h-full w-full', className)}>
      {isLoading && (
        <div className="absolute inset-0 animate-pulse bg-muted rounded-lg" />
      )}
      <Image
        src={imgSrc || fallbackSrc}
        alt={alt}
        width={fill ? undefined : (width || 300)}
        height={fill ? undefined : (height || 300)}
        fill={fill}
        sizes={sizes}
        priority={priority}
        className={cn(
          'object-cover transition-opacity duration-300',
          isLoading ? 'opacity-0' : 'opacity-100'
        )}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setImgSrc(fallbackSrc);
          setIsLoading(false);
        }}
      />
    </div>
  );
}

export { ImageWithFallback };
