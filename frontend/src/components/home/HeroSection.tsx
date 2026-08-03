'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Clock, ShieldCheck, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-background pt-8 pb-16 lg:pt-16 lg:pb-24">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute -left-1/4 -top-1/4 h-[800px] w-[800px] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -right-1/4 -bottom-1/4 h-[600px] w-[600px] rounded-full bg-accent/5 blur-3xl" />
      </div>

      <div className="container relative z-10 mx-auto px-4">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
          
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-start max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-medium text-primary mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Delivering now in your city
            </div>
            
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-foreground mb-6 leading-[1.1]">
              Premium drinks,<br />
              <span className="text-gradient-primary">delivered in minutes.</span>
            </h1>
            
            <p className="text-lg text-muted-foreground mb-8 max-w-lg leading-relaxed">
              Experience the ultimate convenience. Your favorite whiskeys, wines, beers, and snacks brought right to your door. Fast, reliable, and compliant.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Link href="/products" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-base shadow-soft-lg group">
                  Explore Products
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <div className="relative flex-1 sm:min-w-[280px]">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                </div>
                <input 
                  type="text" 
                  placeholder="Enter delivery address" 
                  className="h-14 w-full rounded-xl border border-input bg-background pl-12 pr-4 text-base focus:outline-none focus:ring-2 focus:ring-primary/50 shadow-soft-sm transition-all"
                />
              </div>
            </div>

            {/* Features */}
            <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3">
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Clock className="h-5 w-5" />
                </div>
                <span className="text-sm font-medium text-foreground">30-min Delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <span className="text-sm font-medium text-foreground">100% Authentic</span>
              </div>
            </div>
          </motion.div>

          {/* Hero Image / Composition */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative hidden lg:block h-[600px] w-full"
          >
            <div className="absolute inset-0 rounded-3xl overflow-hidden glass-strong shadow-soft-lg border-white/40 border-2">
              <img 
                src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=2070&auto=format&fit=crop" 
                alt="Premium drinks" 
                className="h-full w-full object-cover opacity-90 mix-blend-overlay"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              
              {/* Floating Cards */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-10 left-10 rounded-2xl bg-white/90 backdrop-blur-md p-4 shadow-soft-lg max-w-[200px]"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-10 w-10 rounded-lg bg-amber-100 overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=500&auto=format&fit=crop&q=60" alt="Whiskey" className="h-full w-full object-cover" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold">Maca...</p>
                    <p className="text-[10px] text-muted-foreground">12 Years Old</p>
                  </div>
                </div>
                <p className="text-xs font-bold">₹5,499</p>
              </motion.div>

              <motion.div 
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute top-20 right-10 rounded-2xl bg-white/90 backdrop-blur-md p-4 shadow-soft-lg max-w-[180px]"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold">Arriving</p>
                    <p className="text-[10px] text-muted-foreground">in 12 mins</p>
                  </div>
                </div>
                <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden mt-2">
                  <div className="h-full bg-emerald-500 w-2/3 rounded-full" />
                </div>
              </motion.div>

            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
