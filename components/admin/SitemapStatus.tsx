"use client";
import React, { useState, useEffect } from 'react';
import api from '@/lib/api';

// Define the expected shape of the API response
interface SitemapData {
  total: number;
  urls: Array<{ loc: string; lastmod?: string; changefreq?: string; priority?: string }>;
  updatedAt: string; // ISO date string
}

/**
 * Displays current sitemap status in the Admin Dashboard.
 * Shows how many URLs are indexed, last updated time, and a
 * direct link to submit to Google Search Console.
 */
const SitemapStatus = () => {
  const [data, setData] = useState<SitemapData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/sitemap/urls')
      .then(res => setData(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const siteUrl    = process.env.NEXT_PUBLIC_API_URL ?? 'https://tflixs.com';
  const SITE       = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://tflixs.com';
  const sitemapUrl = `${siteUrl}/sitemap.xml`;
  const gscUrl     = `https://search.google.com/search-console/sitemaps?resource_id=${encodeURIComponent(
    SITE
  )}`;

  // Safe access to data properties
  const totalUrls = data?.total ?? 0;
  const blogUrlsCount = data?.urls?.filter(u => u.loc.includes('/blog/')).length ?? 0;
  const lastUpdated = data?.updatedAt ? new Date(data.updatedAt).toLocaleString() : 'Just now';

  return (
    <div className="card" style={{ marginTop: 24 }}>
      <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3>🗺️ Sitemap & Search Console</h3>
        <a href={gscUrl} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm">
          Open Google Search Console →
        </a>
      </div>
      <div className="card-body">
        {loading ? (
          <div className="spinner" style={{ width: 24, height: 24, margin: 0 }} />
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 20 }}>
            <div style={{ textAlign: 'center', padding: '16px', background: 'var(--green-faint)', borderRadius: 10 }}>
              <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--green-primary)' }}>
                {totalUrls}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 4 }}>Total URLs</div>
            </div>
            <div style={{ textAlign: 'center', padding: '16px', background: '#eff6ff', borderRadius: 10 }}>
              <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#2563eb' }}>
                {blogUrlsCount}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 4 }}>Blog Posts</div>
            </div>
            <div style={{ textAlign: 'center', padding: '16px', background: '#fef3cd', borderRadius: 10 }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#92400e' }}>
                {lastUpdated}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 4 }}>Last Updated</div>
            </div>
          </div>
        )}

        <div style={{ background: 'var(--border-light)', borderRadius: 8, padding: '12px 16px', marginBottom: 16 }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 4, fontWeight: 600 }}>
            SITEMAP URL (submit to Google Search Console):
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <code style={{ fontSize: '0.85rem', color: 'var(--green-primary)', flex: 1 }}>
              {SITE}/sitemap.xml
            </code>
            <button
              className="btn btn-outline btn-sm"
              onClick={() => navigator.clipboard.writeText(`${SITE}/sitemap.xml`)}
            >
              Copy
            </button>
          </div>
        </div>

        <div className="alert alert-info" style={{ fontSize: '0.82rem' }}>
          💡 <strong>Auto-sync:</strong> Every time a blog post is published, it is automatically added to the sitemap.
          The sitemap refreshes every 6 hours. To force a refresh, visit{' '}
          <a href={sitemapUrl} target="_blank" rel="noreferrer">{sitemapUrl}</a>.
        </div>

        <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: 12 }}>
          <strong>How to submit to Google Search Console:</strong>
          <ol style={{ marginLeft: 20, marginTop: 6, lineHeight: 2 }}>
            <li>Go to <a href="https://search.google.com/search-console" target="_blank" rel="noreferrer">search.google.com/search-console</a></li>
            <li>Select your property <code>tflixs.com</code></li>
            <li>Click <strong>Sitemaps</strong> in the left menu</li>
            <li>Paste: <code>https://tflixs.com/sitemap.xml</code> → Submit</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default SitemapStatus;