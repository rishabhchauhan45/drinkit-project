'use client';

import Link from 'next/link';

const brands = [
  { name: 'Johnnie Walker', image: 'https://images.unsplash.com/photo-1614316881729-195b0586e3ec?w=200&auto=format&fit=crop&q=60' },
  { name: 'Jack Daniel\'s', image: 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=200&auto=format&fit=crop&q=60' },
  { name: 'Heineken', image: 'https://images.unsplash.com/photo-1616124619460-ff4ed8f4683c?w=200&auto=format&fit=crop&q=60' },
  { name: 'Grey Goose', image: 'https://images.unsplash.com/photo-1616422285623-14fb795e1e19?w=200&auto=format&fit=crop&q=60' },
  { name: 'Sula', image: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=200&auto=format&fit=crop&q=60' },
  { name: 'Bacardi', image: 'https://images.unsplash.com/photo-1615887023516-9b6ca5588260?w=200&auto=format&fit=crop&q=60' },
];

export default function BrandsSection() {
  return (
    <section className="py-16 bg-white border-y border-border/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold tracking-tight">Premium Brands We House</h2>
          <p className="text-muted-foreground mt-2">Authentic spirits straight from the source</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {brands.map((brand) => (
            <Link 
              key={brand.name} 
              href={`/products?brand=${encodeURIComponent(brand.name)}`}
              className="group flex flex-col items-center justify-center p-6 rounded-2xl border bg-muted/20 hover:bg-white hover:border-primary/30 hover:shadow-soft-md transition-all duration-300"
            >
              <div className="h-16 w-16 mb-4 rounded-full overflow-hidden bg-white shadow-sm mix-blend-multiply">
                <img 
                  src={brand.image} 
                  alt={brand.name} 
                  className="h-full w-full object-cover grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
                />
              </div>
              <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground text-center">
                {brand.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
