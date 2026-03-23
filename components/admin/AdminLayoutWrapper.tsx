'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import './AdminLayout.css';

interface NavItem { path: string; icon: string; label: string; }

const NAV: NavItem[] = [
  { path: '/admin',            icon: '📊', label: 'Dashboard'  },
  { path: '/admin/blogs',      icon: '📝', label: 'Blog Posts' },
  { path: '/admin/contacts',   icon: '📬', label: 'Messages'   },
  { path: '/admin/newsletter', icon: '📧', label: 'Newsletter' },
  { path: '/admin/seo',        icon: '🔍', label: 'SEO'        },
  { path: '/admin/adsense',    icon: '💰', label: 'AdSense'    },
  { path: '/admin/settings',   icon: '⚙️', label: 'Settings'   },
];

export default function AdminLayoutWrapper({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router   = useRouter();
  const { admin, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.push('/admin/login');
  };

  const isActive = (path: string) =>
    path === '/admin' ? pathname === '/admin' : pathname.startsWith(path);

  return (
    <div className="admin-layout">
      {sidebarOpen && (
        <div className="admin-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="admin-sidebar__header">
          <Link href="/" className="admin-sidebar__logo">
            <span>🌿</span><span>Tflixs</span>
          </Link>
          <span className="admin-sidebar__badge">Admin</span>
        </div>

        <nav className="admin-sidebar__nav" aria-label="Admin navigation">
          {NAV.map(item => (
            <Link
              key={item.path}
              href={item.path}
              className={`admin-nav-item ${isActive(item.path) ? 'active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <span className="admin-nav-item__icon">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="admin-sidebar__footer">
          <div className="admin-user">
            <div className="admin-user__avatar">
              {admin?.name?.[0]?.toUpperCase() ?? 'A'}
            </div>
            <div className="admin-user__info">
              <strong>{admin?.name ?? 'Admin'}</strong>
              <span>{admin?.email}</span>
            </div>
          </div>
          <button className="admin-logout-btn" onClick={handleLogout}>
            🚪 Logout
          </button>
        </div>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <button
            className="admin-burger"
            onClick={() => setSidebarOpen(v => !v)}
            aria-label="Toggle sidebar"
          >
            ☰
          </button>
          <div className="admin-topbar__right">
            <Link href="/" target="_blank" className="btn btn-outline btn-sm">
              🌐 View Site
            </Link>
          </div>
        </header>
        <div className="admin-content">{children}</div>
      </div>
    </div>
  );
}
