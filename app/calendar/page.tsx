import type { Metadata } from 'next';
import CropCalendarClient from '@/components/pages/CropCalendarClient';
export const metadata: Metadata = {
  title: 'Crop Calendar – Planting & Harvesting Schedule',
  description: 'Free crop calendar showing best planting and harvesting months for 15+ crops.',
  alternates: { canonical: 'https://tflixs.com/calendar' },
};
export default function CropCalendarPage() { return <CropCalendarClient />; }
