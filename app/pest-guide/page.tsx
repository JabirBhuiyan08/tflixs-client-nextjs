import type { Metadata } from 'next';
import PestGuideClient from '@/components/pages/PestGuideClient';
export const metadata: Metadata = {
  title: 'Pest & Disease Guide – Identify and Treat Crop Problems',
  description: 'Identify and treat common crop pests, diseases and nutrient deficiencies.',
  alternates: { canonical: 'https://tflixs.com/pest-guide' },
};
export default function PestGuidePage() { return <PestGuideClient />; }
