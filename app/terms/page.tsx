import type { Metadata } from 'next';
import TermsClient from '@/components/pages/TermsClient';
export const metadata: Metadata = {
  title: 'Terms and Conditions – Tflixs',
  description: 'Read the terms and conditions for using Tflixs.',
  alternates: { canonical: 'https://tflixs.com/terms' },
};
export default function TermsPage() { return <TermsClient />; }
