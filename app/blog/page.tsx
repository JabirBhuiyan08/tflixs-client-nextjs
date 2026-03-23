import { Suspense } from 'react';
import type { Metadata } from 'next';
import BlogListClient from '@/components/pages/BlogListClient';

export const metadata: Metadata = {
  title:       'Farming Blog – Fertilizer Tips & Crop Guides',
  description: 'Expert farming articles on fertilizers, soil health, crop nutrition, and pest management. Free guides for rice, wheat, vegetable and fruit farming.',
  keywords:    ['farming blog', 'fertilizer tips', 'crop nutrition guide', 'soil health', 'farming advice'],
  alternates:  { canonical: 'https://tflixs.com/blog' },
  openGraph:   { title: 'Tflixs Farming Blog', description: 'Expert tips on fertilizers, soil health, and crop management.', url: 'https://tflixs.com/blog' },
};

export default function BlogPage() {
  return (
    <Suspense fallback={<div className="spinner" style={{ margin: '60px auto' }} />}>
      <BlogListClient />
    </Suspense>
  );
}