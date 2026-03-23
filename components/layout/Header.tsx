'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocale } from '@/contexts/LocaleContext';
import LanguageSwitcher from './LanguageSwitcher';
import styles from './Header.module.css';

const NAV_ITEMS = [
  { href: '/',               labelKey: 'home' },
  { href: '/calculator',     labelKey: 'calculator' },
  { href: '/seed-calculator', label: 'Seed Calc' },
  { href: '/calendar',       label: 'Calendar' },
  { href: '/pest-guide',     label: 'Pest Guide' },
  { href: '/blog',           labelKey: 'blog' },
  { href: '/contact',        labelKey: 'contact' },
] as const;

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const { t } = useLocale();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [pathname]);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      <div className={`container ${styles.inner}`}>
        <Link href="/" className={styles.logo}>
          <span className={styles.logoIcon}>🌿</span>
          <span>
            <span className={styles.logoMain}>T</span>
            <span className={styles.logoAccent}>flixs</span>
          </span>
        </Link>

        <nav className={`${styles.nav} ${menuOpen ? styles.navOpen : ''}`} aria-label="Main navigation">
          {NAV_ITEMS.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={isActive(item.href) ? styles.active : ''}
            >
              {'labelKey' in item ? t(item.labelKey) : item.label}
            </Link>
          ))}
          <Link href="/calculator" className={`btn btn-primary btn-sm ${styles.cta}`}>
            {t('tryCalculator')}
          </Link>
        </nav>

        <div className={styles.right}>
          <LanguageSwitcher />
          <button
            className={`${styles.burger} ${menuOpen ? styles.burgerOpen : ''}`}
            onClick={() => setMenuOpen(v => !v)}
            aria-label="Toggle navigation"
            aria-expanded={menuOpen}
          >
            <span /><span /><span />
          </button>
        </div>
      </div>
    </header>
  );
}
