import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import BlogPostClient from '@/components/pages/BlogPostClient';
import type { BlogPost } from '@/types';

interface Props { params: Promise<{ slug: string }> }

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? '';

async function getBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    const res = await fetch(`${API_URL}/api/blogs/${slug}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const data = await res.json() as { blog: BlogPost };
    return data.blog;
  } catch { return null; }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getBlogPost(slug);
  if (!blog) return { title: 'Article Not Found' };

  const title       = blog.metaTitle       ?? blog.title;
  const description = blog.metaDescription ?? blog.excerpt;
  const image       = blog.ogImage ?? blog.featuredImage ?? '/og-image.jpg';

  return {
    title,
    description,
    keywords:   blog.metaKeywords ?? blog.tags?.join(', ') ?? '',
    alternates: { canonical: blog.canonicalUrl ?? `https://tflixs.com/blog/${blog.slug}` },
    openGraph: {
      type:          'article',
      title, description,
      url:           `https://tflixs.com/blog/${blog.slug}`,
      images:        [{ url: image, width: 1200, height: 630 }],
      publishedTime: blog.createdAt,
      modifiedTime:  blog.updatedAt,
      authors:       [blog.author ?? 'Tflixs'],
      tags:          blog.tags ?? [],
    },
    twitter: { card: 'summary_large_image', title, description, images: [image] },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const blog = await getBlogPost(slug);
  if (!blog) notFound();

  const articleSchema = {
    '@context':       'https://schema.org',
    '@type':          'Article',
    headline:          blog.title,
    description:       blog.excerpt,
    image:             blog.featuredImage ?? '/og-image.jpg',
    datePublished:     blog.createdAt,
    dateModified:      blog.updatedAt,
    author:           { '@type': 'Person', name: blog.author ?? 'Tflixs' },
    publisher: {
      '@type': 'Organization',
      name:    'Tflixs',
      logo:    { '@type': 'ImageObject', url: 'https://tflixs.com/logo192.png' },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `https://tflixs.com/blog/${blog.slug}` },
  };

  return (
    <>
      <script type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <BlogPostClient initialBlog={blog} slug={slug} />
    </>
  );
}
