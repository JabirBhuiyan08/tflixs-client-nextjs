import type { Metadata } from 'next';
import PrivacyClient from '@/components/pages/PrivacyClient';
export const metadata: Metadata = {
  title: 'Privacy Policy – Tflixs',
  description: 'Learn how Tflixs collects, uses, and protects your personal information.',
  alternates: { canonical: 'https://tflixs.com/privacy' },
};
export default function PrivacyPage() { return <PrivacyClient />; }
