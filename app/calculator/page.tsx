import type { Metadata } from 'next';
import CalculatorClient from '@/components/pages/CalculatorClient';
import { CROPS } from '@/lib/crops';

export const metadata: Metadata = {
  title:       'Free Fertilizer Calculator – NPK for Any Crop',
  description: 'Calculate exact NPK fertilizer doses for rice, wheat, maize, tomato, potato and 15+ crops. Free tool based on FAO and ICAR research.',
  keywords:    ['fertilizer calculator', 'NPK calculator', 'crop fertilizer', 'soil nutrient calculator'],
  alternates:  { canonical: 'https://tflixs.com/calculator' },
  openGraph: {
    title:       'Free NPK Fertilizer Calculator',
    description: 'Calculate exact fertilizer doses for any crop. Free, science-based, no login needed.',
    url:         'https://tflixs.com/calculator',
  },
};

const calculatorSchema = {
  '@context':           'https://schema.org',
  '@type':              'WebApplication',
  name:                 'Tflixs NPK Fertilizer Calculator',
  url:                  'https://tflixs.com/calculator',
  description:          'Free online fertilizer calculator providing accurate NPK recommendations for 15+ crops',
  applicationCategory:  'UtilitiesApplication',
  operatingSystem:      'Web',
  offers:               { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  featureList:          CROPS.map(c => `${c.name} fertilizer calculator`).join(', '),
};

export default function CalculatorPage() {
  return (
    <>
      <script type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(calculatorSchema) }}
      />
      <CalculatorClient />
    </>
  );
}
