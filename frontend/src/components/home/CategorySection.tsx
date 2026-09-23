'use client';

import Link from 'next/link';

const categories = [
  { name: 'Whiskey', image: 'https://placehold.co/200x200/fef3c7/b45309.png?text=Whiskey', href: '/products?category=WHISKEY' },
  { name: 'Beer', image: 'https://placehold.co/200x200/fef08a/854d0e.png?text=Beer', href: '/products?category=BEER' },
  { name: 'Wine', image: 'https://placehold.co/200x200/ffe4e6/be123c.png?text=Wine', href: '/products?category=WINE' },
  { name: 'Vodka', image: 'https://placehold.co/200x200/dbeafe/1d4ed8.png?text=Vodka', href: '/products?category=VODKA' },
  { name: 'Gin', image: 'https://placehold.co/200x200/d1fae5/047857.png?text=Gin', href: '/products?category=GIN' },
  { name: 'Rum', image: 'https://placehold.co/200x200/ffedd5/c2410c.png?text=Rum', href: '/products?category=RUM' },
  { name: 'Mixers', image: 'https://placehold.co/200x200/cffafe/0f766e.png?text=Mixers', href: '/products?category=MIXERS' },
  { name: 'Snacks', image: 'https://placehold.co/200x200/f5f5f4/44403c.png?text=Snacks', href: '/products?category=SNACKS' },
];

export default function CategorySection() {
  return (
    <section className="py-8 bg-white border-b border-gray-100">
      <div className="container mx-auto px-4 max-w-7xl">
        <h2 className="text-xl font-bold tracking-tight text-slate-900 mb-6">Explore Categories</h2>

        <div className="grid grid-cols-4 md:grid-cols-8 gap-3 sm:gap-4">
          {categories.map((category) => (
            <Link key={category.name} href={category.href}>
              <div className="flex flex-col items-center gap-2 cursor-pointer group">
                <div className="relative w-full aspect-square overflow-hidden rounded-xl bg-gray-50 border border-gray-100 shadow-sm transition-transform duration-200 group-hover:shadow-md group-hover:-translate-y-1">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-xs sm:text-sm font-semibold text-slate-800 text-center leading-tight">
                  {category.name}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
