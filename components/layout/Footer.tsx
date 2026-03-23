'use client';

import Link from 'next/link';
import { useLocale } from '@/contexts/LocaleContext';
import styles from './Footer.module.css';

export default function Footer() {
  const year = new Date().getFullYear();
  const { t } = useLocale();

  return (
    <footer className={styles.footer}>
      <div className={styles.top}>
        <div className={`container ${styles.grid}`}>
          <div className={styles.brand}>
            <Link href="/" className={styles.logo}>
              <span>🌿</span><span>Tflixs</span>
            </Link>
            <p>{t('footerTagline')}</p>
            <div className={styles.badges}>
              <span className="badge badge-green">Free to Use</span>
              <span className="badge badge-amber">No Login Required</span>
            </div>
          </div>

          <div className={styles.col}>
            <h4>Tools</h4>
            <ul>
              <li><Link href="/calculator">NPK Calculator</Link></li>
              <li><Link href="/seed-calculator">Seed Rate Calculator</Link></li>
              <li><Link href="/calendar">Crop Calendar</Link></li>
              <li><Link href="/pest-guide">Pest &amp; Disease Guide</Link></li>
            </ul>
          </div>

          <div className={styles.col}>
            <h4>Resources</h4>
            <ul>
              <li><Link href="/blog">Farming Blog</Link></li>
              <li><Link href="/blog?category=Soil+Health">Soil Health</Link></li>
              <li><Link href="/blog?category=Crop+Nutrition">Crop Nutrition</Link></li>
              <li><Link href="/blog?category=Fertilizer+Tips">Fertilizer Tips</Link></li>
            </ul>
          </div>

          <div className={styles.col}>
            <h4>Company</h4>
            <ul>
              <li><Link href="/about">About Us</Link></li>
              <li><Link href="/contact">Contact Us</Link></li>
              <li><Link href="/terms">Terms &amp; Conditions</Link></li>
              <li><Link href="/privacy">Privacy Policy</Link></li>
              <li><a href="/sitemap.xml">Sitemap</a></li>
            </ul>
          </div>
        </div>
      </div>

      <div className={styles.bottom}>
        <div className={`container ${styles.bottomInner}`}>
          <p>{t('copyright', { year })}</p>
          <p className={styles.disclaimer}>
            Calculator results are for guidance only. Consult an agronomist for professional advice.
          </p>
        </div>
      </div>
    </footer>
  );
}
