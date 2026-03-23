import type { Metadata } from 'next';
import AboutClient from '@/components/pages/AboutClient';
export const metadata: Metadata = {
  title: 'About Tflixs – Free Fertilizer Recommendation Tool',
  description: 'Tflixs provides science-based fertilizer recommendations for farmers worldwide.',
  alternates: { canonical: 'https://tflixs.com/about' },
};
export default function AboutPage() { return <AboutClient />; }
