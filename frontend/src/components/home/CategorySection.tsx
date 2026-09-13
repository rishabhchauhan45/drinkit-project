'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

const categories = [
  {
    name: 'Whiskey',
    image: 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=500&auto=format&fit=crop&q=60',
    color: 'bg-amber-100',
    textColor: 'text-amber-900',
    href: '/products?category=WHISKEY',
  },
  {
    name: 'Beer',
    image: 'https://images.unsplash.com/photo-1616124619460-ff4ed8f4683c?w=500&auto=format&fit=crop&q=60',
    color: 'bg-yellow-100',
    textColor: 'text-yellow-900',
    href: '/products?category=BEER',
  },
  {
    name: 'Wine',
    image: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=500&auto=format&fit=crop&q=60',
    color: 'bg-rose-100',
    textColor: 'text-rose-900',
    href: '/products?category=WINE',
  },
  {
    name: 'Vodka',
    image: 'https://images.unsplash.com/photo-1616422285623-14fb795e1e19?w=500&auto=format&fit=crop&q=60',
    color: 'bg-blue-100',
    textColor: 'text-blue-900',
    href: '/products?category=VODKA',
  },
  {
    name: 'Gin',
    image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=500&auto=format&fit=crop&q=60',
    color: 'bg-emerald-100',
    textColor: 'text-emerald-900',
    href: '/products?category=GIN',
  },
  {
    name: 'Rum',
    image: 'https://images.unsplash.com/photo-1615887023516-9b6ca5588260?w=500&auto=format&fit=crop&q=60',
    color: 'bg-orange-100',
    textColor: 'text-orange-900',
    href: '/products?category=RUM',
  },
  {
    name: 'Mixers',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&auto=format&fit=crop&q=60',
    color: 'bg-cyan-100',
    textColor: 'text-cyan-900',
    href: '/products?category=MIXERS',
  },
  {
    name: 'Snacks',
    image: 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=500&auto=format&fit=crop&q=60',
    color: 'bg-stone-100',
    textColor: 'text-stone-900',
    href: '/products?category=SNACKS',
  },
];

export default function CategorySection() {
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h2 className="text-2xl font-bold tracking-tight">Shop by Category</h2>
          <p className="text-muted-foreground mt-1">Explore our wide range of premium beverages</p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8">
          {categories.map((category, index) => (
            <Link key={category.name} href={category.href}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="group flex flex-col items-center gap-3 cursor-pointer"
              >
                <div className={`relative h-24 w-24 sm:h-28 sm:w-28 overflow-hidden rounded-2xl ${category.color} shadow-soft-sm transition-transform duration-300 group-hover:scale-105 group-hover:shadow-soft-md`}>
                  <img
                    src={category.image}
                    alt={category.name}
                    className="h-full w-full object-cover mix-blend-multiply opacity-90 transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <span className={`text-sm font-semibold ${category.textColor} transition-colors group-hover:text-primary`}>
                  {category.name}
                </span>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
