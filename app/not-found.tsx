import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = { title: '404 – Page Not Found | Tflixs' };

export default function NotFound() {
  return (
    <div style={{ textAlign: 'center', padding: '120px 20px', minHeight: '70vh' }}>
      <div style={{ fontSize: '5rem', marginBottom: 16 }}>🌱</div>
      <h1 style={{ fontSize: '3rem', marginBottom: 8 }}>404</h1>
      <h2 style={{ fontSize: '1.4rem', marginBottom: 16, color: 'var(--text-secondary)' }}>Page Not Found</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: 32, maxWidth: 400, margin: '0 auto 32px' }}>
        The page you are looking for does not exist.
      </p>
      <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link href="/" className="btn btn-primary">Go Home</Link>
        <Link href="/calculator" className="btn btn-outline">Try Calculator</Link>
      </div>
    </div>
  );
}
