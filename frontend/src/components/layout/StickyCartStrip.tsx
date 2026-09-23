'use client';

import Link from 'next/link';
import { useCart } from '@/hooks/useCart';
import { ChevronRight, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function StickyCartStrip() {
  const { itemCount, total } = useCart();

  return (
    <AnimatePresence>
      {itemCount > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-8 md:w-[400px]"
        >
          <Link href="/cart">
            <div className="bg-emerald-600 text-white rounded-xl shadow-2xl p-4 flex items-center justify-between cursor-pointer hover:bg-emerald-700 transition-colors">
              <div className="flex items-center gap-3">
                <div className="bg-emerald-700/50 p-2 rounded-lg">
                  <ShoppingBag className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-bold">{itemCount} {itemCount === 1 ? 'item' : 'items'}</p>
                  <p className="text-xs font-semibold opacity-90">₹{total.toFixed(2)}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 font-bold text-sm">
                View Cart <ChevronRight className="h-4 w-4" />
              </div>
            </div>
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
