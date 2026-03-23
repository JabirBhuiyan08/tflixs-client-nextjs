'use client';

import { useState, useEffect, ChangeEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import api from '@/lib/api';
import './AdminBlogEditor.css';

const CATEGORIES = ['Crop Nutrition','Soil Health','Fertilizer Tips','Farming Guides','News','Other'];
const TABS       = ['content','seo','settings'] as const;
type Tab = typeof TABS[number];

interface BlogForm {
  title:           string;
  slug:            string;
  excerpt:         string;
  content:         string;
  category:        string;
  tags:            string;
  featuredImage:   string;
  published:       boolean;
  metaTitle:       string;
  metaDescription: string;
  metaKeywords:    string;
  canonicalUrl:    string;
  ogImage:         string;
}

const DEFAULT_FORM: BlogForm = {
  title: '', slug: '', excerpt: '', content: '', category: 'Farming Guides',
  tags: '', featuredImage: '', published: false,
  metaTitle: '', metaDescription: '', metaKeywords: '', canonicalUrl: '', ogImage: '',
};

interface Props { editId?: string; }

export default function AdminBlogEditor({ editId }: Props) {
  const router  = useRouter();
  const isEdit  = Boolean(editId);

  const [form,      setForm]      = useState<BlogForm>(DEFAULT_FORM);
  const [loading,   setLoading]   = useState(false);
  const [fetching,  setFetching]  = useState(isEdit);
  const [activeTab, setActiveTab] = useState<Tab>('content');

  useEffect(() => {
    if (!isEdit || !editId) return;
    api.get<{ blogs: Array<{ _id: string; slug: string }> }>('/api/blogs/admin')
      .then(res => {
        const found = res.data.blogs.find(b => b._id === editId);
        if (!found) { setFetching(false); return; }
        return api.get<{ blog: BlogForm & { tags?: string[]; _id: string } }>(`/api/blogs/${found.slug}`)
          .then(r => {
            const b = r.data.blog;
            setForm({
              title:           b.title           ?? '',
              slug:            b.slug            ?? '',
              excerpt:         b.excerpt         ?? '',
              content:         b.content         ?? '',
              category:        b.category        ?? 'Farming Guides',
              tags:            b.tags?.join(', ') ?? '',
              featuredImage:   b.featuredImage   ?? '',
              published:       b.published       ?? false,
              metaTitle:       b.metaTitle        ?? '',
              metaDescription: b.metaDescription  ?? '',
              metaKeywords:    b.metaKeywords     ?? '',
              canonicalUrl:    b.canonicalUrl     ?? '',
              ogImage:         b.ogImage         ?? '',
            });
          });
      })
      .catch(() => toast.error('Failed to load blog'))
      .finally(() => setFetching(false));
  }, [editId, isEdit]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type } = target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? target.checked : value }));
  };

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    const slug  = title.toLowerCase().replace(/[^a-z0-9 -]/g,'').replace(/\s+/g,'-').replace(/-+/g,'-');
    setForm(prev => ({ ...prev, title, slug: !isEdit || prev.slug === '' ? slug : prev.slug }));
  };

  const handleSubmit = async (publishOverride?: boolean) => {
    if (!form.title.trim() || !form.excerpt.trim() || !form.content.trim()) {
      toast.error('Title, excerpt, and content are required.'); return;
    }
    setLoading(true);
    const payload = {
      ...form,
      tags:      form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      published: publishOverride !== undefined ? publishOverride : form.published,
    };
    try {
      if (isEdit) {
        await api.put(`/api/blogs/${editId}`, payload);
        toast.success('Post updated!');
      } else {
        await api.post('/api/blogs', payload);
        toast.success('Post created!');
      }
      router.push('/admin/blogs');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save post';
      toast.error(msg);
    } finally { setLoading(false); }
  };

  if (fetching) return <div className="spinner" />;

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1>{isEdit ? '✏️ Edit Post' : '✍️ New Blog Post'}</h1>
          <p>{isEdit ? `Editing: ${form.title || 'Untitled'}` : 'Create a new farming article'}</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Link href="/admin/blogs" className="btn btn-outline btn-sm">← Cancel</Link>
          <button className="btn btn-outline btn-sm" onClick={() => handleSubmit(false)} disabled={loading}>Save Draft</button>
          <button className="btn btn-primary btn-sm" onClick={() => handleSubmit(true)}  disabled={loading}>
            {loading ? '⏳ Saving…' : '🚀 Publish'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="editor-tabs">
        {TABS.map(tab => (
          <button key={tab} className={`editor-tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}>
            {tab === 'content' ? '📝 Content' : tab === 'seo' ? '🔍 SEO' : '⚙️ Settings'}
          </button>
        ))}
      </div>

      {/* Content Tab */}
      {activeTab === 'content' && (
        <div className="card">
          <div className="card-body">
            <div className="form-group">
              <label>Post Title *</label>
              <input type="text" name="title" className="form-control" placeholder="Enter a compelling title…"
                value={form.title} onChange={handleTitleChange} />
            </div>
            <div className="form-group">
              <label>URL Slug *</label>
              <input type="text" name="slug" className="form-control" placeholder="url-friendly-slug"
                value={form.slug} onChange={handleChange} />
              <small style={{ color: 'var(--stone)', fontSize: '0.78rem' }}>
                URL: tflixs.com/blog/{form.slug || 'your-slug'}
              </small>
            </div>
            <div className="form-group">
              <label>Excerpt *</label>
              <textarea name="excerpt" className="form-control" rows={3}
                placeholder="Brief summary shown in blog list and search results…"
                value={form.excerpt} onChange={handleChange} style={{ minHeight: 80 }} />
            </div>
            <div className="form-group">
              <label>Category</label>
              <select name="category" className="form-control" value={form.category} onChange={handleChange}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Tags <span style={{ fontWeight: 400, textTransform: 'none' }}>(comma-separated)</span></label>
              <input type="text" name="tags" className="form-control" placeholder="rice, fertilizer, NPK, BRRI"
                value={form.tags} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Featured Image URL</label>
              <input type="url" name="featuredImage" className="form-control" placeholder="https://example.com/image.jpg"
                value={form.featuredImage} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Content * <span style={{ fontWeight: 400, textTransform: 'none' }}>(HTML supported)</span></label>
              <textarea name="content" className="form-control" rows={20}
                placeholder="Write your article content here. HTML tags like <h2>, <p>, <ul>, <strong> are supported."
                value={form.content} onChange={handleChange} style={{ minHeight: 400, fontFamily: 'monospace', fontSize: '0.88rem' }} />
            </div>
          </div>
        </div>
      )}

      {/* SEO Tab */}
      {activeTab === 'seo' && (
        <div className="card">
          <div className="card-body">
            <div className="alert alert-info" style={{ marginBottom: 20 }}>
              💡 Leave blank to auto-use post title and excerpt for SEO.
            </div>
            <div className="form-group">
              <label>Meta Title</label>
              <input type="text" name="metaTitle" className="form-control" placeholder="SEO title (50–60 chars ideal)"
                value={form.metaTitle} onChange={handleChange} />
              <small style={{ color: form.metaTitle.length > 60 ? 'red' : 'var(--stone)', fontSize: '0.78rem' }}>
                {form.metaTitle.length}/60
              </small>
            </div>
            <div className="form-group">
              <label>Meta Description</label>
              <textarea name="metaDescription" className="form-control" rows={3}
                placeholder="SEO description (150–160 chars ideal)"
                value={form.metaDescription} onChange={handleChange} style={{ minHeight: 80 }} />
              <small style={{ color: form.metaDescription.length > 160 ? 'red' : 'var(--stone)', fontSize: '0.78rem' }}>
                {form.metaDescription.length}/160
              </small>
            </div>
            <div className="form-group">
              <label>Meta Keywords</label>
              <input type="text" name="metaKeywords" className="form-control" placeholder="keyword1, keyword2, keyword3"
                value={form.metaKeywords} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Canonical URL</label>
              <input type="url" name="canonicalUrl" className="form-control" placeholder="https://tflixs.com/blog/your-slug"
                value={form.canonicalUrl} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>OG Image URL</label>
              <input type="url" name="ogImage" className="form-control" placeholder="https://example.com/og-image.jpg"
                value={form.ogImage} onChange={handleChange} />
            </div>
          </div>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="card">
          <div className="card-body">
            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', textTransform: 'none', fontSize: '0.95rem' }}>
                <input type="checkbox" name="published" checked={form.published}
                  onChange={handleChange} style={{ width: 18, height: 18, accentColor: 'var(--forest-mid)' }} />
                <span><strong>Published</strong> — visible to public if checked</span>
              </label>
            </div>
            <div style={{ marginTop: 24 }}>
              <h4 style={{ marginBottom: 12 }}>Preview</h4>
              <div style={{ background: 'var(--paper)', border: '1px solid var(--border)', borderRadius: 10, padding: 20 }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--stone)', marginBottom: 4 }}>tflixs.com/blog/{form.slug || 'your-slug'}</div>
                <div style={{ color: 'var(--forest)', fontSize: '1.1rem', fontWeight: 600, marginBottom: 4 }}>
                  {form.metaTitle || form.title || 'Your Post Title'}
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--stone)' }}>
                  {form.metaDescription || form.excerpt || 'Your post description will appear here.'}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: 10, marginTop: 20, justifyContent: 'flex-end' }}>
        <Link href="/admin/blogs" className="btn btn-outline">Cancel</Link>
        <button className="btn btn-outline" onClick={() => handleSubmit(false)} disabled={loading}>Save Draft</button>
        <button className="btn btn-primary" onClick={() => handleSubmit(true)} disabled={loading}>
          {loading ? '⏳ Saving…' : '🚀 Publish'}
        </button>
      </div>
    </div>
  );
}
