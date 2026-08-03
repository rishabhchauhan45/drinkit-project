'use client';

import { Provider } from 'react-redux';
import { store } from '@/store/store';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 2,
            staleTime: 5 * 60 * 1000, // 5 minutes
            cacheTime: 10 * 60 * 1000, // 10 minutes
            refetchOnWindowFocus: false,
          },
          mutations: {
            retry: 1,
          },
        },
      })
  );

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AnimatePresence mode="wait">
          {children}
        </AnimatePresence>
      </QueryClientProvider>
    </Provider>
  );
}
