import type { Metadata } from 'next';
import { Fraunces, Plus_Jakarta_Sans } from 'next/font/google';
import Script from 'next/script';
import '@/styles/globals.css';
import Providers    from '@/components/providers/Providers';
import ToastProvider from '@/components/providers/ToastProvider';

const fraunces = Fraunces({
  subsets:  ['latin'],
  variable: '--font-display',
  style:    ['normal', 'italic'],
  weight:   ['300', '500', '700', '900'],
  display:  'swap',
});

const jakarta = Plus_Jakarta_Sans({
  subsets:  ['latin'],
  variable: '--font-body',
  weight:   ['300', '400', '500', '600', '700'],
  display:  'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://tflixs.com'),
  title: {
    default:  'Tflixs – Free NPK Fertilizer & Seed Rate Calculator for Farmers',
    template: '%s | Tflixs',
  },
  description: 'Free online fertilizer and seed rate calculator for farmers. Get accurate NPK recommendations for rice, wheat, vegetables and 15+ crops. No registration required.',
  keywords: ['fertilizer calculator', 'NPK calculator', 'seed rate calculator', 'crop nutrition', 'farming tool'],
  authors:   [{ name: 'Tflixs', url: 'https://tflixs.com' }],
  creator:   'Tflixs',
  publisher: 'Tflixs',
  robots: {
    index:     true,
    follow:    true,
    googleBot: { index: true, follow: true, 'max-snippet': -1, 'max-image-preview': 'large' },
  },
  openGraph: {
    type:        'website',
    locale:      'en_US',
    url:         'https://tflixs.com',
    siteName:    'Tflixs',
    title:       'Tflixs – Free NPK Fertilizer Calculator',
    description: 'Get accurate NPK fertilizer recommendations for any crop. Free, no login required.',
    images: [{
      url:    '/og-image.jpg',
      width:  1200,
      height: 630,
      alt:    'Tflixs Fertilizer Calculator',
    }],
  },
  twitter: {
    card:        'summary_large_image',
    title:       'Tflixs – Free NPK Fertilizer Calculator',
    description: 'Get accurate NPK fertilizer recommendations for any crop.',
    images:      ['/og-image.jpg'],
  },
  alternates: { canonical: 'https://tflixs.com' },
};

const websiteSchema = {
  '@context':  'https://schema.org',
  '@type':     'WebSite',
  name:        'Tflixs',
  url:         'https://tflixs.com',
  description: 'Free fertilizer and seed rate calculator for farmers',
  potentialAction: {
    '@type':       'SearchAction',
    target:        { '@type': 'EntryPoint', urlTemplate: 'https://tflixs.com/blog?search={search_term_string}' },
    'query-input': 'required name=search_term_string',
  },
};

const orgSchema = {
  '@context': 'https://schema.org',
  '@type':    'Organization',
  name:       'Tflixs',
  url:        'https://tflixs.com',
  logo:       'https://tflixs.com/logo192.png',
  sameAs:     ['https://tflixs.com'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${jakarta.variable}`}>
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }} />
        <link rel="icon"             href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/logo192.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest"         href="/manifest.json" />
        <meta name="theme-color"     content="#2d6a4f" />
      </head>
      <body suppressHydrationWarning>
        <Providers>
          {children}
          <ToastProvider />
        </Providers>

        {/* Google Analytics — loaded after page is interactive */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-M2ENGZ03JL"
          strategy="afterInteractive"
        />
        <Script id="ga-init" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-M2ENGZ03JL', { anonymize_ip: true });
        `}</Script>
      </body>
    </html>
  );
}
