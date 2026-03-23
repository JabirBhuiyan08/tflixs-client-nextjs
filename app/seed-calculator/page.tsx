import type { Metadata } from 'next';
import SeedCalculatorClient from '@/components/pages/SeedCalculatorClient';

export const metadata: Metadata = {
  title: 'Seed Rate Calculator – How Much Seed Do You Need?',
  description: 'Free seed rate calculator. Calculate exact seed quantity for rice, wheat, maize with germination rate and PLS adjustment.',
  keywords: ['seed rate calculator', 'seeds per acre', 'PLS calculator', 'seeding rate'],
  alternates: { canonical: 'https://tflixs.com/seed-calculator' },
};
export default function SeedCalculatorPage() { return <SeedCalculatorClient />; }
