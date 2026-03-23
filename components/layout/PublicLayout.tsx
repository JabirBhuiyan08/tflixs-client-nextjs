'use client';

import { ReactNode } from 'react';
import Header          from './Header';
import Footer          from './Footer';
// import AIChatWidget    from './AIChatWidget';
import NewsletterSignup from './NewsletterSignup';

interface Props {
  children:         ReactNode;
  showNewsletter?:  boolean;
}

export default function PublicLayout({ children, showNewsletter = false }: Props) {
  return (
    <>
      <Header />
      <main className="main-content">
        {children}
      </main>
      {showNewsletter && <NewsletterSignup />}
      <Footer />
      {/* <AIChatWidget /> */}
    </>
  );
}
