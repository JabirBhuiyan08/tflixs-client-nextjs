import type { Metadata } from 'next';
import AdminProviders from '@/components/admin/AdminProviders';
export const metadata: Metadata = {
  title: { default: 'Admin Panel | Tflixs', template: '%s | Tflixs Admin' },
  robots: { index: false, follow: false },
};
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminProviders>{children}</AdminProviders>;
}
