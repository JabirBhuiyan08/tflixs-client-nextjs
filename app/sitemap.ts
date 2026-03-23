import type { MetadataRoute } from 'next';
import { getAllCropSlugs } from '@/lib/crops';

const SITE_URL = 'https://tflixs.com';

type ChangeFrequency = 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';

interface BlogPost { slug: string; updatedAt?: string; createdAt: string; }

const staticPages: Array<{ url: string; priority: number; changeFrequency: ChangeFrequency }> = [
  { url: '/',                priority: 1.0, changeFrequency: 'weekly'  },
  { url: '/calculator',      priority: 0.9, changeFrequency: 'monthly' },
  { url: '/seed-calculator', priority: 0.9, changeFrequency: 'monthly' },
  { url: '/blog',            priority: 0.8, changeFrequency: 'daily'   },
  { url: '/calendar',        priority: 0.7, changeFrequency: 'monthly' },
  { url: '/pest-guide',      priority: 0.7, changeFrequency: 'monthly' },
  { url: '/about',           priority: 0.5, changeFrequency: 'monthly' },
  { url: '/contact',         priority: 0.5, changeFrequency: 'monthly' },
  { url: '/terms',           priority: 0.3, changeFrequency: 'yearly'  },
  { url: '/privacy',         priority: 0.3, changeFrequency: 'yearly'  },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const cropSlugs = getAllCropSlugs();

  // Fetch published blog posts (ISR-cached)
  let blogPosts: BlogPost[] = [];
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? '';
    const res    = await fetch(`${apiUrl}/api/blogs?limit=500&page=1`, {
      next: { revalidate: 3600 },
    });
    const data = await res.json() as { blogs?: BlogPost[] };
    blogPosts  = data.blogs ?? [];
  } catch { /* non-fatal */ }

  const cropPages: MetadataRoute.Sitemap = cropSlugs.map(slug => ({
    url:             `${SITE_URL}/calculator/${slug}`,
    lastModified:    new Date(),
    changeFrequency: 'monthly' as ChangeFrequency,
    priority:        0.9,
  }));

  const blogPages: MetadataRoute.Sitemap = blogPosts.map(post => ({
    url:             `${SITE_URL}/blog/${post.slug}`,
    lastModified:    new Date(post.updatedAt ?? post.createdAt),
    changeFrequency: 'monthly' as ChangeFrequency,
    priority:        0.7,
  }));

  const statics: MetadataRoute.Sitemap = staticPages.map(p => ({
    url:             `${SITE_URL}${p.url}`,
    lastModified:    new Date(),
    changeFrequency: p.changeFrequency,
    priority:        p.priority,
  }));

  return [...statics, ...cropPages, ...blogPages];
}
