'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import PublicLayout from '@/components/layout/PublicLayout';
import AdSlot from '@/components/layout/AdSlot';
import './BlogPost.css';
import type { BlogPost } from '@/types';

interface Props {
  initialBlog: BlogPost;
  slug:        string;
}

export default function BlogPostClient({ initialBlog, slug }: Props) {
  const blog = initialBlog;

  // Increment view count on client mount (non-blocking)
  useEffect(() => {
    api.get(`/api/blogs/${slug}`).catch(() => {});
  }, [slug]);

  return (
    <PublicLayout showNewsletter>
      <div className="post-page">
        <div className="container post-layout">

          {/* ── Main Article ── */}
          <article className="post-main">
            <nav className="breadcrumb">
              <Link href="/">Home</Link>
              <span>›</span>
              <Link href="/blog">Blog</Link>
              <span>›</span>
              <span>{blog.category}</span>
            </nav>

            <header className="post-header">
              <div className="post-meta">
                <span className="badge badge-green">{blog.category}</span>
                <span className="post-date">
                  {new Date(blog.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric', month: 'long', year: 'numeric',
                  })}
                </span>
                <span className="post-views">👁 {blog.views ?? 0} views</span>
              </div>

              <h1>{blog.title}</h1>

              {blog.excerpt && (
                <p className="post-excerpt">{blog.excerpt}</p>
              )}

              {blog.tags && blog.tags.length > 0 && (
                <div className="post-tags">
                  {blog.tags.map(tag => (
                    <span key={tag} className="post-tag">#{tag}</span>
                  ))}
                </div>
              )}
            </header>

            {blog.featuredImage && (
              <div className="post-featured-img">
                <img src={blog.featuredImage} alt={blog.title} />
              </div>
            )}

            <AdSlot slot="inArticle" style={{ margin: '20px 0' }} />

            <div
              className="post-content"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />

            <footer className="post-footer">
              <div className="post-footer__author">
                <div className="author-avatar">✍️</div>
                <div>
                  <strong>{blog.author ?? 'Tflixs'}</strong>
                  <p>Agriculture Expert at Tflixs</p>
                </div>
              </div>
              <Link href="/blog" className="btn btn-outline">← More Articles</Link>
            </footer>
          </article>

          {/* ── Sidebar ── */}
          <aside className="post-sidebar">
            <AdSlot slot="sidebar" />

            <div className="card sidebar-card" style={{ marginTop: 18 }}>
              <div className="card-body">
                <h3>🧮 Try Our Calculator</h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--stone)', margin: '8px 0 16px', lineHeight: 1.6 }}>
                  Get precise fertilizer recommendations for your crop.
                </p>
                <Link
                  href="/calculator"
                  className="btn btn-primary"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  Open Calculator
                </Link>
              </div>
            </div>

            <div
              className="card sidebar-card"
              style={{ marginTop: 14, background: 'var(--frost)', border: '1px solid var(--mint)' }}
            >
              <div className="card-body">
                <h3 style={{ marginBottom: 12 }}>🌱 Seed Calculator</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--stone)', marginBottom: 12, lineHeight: 1.6 }}>
                  Calculate exact seed quantities for any crop.
                </p>
                <Link
                  href="/seed-calculator"
                  className="btn btn-ghost btn-sm"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  Open Seed Calculator
                </Link>
              </div>
            </div>

            <div className="card sidebar-card" style={{ marginTop: 14 }}>
              <div className="card-body">
                <h3 style={{ marginBottom: 12 }}>📧 Get Farming Tips</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--stone)', marginBottom: 12, lineHeight: 1.6 }}>
                  Weekly tips on fertilizers and crop care.
                </p>
                <Link
                  href="/#newsletter"
                  className="btn btn-primary btn-sm"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  Subscribe Free
                </Link>
              </div>
            </div>
          </aside>

        </div>
      </div>
    </PublicLayout>
  );
}
