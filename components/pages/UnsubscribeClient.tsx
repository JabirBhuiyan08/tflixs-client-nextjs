'use client';
import { useState, useEffect, FormEvent } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import api from '@/lib/api';
import PublicLayout from '@/components/layout/PublicLayout';

export default function UnsubscribeClient() {
  const searchParams = useSearchParams();
  const [email,   setEmail]   = useState(searchParams.get('email') ?? '');
  const [status,  setStatus]  = useState<'idle'|'loading'|'success'|'error'>('idle');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const e = searchParams.get('email');
    if (e) handleUnsubscribe(e);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleUnsubscribe = async (target?: string) => {
    const em = target ?? email;
    if (!em) return;
    setStatus('loading');
    try {
      const res = await api.post<{ message: string }>('/api/newsletter/unsubscribe', { email: em });
      setStatus('success');
      setMessage(res.data.message);
    } catch (err: unknown) {
      setStatus('error');
      const msg = err instanceof Error ? err.message : 'Something went wrong.';
      setMessage(msg);
    }
  };

  const onSubmit = (e: FormEvent) => { e.preventDefault(); handleUnsubscribe(); };

  if (status === 'success') {
    return (
      <PublicLayout>
        <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
          <div className="card" style={{ maxWidth: 480, width: '100%' }}>
            <div className="card-body" style={{ padding: 40, textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: 16 }}>✅</div>
              <h2 style={{ marginBottom: 12 }}>Unsubscribed</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>{message}</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: 24 }}>
                You won&apos;t receive any more newsletters. You can still use all our free tools.
              </p>
              <Link href="/" className="btn btn-primary">Go to Homepage</Link>
            </div>
          </div>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
        <div className="card" style={{ maxWidth: 480, width: '100%' }}>
          <div className="card-body" style={{ padding: 40, textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: 16 }}>📧</div>
            <h2 style={{ marginBottom: 8 }}>Unsubscribe</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>
              Enter your email address to unsubscribe from the Tflixs newsletter.
            </p>

            {status === 'error' && (
              <div className="alert alert-error" style={{ marginBottom: 16 }}>{message}</div>
            )}

            <form onSubmit={onSubmit}>
              <div className="form-group" style={{ textAlign: 'left' }}>
                <label htmlFor="unsub-email">Email Address</label>
                <input
                  id="unsub-email" type="email" className="form-control"
                  placeholder="your@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  disabled={status === 'loading'}
                  required
                />
              </div>
              <button
                type="submit"
                className="btn btn-danger btn-lg"
                style={{ width: '100%', justifyContent: 'center' }}
                disabled={!email || status === 'loading'}
              >
                {status === 'loading' ? '⏳ Processing...' : 'Unsubscribe'}
              </button>
            </form>

            <p style={{ marginTop: 16, fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Changed your mind? <Link href="/">Stay subscribed →</Link>
            </p>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
