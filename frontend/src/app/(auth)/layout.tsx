'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Left Side: Form */}
      <div className="flex w-full flex-col justify-center px-4 py-12 sm:px-6 lg:w-[45%] lg:px-20 xl:w-2/5">
        <div className="mx-auto w-full max-w-sm">
          <Link href="/" className="mb-10 flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
              <span className="text-xl font-bold text-white">D</span>
            </div>
            <span className="text-2xl font-bold">
              Drink<span className="text-primary">It</span>
            </span>
          </Link>
          {children}
        </div>
      </div>

      {/* Right Side: Image & Testimonial */}
      <div className="relative hidden w-full lg:block lg:w-[55%] xl:w-3/5 bg-muted">
        <img
          src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=2070&auto=format&fit=crop"
          alt="Premium drinks"
          className="absolute inset-0 h-full w-full object-cover mix-blend-overlay opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-teal-950/80 to-teal-900/60 mix-blend-multiply" />
        
        {/* Animated quote box */}
        <div className="absolute bottom-16 left-16 right-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="rounded-2xl border border-white/20 bg-black/30 backdrop-blur-md p-8 shadow-2xl max-w-lg"
          >
            <div className="mb-6 flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg key={star} className="h-5 w-5 text-amber-400 fill-amber-400" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="mb-6 text-2xl font-medium leading-relaxed text-white">
              "The most premium and reliable alcohol delivery service I've ever used. The DrinkIt Black collection is simply unmatched."
            </p>
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full overflow-hidden border-2 border-white/20">
                <img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&auto=format&fit=crop&q=60" alt="Arjun Kapoor" className="h-full w-full object-cover" />
              </div>
              <div>
                <p className="font-semibold text-white">Arjun Kapoor</p>
                <p className="text-sm text-white/70">Connoisseur Member</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
