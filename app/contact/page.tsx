import type { Metadata } from 'next';
import ContactClient from '@/components/pages/ContactClient';
export const metadata: Metadata = {
  title: 'Contact Us – Tflixs',
  description: 'Get in touch with the Tflixs team.',
  alternates: { canonical: 'https://tflixs.com/contact' },
};
export default function ContactPage() { return <ContactClient />; }
