'use client';

import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { toast } from 'react-toastify';
import api from '@/lib/api';
import './AdminLayout.css';

interface SeoData {
  siteTitle:       string;
  siteDescription: string;
  keywords:        string;
  googleAnalytics: string;
  googleSiteVerification: string;
  bingSiteVerification:   string;
  ogImage:         string;
  twitterHandle:   string;
}

const DEFAULT: SeoData = {
  siteTitle: '', siteDescription: '', keywords: '',
  googleAnalytics: '', googleSiteVerification: '', bingSiteVerification: '',
  ogImage: '', twitterHandle: '',
};

export default function AdminSEO() {
  const [form,    setForm]    = useState<SeoData>(DEFAULT);
  const [loading, setLoading] = useState(false);
  const [fetching,setFetching]= useState(true);

  useEffect(() => {
    api.get<{ seo: SeoData }>('/api/seo')
      .then(res => { if (res.data.seo) setForm(res.data.seo); })
      .catch(() => {})
      .finally(() => setFetching(false));
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/api/seo', form);
      toast.success('SEO settings saved!');
    } catch { toast.error('Failed to save'); }
    finally { setLoading(false); }
  };

  if (fetching) return <div className="spinner" />;

  const Field = ({ name, label, placeholder, type = 'text', hint }: {
    name: keyof SeoData; label: string; placeholder?: string; type?: string; hint?: string;
  }) => (
    <div className="form-group">
      <label>{label}</label>
      <input type={type} name={name} className="form-control"
        placeholder={placeholder} value={form[name]} onChange={handleChange} />
      {hint && <small style={{ color: 'var(--stone)', fontSize: '0.78rem' }}>{hint}</small>}
    </div>
  );

  return (
    <div>
      <div className="admin-page-header">
        <h1>🔍 SEO Settings</h1>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="card" style={{ marginBottom: 20 }}>
          <div className="card-header"><h3>Site Metadata</h3></div>
          <div className="card-body">
            <Field name="siteTitle"       label="Site Title"       placeholder="Tflixs – Free NPK Fertilizer Calculator" />
            <div className="form-group">
              <label>Site Description</label>
              <textarea name="siteDescription" className="form-control" rows={3}
                placeholder="Free fertilizer calculator for farmers…"
                value={form.siteDescription} onChange={handleChange} />
            </div>
            <Field name="keywords"        label="Keywords"         placeholder="fertilizer calculator, NPK, farming tool" />
            <Field name="ogImage"         label="Default OG Image" placeholder="https://tflixs.com/og-image.jpg" type="url" />
            <Field name="twitterHandle"   label="Twitter Handle"   placeholder="@tflixs" />
          </div>
        </div>

        <div className="card" style={{ marginBottom: 20 }}>
          <div className="card-header"><h3>Verification & Analytics</h3></div>
          <div className="card-body">
            <Field name="googleAnalytics"         label="Google Analytics ID"   placeholder="G-XXXXXXXXXX"
              hint="Measurement ID from Google Analytics 4" />
            <Field name="googleSiteVerification"  label="Google Site Verification" placeholder="google-site-verification content value" />
            <Field name="bingSiteVerification"    label="Bing Site Verification"   placeholder="Bing verification code" />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? '⏳ Saving…' : '💾 Save SEO Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}
