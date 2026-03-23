'use client';

import { useState, useRef, useEffect } from 'react';
import { useLocale, LOCALE_MAP } from '@/contexts/LocaleContext';
import styles from './LanguageSwitcher.module.css';

interface Option { code: string; flag: string; label: string; currency: string; }

const OPTIONS: Option[] = [
  { code: 'US', flag: '🇺🇸', label: 'English (US)',  currency: 'USD' },
  { code: 'GB', flag: '🇬🇧', label: 'English (UK)',  currency: 'GBP' },
  { code: 'BD', flag: '🇧🇩', label: 'বাংলা',          currency: 'BDT' },
  { code: 'IN', flag: '🇮🇳', label: 'हिंदी',          currency: 'INR' },
  { code: 'PK', flag: '🇵🇰', label: 'اردو',           currency: 'PKR' },
  { code: 'ID', flag: '🇮🇩', label: 'Indonesia',      currency: 'IDR' },
  { code: 'PH', flag: '🇵🇭', label: 'Filipino',       currency: 'PHP' },
  { code: 'VN', flag: '🇻🇳', label: 'Tiếng Việt',     currency: 'VND' },
  { code: 'TH', flag: '🇹🇭', label: 'ภาษาไทย',        currency: 'THB' },
  { code: 'MY', flag: '🇲🇾', label: 'Melayu',         currency: 'MYR' },
  { code: 'CN', flag: '🇨🇳', label: '中文',            currency: 'CNY' },
  { code: 'JP', flag: '🇯🇵', label: '日本語',           currency: 'JPY' },
  { code: 'KR', flag: '🇰🇷', label: '한국어',           currency: 'KRW' },
  { code: 'NG', flag: '🇳🇬', label: 'English (NG)',   currency: 'NGN' },
  { code: 'KE', flag: '🇰🇪', label: 'English (KE)',   currency: 'KES' },
  { code: 'EG', flag: '🇪🇬', label: 'العربية',         currency: 'EGP' },
  { code: 'BR', flag: '🇧🇷', label: 'Português',      currency: 'BRL' },
  { code: 'MX', flag: '🇲🇽', label: 'Español',        currency: 'MXN' },
  { code: 'DE', flag: '🇩🇪', label: 'Deutsch',        currency: 'EUR' },
  { code: 'FR', flag: '🇫🇷', label: 'Français',       currency: 'EUR' },
  { code: 'AU', flag: '🇦🇺', label: 'English (AU)',   currency: 'AUD' },
];

const FLAG_MAP = Object.fromEntries(OPTIONS.map(o => [o.code, o.flag]));

export default function LanguageSwitcher() {
  const { locale, setManualLocale, resetLocale } = useLocale();
  const [open,   setOpen]   = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false); setSearch('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filtered = OPTIONS.filter(o =>
    o.label.toLowerCase().includes(search.toLowerCase()) ||
    o.currency.toLowerCase().includes(search.toLowerCase())
  );

  const flag = FLAG_MAP[locale.country] ?? '🌐';

  return (
    <div className={styles.wrap} ref={ref}>
      <button
        className={styles.btn}
        onClick={() => setOpen(v => !v)}
        aria-label="Change language and currency"
        aria-expanded={open}
      >
        <span>{flag}</span>
        <span className={styles.code}>{locale.currency}</span>
        <span className={styles.arrow}>{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className={styles.dropdown} role="listbox">
          <div className={styles.header}>🌍 Language &amp; Currency</div>
          <div className={styles.searchWrap}>
            <input
              autoFocus
              type="text"
              placeholder="Search..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className={styles.search}
              aria-label="Search languages"
            />
          </div>
          <div className={styles.current}>
            ✓ {flag} {locale.languageName} · {locale.currency}
          </div>
          <div className={styles.list}>
            {filtered.map(opt => (
              <button
                key={opt.code}
                role="option"
                aria-selected={locale.country === opt.code}
                className={`${styles.item} ${locale.country === opt.code ? styles.active : ''}`}
                onClick={() => { setManualLocale(opt.code); setOpen(false); setSearch(''); }}
              >
                <span>{opt.flag}</span>
                <span className={styles.itemLabel}>{opt.label}</span>
                <span className={styles.itemCurrency}>{opt.currency}</span>
                {locale.country === opt.code && <span className={styles.check}>✓</span>}
              </button>
            ))}
            {filtered.length === 0 && (
              <div className={styles.noResults}>No results</div>
            )}
          </div>
          <button className={styles.auto} onClick={() => { resetLocale(); setOpen(false); }}>
            🔄 Auto-detect my location
          </button>
        </div>
      )}
    </div>
  );
}
