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

export default function PrivacyClient() {
  return (
    <PublicLayout>
      <section className="page-hero">
        <div className="container">
          <h1>🔒 Privacy Policy</h1>
          <p>Last updated: {LAST_UPDATED}</p>
        </div>
      </section>
      <section className="section-sm">
        <div className="container-sm">
          <div className="card">
            <div className="card-body" style={{ padding: '40px' }}>
              <div className="alert alert-info" style={{ marginBottom: 32 }}>
                Your privacy matters to us. Tflixs is designed to be minimally invasive — we collect only what is necessary to provide our free farming tools.
              </div>

              <Section title="1. Who We Are">
                <p>Tflixs operates tflixs.com — a free fertilizer and seed rate calculator platform. This policy describes how we handle your information.</p>
              </Section>

              <Section title="2. Information We Collect">
                <p><strong>Information you provide:</strong></p>
                <ul style={{ marginLeft: 20, marginTop: 8, marginBottom: 12 }}>
                  <li style={{ marginBottom: 6 }}><strong>Contact Forms:</strong> Name, email, and message</li>
                  <li style={{ marginBottom: 6 }}><strong>Newsletter:</strong> Email address and optional name</li>
                  <li style={{ marginBottom: 6 }}><strong>Calculator inputs:</strong> Processed in real-time, not stored against your identity</li>
                </ul>
                <p><strong>Automatically collected:</strong></p>
                <ul style={{ marginLeft: 20, marginTop: 8 }}>
                  <li style={{ marginBottom: 6 }}><strong>Analytics:</strong> Pages visited, device type (via Google Analytics — anonymized)</li>
                  <li style={{ marginBottom: 6 }}><strong>IP address:</strong> For rate limiting only, not stored longer than 24 hours</li>
                  <li style={{ marginBottom: 6 }}><strong>Approximate location:</strong> Country/city from IP for weather and currency — not stored on our servers</li>
                </ul>
                <p style={{ marginTop: 12 }}><strong>We do NOT collect:</strong> payment info (Tflixs is free), account data for public tools, or cross-site tracking data.</p>
              </Section>

              <Section title="3. How We Use Your Information">
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                  <thead>
                    <tr style={{ background: 'var(--green-faint)' }}>
                      {['Data','Purpose','Legal Basis'].map(h => (
                        <th key={h} style={{ padding: '10px 14px', textAlign: 'left', border: '1px solid var(--border)' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ['Contact info','Respond to messages','Legitimate interest'],
                      ['Newsletter email','Send farming tips','Consent'],
                      ['Analytics','Improve tools','Legitimate interest'],
                      ['IP address','Rate limiting, security','Legitimate interest'],
                      ['Calculator inputs','Provide results','Contract performance'],
                    ].map(([data, purpose, basis], i) => (
                      <tr key={data} style={{ background: i % 2 ? 'var(--border-light)' : 'white' }}>
                        {[data, purpose, basis].map((cell, j) => (
                          <td key={j} style={{ padding: '9px 14px', border: '1px solid var(--border)' }}>{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Section>

              <Section title="4. Cookies and Local Storage">
                <ul style={{ marginLeft: 20 }}>
                  <li style={{ marginBottom: 8 }}><strong>Language/Currency preference</strong> — stored in <code>localStorage</code> as <code>tflixs_locale</code>. Never sent to our servers.</li>
                  <li style={{ marginBottom: 8 }}><strong>Google Analytics cookies</strong> — anonymous usage tracking. Opt out at <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noreferrer">tools.google.com/dlpage/gaoptout</a>.</li>
                  <li style={{ marginBottom: 8 }}><strong>Google AdSense</strong> — if ads are enabled, Google may set advertising cookies.</li>
                </ul>
              </Section>

              <Section title="5. Third-Party Services">
                <ul style={{ marginLeft: 20 }}>
                  {[
                    ['Google Analytics', 'policies.google.com/privacy'],
                    ['Google Gemini AI (Flexi)', 'Do not share sensitive personal info in chat'],
                    ['Firebase (admin auth only)', 'firebase.google.com/support/privacy'],
                    ['MongoDB Atlas', 'Contact messages encrypted at rest'],
                    ['Open-Meteo', 'No personal data shared'],
                    ['ipwho.is', 'Country detection only, no data stored'],
                  ].map(([name, note]) => (
                    <li key={name} style={{ marginBottom: 8 }}><strong>{name}</strong> — {note}</li>
                  ))}
                </ul>
              </Section>

              <Section title="6. Data Retention">
                <ul style={{ marginLeft: 20 }}>
                  <li style={{ marginBottom: 6 }}><strong>Contact messages:</strong> Up to 12 months</li>
                  <li style={{ marginBottom: 6 }}><strong>Newsletter subscriptions:</strong> Until you unsubscribe</li>
                  <li style={{ marginBottom: 6 }}><strong>Analytics:</strong> 14 months (Google Analytics standard)</li>
                  <li style={{ marginBottom: 6 }}><strong>Calculator data:</strong> Not retained — real-time only</li>
                </ul>
              </Section>

              <Section title="7. Your Rights">
                <p>You have the right to access, correct, or delete your data, unsubscribe from newsletters at <Link href="/unsubscribe">tflixs.com/unsubscribe</Link>, and object to processing. Contact us at support@tflixs.com to exercise these rights.</p>
              </Section>

              <Section title="8. Children's Privacy">
                <p>Tflixs is not directed at children under 13. If you believe we have collected information from a child, contact us immediately.</p>
              </Section>

              <Section title="9. Security">
                <p>We implement HTTPS encryption, MongoDB Atlas encryption at rest, and API rate limiting. No internet transmission is 100% secure.</p>
              </Section>

              <Section title="10. Changes">
                <p>We may update this policy periodically. The date at the top indicates the last revision.</p>
              </Section>

              <Section title="11. Contact">
                <p>Privacy questions: <Link href="/contact">tflixs.com/contact</Link> · support@tflixs.com</p>
              </Section>

              <div style={{ borderTop: '1px solid var(--border)', paddingTop: 24, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <Link href="/terms"       className="btn btn-outline btn-sm">Terms &amp; Conditions</Link>
                <Link href="/contact"     className="btn btn-outline btn-sm">Contact Us</Link>
                <Link href="/unsubscribe" className="btn btn-outline btn-sm">Unsubscribe</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
