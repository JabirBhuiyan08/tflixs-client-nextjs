'use client';

import Link from 'next/link';
import { useLocale } from '@/contexts/LocaleContext';
import PublicLayout from '@/components/layout/PublicLayout';
import WeatherWidget from '@/components/layout/WeatherWidget';
import AdSlot from '@/components/layout/AdSlot';

interface Feature { icon: string; title: string; desc: string; }
interface CropItem { name: string; icon: string; slug: string; }

const FEATURES: Feature[] = [
  { icon: '🌾', title: 'Crop-Specific Recommendations', desc: 'Tailored NPK ratios for 15+ crops including rice, wheat, vegetables, and fruits.' },
  { icon: '🧪', title: 'Soil Analysis Integration',     desc: 'Input soil test results for precision-adjusted fertilizer recommendations.' },
  { icon: '📐', title: 'Multiple Area Units',            desc: 'Works with hectares, acres, bigha, katha, decimal — any land measurement.' },
  { icon: '💰', title: 'Cost Estimation',                desc: 'Get approximate fertilizer costs in your local currency at live exchange rates.' },
  { icon: '📅', title: 'Application Schedule',           desc: 'Know exactly when and how to split fertilizer for best results.' },
  { icon: '🌱', title: 'Seed Rate Calculator',           desc: 'Calculate exact seed quantities with PLS and germination adjustment.' },
];

const CROPS: CropItem[] = [
  { name: 'Rice',      icon: '🌾', slug: 'rice'      },
  { name: 'Wheat',     icon: '🌿', slug: 'wheat'     },
  { name: 'Maize',     icon: '🌽', slug: 'maize'     },
  { name: 'Tomato',    icon: '🍅', slug: 'tomato'    },
  { name: 'Potato',    icon: '🥔', slug: 'potato'    },
  { name: 'Sugarcane', icon: '🎋', slug: 'sugarcane' },
  { name: 'Cotton',    icon: '🌱', slug: 'cotton'    },
  { name: 'Banana',    icon: '🍌', slug: 'banana'    },
];

export default function HomeClient() {
  const { t } = useLocale();

  const STEPS = [
    { step: '1', title: t('selectCrop'), desc: 'Choose from 15+ crops.' },
    { step: '2', title: t('enterArea'),  desc: 'Any unit: acre, bigha, hectare.' },
    { step: '3', title: t('soilData'),   desc: 'Optional but improves accuracy.' },
    { step: '4', title: t('results'),    desc: 'Instant NPK plan + costs.' },
  ];

  return (
    <PublicLayout showNewsletter>
      {/* Hero */}
      <section className="hero">
        <div className="hero__bg-pattern" />
        <div className="container hero__content">
          <div className="hero__badge"><span>🌱</span> {t('freeForFarmers')}</div>
          <h1 className="hero__title">
            {t('heroTitle')}<br />
            <span className="hero__title-accent">{t('heroSubtitle')}</span>
          </h1>
          <p className="hero__subtitle">{t('heroDesc')}</p>
          <div className="hero__actions">
            <Link href="/calculator"      className="btn btn-primary btn-lg">{t('startCalculating')}</Link>
            <Link href="/seed-calculator" className="btn btn-outline btn-lg">🌱 Seed Calculator</Link>
          </div>
          <div className="hero__stats">
            <div className="hero__stat"><strong>15+</strong><span>Crops</span></div>
            <div className="hero__stat-divider" />
            <div className="hero__stat"><strong>10+</strong><span>Seed Types</span></div>
            <div className="hero__stat-divider" />
            <div className="hero__stat"><strong>100%</strong><span>Free</span></div>
          </div>
        </div>
      </section>

      <div className="container" style={{ padding: '16px 20px' }}>
        <AdSlot slot="header" />
      </div>

      {/* Crops strip */}
      <section className="crops-strip">
        <div className="container">
          <p className="crops-strip__label">Individual Calculators:</p>
          <div className="crops-strip__list">
            {CROPS.map(c => (
              <Link href={`/calculator/${c.slug}`} key={c.slug} className="crops-strip__item">
                <span>{c.icon}</span><span>{c.name}</span>
              </Link>
            ))}
            <Link href="/calculator" className="crops-strip__item crops-strip__more">+ More →</Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section features">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Everything You Need for Precision Farming</h2>
            <p className="section-subtitle">Our tools consider your soil, crop, area, and budget.</p>
          </div>
          <div className="grid-3 features__grid">
            {FEATURES.map(f => (
              <div key={f.title} className="feature-card card">
                <div className="card-body">
                  <div className="feature-card__icon">{f.icon}</div>
                  <h3>{f.title}</h3>
                  <p>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="section how-it-works">
        <div className="container">
          <div className="section-header center">
            <h2 className="section-title">How It Works</h2>
            <p className="section-subtitle">Get your fertilizer plan in 4 simple steps.</p>
          </div>
          <div className="steps">
            {STEPS.map((s, i) => (
              <div key={s.step} className="step">
                <div className="step__number">{s.step}</div>
                <div className="step__content"><h3>{s.title}</h3><p>{s.desc}</p></div>
                {i < STEPS.length - 1 && <div className="step__arrow">→</div>}
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 40 }}>
            <Link href="/calculator" className="btn btn-primary btn-lg">{t('startCalculating')}</Link>
          </div>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="section tools-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">More Free Farming Tools</h2>
          </div>
          <div className="tools-grid">
            {[
              { href: '/calculator',      icon: '🧮', title: 'Fertilizer Calculator', desc: 'Get precise NPK recommendations for any crop.' },
              { href: '/seed-calculator', icon: '🌱', title: 'Seed Rate Calculator',  desc: 'Calculate exact seed quantity with PLS adjustment.' },
              { href: '/calendar',        icon: '📅', title: 'Crop Calendar',          desc: 'Planting and harvesting schedules for 15+ crops.' },
              { href: '/pest-guide',      icon: '💊', title: 'Pest & Disease Guide',   desc: 'Identify and treat common crop problems.' },
            ].map(tool => (
              <Link key={tool.href} href={tool.href} className="tool-card card">
                <div className="card-body">
                  <div className="tool-card__icon">{tool.icon}</div>
                  <h3>{tool.title}</h3>
                  <p>{tool.desc}</p>
                  <span className="tool-card__link">Explore →</span>
                </div>
              </Link>
            ))}
            <div className="tool-card weather-card">
              <WeatherWidget />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-banner">
        <div className="container cta-banner__inner">
          <div className="cta-banner__text">
            <h2>Ready to Optimize Your Crop Nutrition?</h2>
            <p>Join thousands of farmers using Tflixs. No signup required.</p>
          </div>
          <Link href="/calculator" className="btn btn-amber btn-lg">{t('startCalculating')}</Link>
        </div>
      </section>
    </PublicLayout>
  );
}
