'use client';

import { useEffect, ComponentType } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import AdminLayoutWrapper from './AdminLayoutWrapper';

export default function withAdminLayout<P extends object>(
  Component: ComponentType<P>
) {
  return function ProtectedAdminPage(props: P) {
    const { isAuthenticated, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading && !isAuthenticated) {
        router.push('/admin/login');
      }
    }, [loading, isAuthenticated, router]);

    if (loading) {
      return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
          <div className="spinner" />
        </div>
      );
    }

    if (!isAuthenticated) return null;

    return (
      <AdminLayoutWrapper>
        <Component {...props} />
      </AdminLayoutWrapper>
    );
  };
}
