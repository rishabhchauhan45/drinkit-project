'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDispatch, useSelector } from 'react-redux';
import { setAgeVerified } from '@/store/slices/authSlice';
import type { RootState } from '@/store/store';

export default function AgeVerificationModal() {
  const dispatch = useDispatch();
  const isVerified = useSelector((state: RootState) => state.auth.isAgeVerified);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || isVerified) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-md overflow-hidden rounded-3xl bg-background shadow-2xl"
        >
          {/* Header Image/Pattern */}
          <div className="h-32 bg-primary flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent bg-[length:20px_20px]" />
            <div className="h-16 w-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-inner">
              <ShieldAlert className="h-8 w-8 text-white" />
            </div>
          </div>

          <div className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-3">Are you of legal drinking age?</h2>
            <p className="text-muted-foreground text-sm mb-8">
              You must be 21 years of age or older to enter this site. Please verify your age to continue.
            </p>

            <div className="flex flex-col gap-3">
              <Button 
                size="lg" 
                className="w-full text-base"
                onClick={() => dispatch(setAgeVerified(true))}
              >
                Yes, I am 21 or older
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="w-full text-base"
                onClick={() => {
                  window.location.href = 'https://google.com';
                }}
              >
                No, I am under 21
              </Button>
            </div>
            
            <p className="mt-6 text-[10px] text-muted-foreground uppercase tracking-widest">
              By entering, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
