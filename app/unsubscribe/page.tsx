import type { Metadata } from 'next';
import { Suspense } from 'react';
import UnsubscribeClient from '@/components/pages/UnsubscribeClient';
export const metadata: Metadata = {
  title: 'Unsubscribe – Tflixs Newsletter',
  robots: { index: false, follow: false },
};
export default function UnsubscribePage() {
  return <Suspense fallback={<div className="spinner" />}><UnsubscribeClient /></Suspense>;
}
