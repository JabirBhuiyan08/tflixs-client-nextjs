import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CROPS, getCropBySlug, getAllCropSlugs } from '@/lib/crops';
import CropCalculatorClient from '@/components/pages/CropCalculatorClient';
import type { Crop } from '@/types';

interface Props { params: Promise<{ crop: string }> }

export async function generateStaticParams() {
  return getAllCropSlugs().map(slug => ({ crop: slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { crop: slug } = await params;
  const crop = getCropBySlug(slug);
  if (!crop) return { title: 'Crop Not Found' };

  return {
    title:       `${crop.name} Fertilizer Calculator – Free NPK Tool`,
    description: crop.description,
    keywords:    crop.keywords,
    alternates:  { canonical: `https://tflixs.com/calculator/${crop.slug}` },
    openGraph: {
      title:       `${crop.name} Fertilizer Calculator`,
      description: crop.description,
      url:         `https://tflixs.com/calculator/${crop.slug}`,
      images:      [{ url: '/og-image.jpg', width: 1200, height: 630 }],
    },
  };
}

function buildSchema(crop: Crop) {
  const howTo = {
    '@context': 'https://schema.org',
    '@type':    'HowTo',
    name:       `How to Calculate ${crop.name} Fertilizer Requirements`,
    description: crop.description,
    url:         `https://tflixs.com/calculator/${crop.slug}`,
    tool:        { '@type': 'HowToTool', name: 'Tflixs Fertilizer Calculator' },
    supply: [
      { '@type': 'HowToSupply', name: 'DAP (Diammonium Phosphate)' },
      { '@type': 'HowToSupply', name: 'Urea (46% N)' },
      { '@type': 'HowToSupply', name: 'MOP (Muriate of Potash)' },
    ],
    step: [
      { '@type': 'HowToStep', name: 'Select Crop',     text: `Select ${crop.name}` },
      { '@type': 'HowToStep', name: 'Enter Land Area', text: 'Enter area in hectares, acres, or bigha' },
      { '@type': 'HowToStep', name: 'Add Soil Data',   text: 'Optionally add soil test results' },
      { '@type': 'HowToStep', name: 'Get Results',     text: 'Receive exact NPK doses and costs instantly' },
    ],
  };

  const faq = {
    '@context': 'https://schema.org',
    '@type':    'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name:    `How much fertilizer does ${crop.name} need per acre?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `${crop.name} requires approximately ${Math.round(crop.npk.n * 0.4)} kg N, ${Math.round(crop.npk.p * 0.4)} kg P₂O₅, and ${Math.round(crop.npk.k * 0.4)} kg K₂O per acre. Use the Tflixs calculator for exact amounts based on your soil.`,
        },
      },
      {
        '@type': 'Question',
        name:    `What is the best NPK ratio for ${crop.name}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Based on ${crop.source} research, ${crop.name} needs N:P:K in a ratio of ${crop.npk.n}:${crop.npk.p}:${crop.npk.k} kg/ha for optimal yield of ${crop.yield}. Season: ${crop.season}.`,
        },
      },
      {
        '@type': 'Question',
        name:    `When should I apply fertilizer for ${crop.name}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Apply 100% of P and K as basal dose at planting. Split N into 3 applications: 30% at sowing, 40% at 25–30 days, and 30% at 50–60 days for best results.`,
        },
      },
    ],
  };

  return { howTo, faq };
}

export default async function CropCalculatorPage({ params }: Props) {
  const { crop: slug } = await params;
  const crop = getCropBySlug(slug);
  if (!crop) notFound();

  const { howTo, faq } = buildSchema(crop);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howTo) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }} />
      <CropCalculatorClient crop={crop} />
    </>
  );
}
