'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import SitemapStatus from './SitemapStatus';
import './AdminLayout.css';

interface Stats    { blogs: number; published: number; messages: number; unread: number; }
interface BlogItem { _id: string; title: string; slug: string; published: boolean; createdAt: string; }
interface MsgItem  { _id: string; name: string; subject: string; status: string; }

export default function AdminDashboard() {
  const [stats,          setStats]          = useState<Stats>({ blogs: 0, messages: 0, unread: 0, published: 0 });
  const [recentBlogs,    setRecentBlogs]    = useState<BlogItem[]>([]);
  const [recentMessages, setRecentMessages] = useState<MsgItem[]>([]);
  const [loading,        setLoading]        = useState(true);

  useEffect(() => {
    Promise.all([
      api.get<{ blogs: BlogItem[] }>('/api/blogs/admin'),
      api.get<{ messages: MsgItem[] }>('/api/contact'),
    ]).then(([blogsRes, contactsRes]) => {
      const blogs    = blogsRes.data.blogs       ?? [];
      const messages = contactsRes.data.messages ?? [];
      setStats({
        blogs:     blogs.length,
        published: blogs.filter(b => b.published).length,
        messages:  messages.length,
        unread:    messages.filter(m => m.status === 'unread').length,
      });
      setRecentBlogs(blogs.slice(0, 5));
      setRecentMessages(messages.slice(0, 5));
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const statItems = [
    { icon: '📝', label: 'Total Posts', value: stats.blogs,     color: '#dbeafe', link: '/admin/blogs'    },
    { icon: '✅', label: 'Published',   value: stats.published, color: '#d1fae5', link: '/admin/blogs'    },
    { icon: '📬', label: 'Messages',   value: stats.messages,  color: '#fef3cd', link: '/admin/contacts' },
    { icon: '🔔', label: 'Unread',     value: stats.unread,    color: '#fee2e2', link: '/admin/contacts' },
  ];

  if (loading) return <div className="spinner" />;

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1>Dashboard</h1>
          <p>Welcome back! Here&apos;s what&apos;s happening on your site.</p>
        </div>
        <Link href="/admin/blogs/new" className="btn btn-primary">+ New Blog Post</Link>
      </div>

      <div className="stat-cards">
        {statItems.map(s => (
          <Link href={s.link} key={s.label} className="stat-card" style={{ textDecoration: 'none' }}>
            <div className="stat-card__icon" style={{ background: s.color }}>{s.icon}</div>
            <div>
              <div className="stat-card__value">{s.value}</div>
              <div className="stat-card__label">{s.label}</div>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid-2" style={{ alignItems: 'start', marginBottom: 24 }}>
        <div className="card">
          <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0 }}>Recent Blog Posts</h3>
            <Link href="/admin/blogs" className="btn btn-outline btn-sm">View All</Link>
          </div>
          <div className="table-responsive">
            <table>
              <thead><tr><th>Title</th><th>Status</th><th>Date</th></tr></thead>
              <tbody>
                {recentBlogs.length === 0
                  ? <tr><td colSpan={3} style={{ textAlign: 'center', color: 'var(--stone)' }}>No posts yet</td></tr>
                  : recentBlogs.map(b => (
                    <tr key={b._id}>
                      <td>
                        <Link href={`/admin/blogs/edit?id=${b._id}`} style={{ color: 'var(--forest-mid)', fontWeight: 500 }}>
                          {b.title.length > 40 ? b.title.slice(0, 40) + '…' : b.title}
                        </Link>
                      </td>
                      <td><span className={`badge ${b.published ? 'badge-green' : 'badge-amber'}`}>{b.published ? 'Published' : 'Draft'}</span></td>
                      <td style={{ fontSize: '0.82rem', color: 'var(--stone)' }}>{new Date(b.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0 }}>Recent Messages</h3>
            <Link href="/admin/contacts" className="btn btn-outline btn-sm">View All</Link>
          </div>
          <div className="table-responsive">
            <table>
              <thead><tr><th>Name</th><th>Subject</th><th>Status</th></tr></thead>
              <tbody>
                {recentMessages.length === 0
                  ? <tr><td colSpan={3} style={{ textAlign: 'center', color: 'var(--stone)' }}>No messages yet</td></tr>
                  : recentMessages.map(m => (
                    <tr key={m._id}>
                      <td style={{ fontWeight: 500 }}>{m.name}</td>
                      <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{m.subject}</td>
                      <td>
                        <span className={`badge ${m.status === 'unread' ? 'badge-red' : m.status === 'read' ? 'badge-blue' : 'badge-green'}`}>
                          {m.status}
                        </span>
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <SitemapStatus />

      <div className="card" style={{ marginTop: 24 }}>
        <div className="card-header"><h3>Quick Actions</h3></div>
        <div className="card-body">
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link href="/admin/blogs/new"  className="btn btn-primary">✍️ Write New Post</Link>
            <Link href="/admin/seo"        className="btn btn-outline">🔍 Update SEO</Link>
            <Link href="/admin/adsense"    className="btn btn-outline">💰 AdSense Settings</Link>
            <Link href="/admin/contacts"   className="btn btn-outline">📬 Check Messages</Link>
            <a href="/" target="_blank" rel="noreferrer" className="btn btn-outline">🌐 View Site</a>
          </div>
        </div>
      </div>
    </div>
  );
}
