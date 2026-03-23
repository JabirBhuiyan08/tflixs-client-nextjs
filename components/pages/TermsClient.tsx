'use client';
import Link from 'next/link';
import PublicLayout from '@/components/layout/PublicLayout';

const LAST_UPDATED = 'March 21, 2026';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 36 }}>
      <h2 style={{ fontSize: '1.25rem', marginBottom: 12, color: 'var(--green-dark)', paddingBottom: 8, borderBottom: '2px solid var(--green-pale)' }}>{title}</h2>
      <div style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '0.95rem' }}>{children}</div>
    </div>
  );
}

export default function TermsClient() {
  return (
    <PublicLayout>
      <section className="page-hero">
        <div className="container">
          <h1>📋 Terms and Conditions</h1>
          <p>Last updated: {LAST_UPDATED}</p>
        </div>
      </section>
      <section className="section-sm">
        <div className="container-sm">
          <div className="card">
            <div className="card-body" style={{ padding: '40px' }}>
              <div className="alert alert-info" style={{ marginBottom: 32 }}>
                Please read these Terms carefully before using Tflixs. By accessing our website, you agree to these terms.
              </div>
              <Section title="1. Acceptance of Terms">
                <p>By accessing tflixs.com, you accept and agree to be bound by these Terms. If you do not agree, please do not use our service.</p>
              </Section>
              <Section title="2. Description of Service">
                <p>Tflixs provides free online agricultural tools: NPK Fertilizer Calculator, Seed Rate Calculator, Crop Calendar, Pest Guide, Farming Blog, and AI assistant (Flexi). These are for informational purposes only.</p>
              </Section>
              <Section title="3. Disclaimer of Warranties">
                <p><strong>Important:</strong> All recommendations are for <strong>general guidance only</strong>, based on FAO, ICAR, BRRI, and IPNI research. Actual requirements depend on local soil, climate, and crop variety. Always consult a licensed agronomist. Prices are approximate global averages only.</p>
              </Section>
              <Section title="4. Limitation of Liability">
                <p>Tflixs is not liable for crop or financial losses, inaccurate results from incorrect data entry, service interruptions, or actions based on AI responses.</p>
              </Section>
              <Section title="5. User Responsibilities">
                <p>You agree to use the service lawfully, provide accurate data in calculators, and not attempt to disrupt or scrape our service.</p>
              </Section>
              <Section title="6. Intellectual Property">
                <p>All content on Tflixs is protected by intellectual property laws. You may use our tools for farming purposes but may not redistribute our content without written permission.</p>
              </Section>
              <Section title="7. Newsletter">
                <p>By subscribing, you consent to receive farming tips by email. Unsubscribe anytime at <Link href="/unsubscribe">tflixs.com/unsubscribe</Link>.</p>
              </Section>
              <Section title="8. Third-Party Services">
                <p>We use Google Analytics, Google Gemini AI, Firebase Authentication, Open-Meteo, and optionally Google AdSense. Each has their own privacy policy.</p>
              </Section>
              <Section title="9. Changes to Terms">
                <p>We may update these terms at any time. The date at the top indicates the last revision. Continued use constitutes acceptance.</p>
              </Section>
              <Section title="10. Contact">
                <p>Questions? Contact us at <Link href="/contact">tflixs.com/contact</Link> or support@tflixs.com.</p>
              </Section>
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: 24, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <Link href="/privacy"    className="btn btn-outline btn-sm">Privacy Policy</Link>
                <Link href="/contact"    className="btn btn-outline btn-sm">Contact Us</Link>
                <Link href="/calculator" className="btn btn-primary btn-sm">Try Calculator</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
