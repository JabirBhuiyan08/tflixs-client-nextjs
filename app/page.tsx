import type { Metadata } from 'next';
import HomeClient from '@/components/pages/HomeClient';

export const metadata: Metadata = {
  title:       'Tflixs – Free NPK Fertilizer Calculator for Farmers',
  description: 'Free fertilizer calculator for farmers. Get accurate NPK recommendations for rice, wheat, vegetables, potato, sugarcane and 15+ crops. No registration.',
  keywords:    ['fertilizer calculator', 'NPK calculator', 'free farming tool', 'crop nutrition', 'rice fertilizer'],
  alternates:  { canonical: 'https://tflixs.com' },
  openGraph: {
    title:       'Tflixs – Free NPK Fertilizer Calculator',
    description: 'Get accurate NPK fertilizer recommendations for any crop. Free, no login required.',
    url:         'https://tflixs.com',
    images:      [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
};

export default function HomePage() {
  return <HomeClient />;
}
