'use client';

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import api from '@/lib/api';
import './AdminLayout.css';

interface Subscriber {
  _id:       string;
  name?:     string;
  email:     string;
  active:    boolean;
  createdAt: string;
}

export default function AdminNewsletter() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [search,      setSearch]      = useState('');

  const fetchSubscribers = useCallback(() => {
    setLoading(true);
    api.get<{ subscribers: Subscriber[] }>('/api/newsletter')
      .then(res => setSubscribers(res.data.subscribers ?? []))
      .catch(() => toast.error('Failed to load subscribers'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchSubscribers(); }, [fetchSubscribers]);

  const remove = async (id: string, email: string) => {
    if (!window.confirm(`Unsubscribe ${email}?`)) return;
    try {
      await api.delete(`/api/newsletter/${id}`);
      toast.success('Unsubscribed');
      fetchSubscribers();
    } catch { toast.error('Failed'); }
  };

  const exportCSV = () => {
    const rows = [['Name', 'Email', 'Subscribed Date']];
    subscribers.forEach(s => rows.push([s.name ?? '', s.email, new Date(s.createdAt).toLocaleDateString()]));
    const csv  = rows.map(r => r.map(c => `"${c}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = 'tflixs-subscribers.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  const filtered = subscribers.filter(s =>
    s.email.toLowerCase().includes(search.toLowerCase()) ||
    (s.name ?? '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1>📧 Newsletter Subscribers</h1>
          <p>{subscribers.length} active subscriber{subscribers.length !== 1 ? 's' : ''}</p>
        </div>
        <button className="btn btn-outline" onClick={exportCSV} disabled={subscribers.length === 0}>
          ⬇️ Export CSV
        </button>
      </div>

      <div className="card">
        <div className="card-header" style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <input type="text" className="form-control" placeholder="Search by name or email…"
            value={search} onChange={e => setSearch(e.target.value)} style={{ maxWidth: 300 }} />
          <span style={{ fontSize: '0.85rem', color: 'var(--stone)' }}>
            {filtered.length} subscriber{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>

        {loading ? <div className="spinner" /> : (
          <div className="table-responsive">
            <table>
              <thead>
                <tr><th>Name</th><th>Email</th><th>Subscribed</th><th>Action</th></tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={4} style={{ textAlign: 'center', padding: 40, color: 'var(--stone)' }}>No subscribers found.</td></tr>
                ) : filtered.map(s => (
                  <tr key={s._id}>
                    <td style={{ fontWeight: 500 }}>{s.name || '—'}</td>
                    <td>{s.email}</td>
                    <td style={{ fontSize: '0.82rem', color: 'var(--stone)' }}>
                      {new Date(s.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      <button className="btn btn-danger btn-sm" onClick={() => remove(s._id, s.email)}>
                        Unsubscribe
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
