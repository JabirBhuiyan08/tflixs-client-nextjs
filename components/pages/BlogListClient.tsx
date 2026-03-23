'use client';

import React, { useState, useEffect, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import api from '@/lib/api';
import PublicLayout from '@/components/layout/PublicLayout';
import AdSlot from '@/components/layout/AdSlot';
import './BlogList.css';
import type { BlogPost } from '@/types';

const CATEGORIES = ['All','Crop Nutrition','Soil Health','Fertilizer Tips','Farming Guides','News','Other'];

export default function BlogListClient() {
  const router = useRouter();

  // ✅ Next.js: useSearchParams() returns the params object directly — NOT [params, setter]
  const searchParams = useSearchParams();

  const page     = parseInt(searchParams.get('page')     ?? '1');
  const category =           searchParams.get('category') ?? 'All';
  const search   =           searchParams.get('search')   ?? '';

  const [blogs,       setBlogs]       = useState<BlogPost[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [total,       setTotal]       = useState(0);
  const [pages,       setPages]       = useState(1);
  const [searchInput, setSearchInput] = useState(search);

  useEffect(() => {
    setLoading(true);
    const p = new URLSearchParams();
    p.set('page', String(page));
    p.set('limit', '9');
    if (category !== 'All') p.set('category', category);
    if (search)             p.set('search',   search);

    api.get<{ blogs: BlogPost[]; total: number; pages: number }>(`/api/blogs?${p}`)
      .then(res => {
        setBlogs(res.data.blogs  ?? []);
        setTotal(res.data.total  ?? 0);
        setPages(res.data.pages  ?? 1);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [page, category, search]);

  const setFilter = (key: string, value: string) => {
    const p = new URLSearchParams(searchParams.toString());
    p.set(key, value);
    p.set('page', '1');
    router.push(`/blog?${p.toString()}`);
  };

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    setFilter('search', searchInput);
  };

  return (
    <PublicLayout showNewsletter>
      <section className="page-hero">
        <div className="container">
          <h1>🌾 Farming Blog</h1>
          <p>Expert tips on fertilizers, soil health, and crop management</p>
        </div>
      </section>

      <div className="container" style={{ padding: '16px 20px 0' }}>
        <AdSlot slot="header" />
      </div>

      <div className="container section-sm">
        <div className="blog-controls">
          <form onSubmit={handleSearch} className="blog-search">
            <input
              type="text" className="form-control"
              placeholder="Search articles..."
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
            />
            <button type="submit" className="btn btn-primary">Search</button>
          </form>
          <div className="blog-categories">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                className={`cat-btn ${category === cat ? 'active' : ''}`}
                onClick={() => setFilter('category', cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="spinner" />
        ) : blogs.length === 0 ? (
          <div className="no-blogs">
            <p style={{ fontSize: '1.1rem', color: 'var(--stone)', marginBottom: 16 }}>
              📝 No articles found.
            </p>
            <Link href="/blog" className="btn btn-outline">Clear Filters</Link>
          </div>
        ) : (
          <>
            <p className="blog-count">{total} article{total !== 1 ? 's' : ''} found</p>
            <div className="blog-grid">
              {blogs.filter(blog => blog.slug).map((blog, i) => (
                <React.Fragment key={blog._id}>
                  <article className="blog-card card">
                    {blog.featuredImage
                      ? <div className="blog-card__img"><img src={blog.featuredImage} alt={blog.title} loading="lazy" /></div>
                      : <div className="blog-card__img-placeholder">🌱</div>
                    }
                    <div className="blog-card__body card-body">
                      <div className="blog-card__meta">
                        <span className="badge badge-green">{blog.category}</span>
                        <span className="blog-card__date">
                          {new Date(blog.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                      <h2 className="blog-card__title">
                        <Link href={`/blog/${blog.slug}`}>{blog.title}</Link>
                      </h2>
                      <p className="blog-card__excerpt">{blog.excerpt}</p>
                      <div className="blog-card__footer">
                        <Link href={`/blog/${blog.slug}`} className="btn btn-outline btn-sm">Read More →</Link>
                        <span className="blog-card__views">👁 {blog.views ?? 0}</span>
                      </div>
                    </div>
                  </article>
                  {i === 2 && <div key="ad" className="blog-grid__ad"><AdSlot slot="inArticle" /></div>}
                </React.Fragment>
              ))}
            </div>
            {pages > 1 && (
              <div className="pagination">
                <button onClick={() => setFilter('page', String(page - 1))} disabled={page === 1}>‹</button>
                {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
                  <button key={p} className={p === page ? 'active' : ''} onClick={() => setFilter('page', String(p))}>{p}</button>
                ))}
                <button onClick={() => setFilter('page', String(page + 1))} disabled={page === pages}>›</button>
              </div>
            )}
          </>
        )}
      </div>
    </PublicLayout>
  );
}
