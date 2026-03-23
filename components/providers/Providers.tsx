'use client';

import { ReactNode } from 'react';
import { LocaleProvider }  from '@/contexts/LocaleContext';
import { AuthProvider }    from '@/contexts/AuthContext';
import { AdsenseProvider } from '@/contexts/AdsenseContext';

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <AdsenseProvider>
        <LocaleProvider>
          {children}
        </LocaleProvider>
      </AdsenseProvider>
    </AuthProvider>
  );
}
