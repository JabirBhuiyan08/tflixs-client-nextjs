'use client';

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import api from '@/lib/api';
import './AdminLayout.css';

interface Message {
  _id:       string;
  name:      string;
  email:     string;
  subject:   string;
  message:   string;
  status:    'unread' | 'read' | 'replied';
  createdAt: string;
}

type FilterType = 'all' | 'unread' | 'read' | 'replied';

export default function AdminContacts() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [selected, setSelected] = useState<Message | null>(null);
  const [filter,   setFilter]   = useState<FilterType>('all');

  const fetchMessages = useCallback(() => {
    setLoading(true);
    api.get<{ messages: Message[] }>('/api/contact')
      .then(res => setMessages(res.data.messages ?? []))
      .catch(() => toast.error('Failed to load messages'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchMessages(); }, [fetchMessages]);

  const updateStatus = async (id: string, status: Message['status']) => {
    try {
      await api.put(`/api/contact/${id}/status`, { status });
      setMessages(prev => prev.map(m => m._id === id ? { ...m, status } : m));
      setSelected(prev => prev?._id === id ? { ...prev, status } : prev);
      toast.success('Status updated');
    } catch { toast.error('Failed to update status'); }
  };

  const deleteMessage = async (id: string) => {
    if (!window.confirm('Delete this message?')) return;
    try {
      await api.delete(`/api/contact/${id}`);
      setMessages(prev => prev.filter(m => m._id !== id));
      setSelected(prev => prev?._id === id ? null : prev);
      toast.success('Message deleted');
    } catch { toast.error('Failed to delete'); }
  };

  const openMessage = async (msg: Message) => {
    setSelected(msg);
    if (msg.status === 'unread') await updateStatus(msg._id, 'read');
  };

  const filtered   = messages.filter(m => filter === 'all' || m.status === filter);
  const unreadCount = messages.filter(m => m.status === 'unread').length;

  const FILTERS: FilterType[] = ['all', 'unread', 'read', 'replied'];

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1>📬 Contact Messages</h1>
          <p>{unreadCount > 0 ? `${unreadCount} unread message${unreadCount > 1 ? 's' : ''}` : 'All messages read'}</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {FILTERS.map(f => (
          <button key={f} className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setFilter(f)}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
            {f === 'unread' && unreadCount > 0 && ` (${unreadCount})`}
          </button>
        ))}
      </div>

      <div className="grid-2" style={{ alignItems: 'start' }}>
        {/* Message List */}
        <div className="card" style={{ overflow: 'hidden' }}>
          {loading ? <div className="spinner" /> : (
            filtered.length === 0
              ? <div style={{ padding: 40, textAlign: 'center', color: 'var(--stone)' }}>No messages found.</div>
              : filtered.map(msg => (
                <div key={msg._id} onClick={() => openMessage(msg)} style={{
                  padding: '14px 18px', borderBottom: '1px solid var(--border-light)',
                  cursor: 'pointer',
                  background: selected?._id === msg._id ? 'var(--frost)' : msg.status === 'unread' ? '#fffbeb' : 'white',
                  transition: 'background 0.15s',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <strong style={{ fontSize: '0.92rem' }}>
                      {msg.status === 'unread' && <span style={{ color: 'var(--terracotta)', marginRight: 6 }}>●</span>}
                      {msg.name}
                    </strong>
                    <span style={{ fontSize: '0.75rem', color: 'var(--stone)' }}>{new Date(msg.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 4 }}>{msg.subject}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.78rem', color: 'var(--stone)' }}>
                      {msg.message.slice(0, 60)}…
                    </span>
                    <span className={`badge ${msg.status === 'unread' ? 'badge-red' : msg.status === 'read' ? 'badge-blue' : 'badge-green'}`}>
                      {msg.status}
                    </span>
                  </div>
                </div>
              ))
          )}
        </div>

        {/* Message Detail */}
        {selected ? (
          <div className="card">
            <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h3 style={{ margin: 0 }}>{selected.subject}</h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--stone)', margin: '4px 0 0' }}>
                  From: <strong>{selected.name}</strong> ({selected.email}) · {new Date(selected.createdAt).toLocaleString()}
                </p>
              </div>
              <button className="btn btn-danger btn-sm" onClick={() => deleteMessage(selected._id)}>Delete</button>
            </div>
            <div className="card-body">
              <div style={{ background: 'var(--paper)', padding: 16, borderRadius: 8, fontSize: '0.92rem', lineHeight: 1.7, marginBottom: 20, whiteSpace: 'pre-wrap', border: '1px solid var(--border-light)' }}>
                {selected.message}
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <a href={`mailto:${selected.email}?subject=Re: ${selected.subject}`} className="btn btn-primary btn-sm">
                  📧 Reply via Email
                </a>
                <button className="btn btn-outline btn-sm" onClick={() => updateStatus(selected._id, 'replied')}>✅ Mark Replied</button>
                <button className="btn btn-outline btn-sm" onClick={() => updateStatus(selected._id, 'read')}>👁 Mark Read</button>
              </div>
            </div>
          </div>
        ) : (
          <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 20px', textAlign: 'center', color: 'var(--stone)' }}>
            <div>
              <div style={{ fontSize: '3rem', marginBottom: 12 }}>📬</div>
              <p>Select a message to read it</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
