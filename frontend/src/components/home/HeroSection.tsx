'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, ShieldCheck, Search } from 'lucide-react';

const slides = [
  {
    id: 1,
    title: "Premium Whiskeys",
    subtitle: "Delivered in 10 Mins",
    image: "https://placehold.co/800x600/fde047/1e293b.png?text=Premium+Whiskey",
    href: "/products?category=WHISKEY"
  },
  {
    id: 2,
    title: "Weekend Party",
    subtitle: "Flat 20% Off on Beers",
    image: "https://placehold.co/800x600/fef08a/854d0e.png?text=Weekend+Party",
    href: "/products?category=BEER"
  },
  {
    id: 3,
    title: "Mixers & Snacks",
    subtitle: "The Perfect Combo",
    image: "https://placehold.co/800x600/e0f2fe/0369a1.png?text=Mixers+%26+Snacks",
    href: "/products?category=MIXERS"
  }
];

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="bg-yellow-400 py-8 lg:py-16 overflow-hidden">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-2 items-center">
          
          {/* Content */}
          <div className="flex flex-col items-start relative min-h-[280px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.5 }}
                className="w-full absolute top-0"
              >
                <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight text-slate-900 mb-4 leading-tight">
                  {slides[currentSlide].title} <br/>
                  <span className="text-white drop-shadow-sm text-3xl sm:text-4xl lg:text-5xl">{slides[currentSlide].subtitle}</span>
                </h1>
                
                <p className="text-lg lg:text-xl text-slate-800 mb-8 max-w-lg font-medium">
                  The fastest way to get your favorite whiskey, beer, wine, and mixers.
                </p>
                
                <Link href={slides[currentSlide].href} className="inline-block bg-slate-900 text-white px-6 py-3 rounded-xl font-semibold hover:bg-slate-800 transition shadow-lg">
                  Shop Now
                </Link>
              </motion.div>
            </AnimatePresence>

            <div className="mt-auto pt-[280px] sm:pt-[240px] lg:pt-[280px] w-full max-w-xl">
              <div className="relative flex-1 mb-6">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input 
                  type="text" 
                  placeholder="Search for 'Old Monk' or 'Kingfisher'..." 
                  className="h-14 w-full rounded-2xl border-0 bg-white pl-12 pr-4 text-base focus:outline-none focus:ring-4 focus:ring-yellow-300 shadow-md transition-all"
                />
              </div>

              {/* Indicators */}
              <div className="flex gap-2 mb-6">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`h-2 rounded-full transition-all ${
                      index === currentSlide ? "w-8 bg-slate-900" : "w-2 bg-white/50 hover:bg-white"
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>

              {/* Features */}
              <div className="flex flex-wrap gap-4 sm:gap-6">
                <div className="flex items-center gap-2 bg-white/40 px-3 sm:px-4 py-2 rounded-xl backdrop-blur-sm">
                  <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-slate-900" />
                  <span className="text-xs sm:text-sm font-bold text-slate-900">10-min Delivery</span>
                </div>
                <div className="flex items-center gap-2 bg-white/40 px-3 sm:px-4 py-2 rounded-xl backdrop-blur-sm">
                  <ShieldCheck className="h-4 w-4 sm:h-5 sm:w-5 text-slate-900" />
                  <span className="text-xs sm:text-sm font-bold text-slate-900">100% Authentic</span>
                </div>
              </div>
            </div>
          </div>

          {/* Hero Illustration/Image */}
          <div className="relative hidden lg:flex h-[500px] items-center justify-center">
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-full h-[120%] bg-white/20 rounded-full blur-3xl -z-10" />
            
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.5 }}
                className="relative h-full w-full flex items-center justify-center cursor-pointer"
              >
                <Link href={slides[currentSlide].href} className="contents">
                   <img 
                     src={slides[currentSlide].image} 
                     alt={slides[currentSlide].title} 
                     className="rounded-3xl shadow-2xl object-cover max-h-full"
                   />
                </Link>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
