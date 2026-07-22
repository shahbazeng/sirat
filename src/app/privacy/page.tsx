import { Metadata } from 'next';
import PrivacyClient from '@/components/PrivacyClient';

export const metadata: Metadata = {
  title: "Privacy Policy | Sirat AI - Sacred Trust & Data Protection",
  description: "Read the Sirat AI privacy policy. Learn how we protect your spiritual queries with military-grade encryption, zero profiling, and absolute data transparency.",
  keywords: ["Sirat AI Privacy Policy", "Data Protection", "Zero Tracking AI", "Secure Islamic Platform", "User Privacy"],
  alternates: {
    canonical: 'https://sirat.ai/privacy',
  },
  openGraph: {
    title: "Privacy Policy | Sirat AI",
    description: "Your sacred trust is our guiding light. Discover how Sirat AI ensures absolute confidentiality and zero tracking for your spiritual journey.",
    url: 'https://sirat.ai/privacy',
    siteName: 'Sirat AI',
    locale: 'en_US',
    type: 'website',
  },
};

export default function PrivacyPageServer() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Sirat AI Privacy Policy",
            "url": "https://sirat.ai/privacy",
            "description": "Privacy policy and data protection guidelines for Sirat AI, ensuring secure, encrypted, and private spiritual inquiries.",
            "publisher": {
              "@type": "Organization",
              "name": "Sirat AI",
              "url": "https://sirat.ai"
            }
          }),
        }}
      />
      <PrivacyClient />
    </>
  );
}