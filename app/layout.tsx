"use client";

import { Provider } from 'react-redux';
import { store } from '../store/store';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '../lib/react-query-client';
import '../styles/globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Provider store={store}>
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        </Provider>
      </body>
    </html>
  );
}
