'use client';
import { ReactNode } from 'react';
import { AuthProvider } from '@/contexts/AuthContext';

export default function AdminProviders({ children }: { children: ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
