// File: app/page.tsx
import React from 'react';
import { Metadata, Viewport } from 'next';
import QuoteSection from '@/components/contact/QuoteSection';
import { IndustriesSection } from '@/components/home/IndustriesSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import Hero from '@/components/home/Hero';
import { CoreServicesSection } from '@/components/home/CoreServicesSection';
import { AboutSection } from '@/components/home/AboutSection';

export const viewport: Viewport = {
  themeColor: '#0a192f',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://www.globixs.com'),
  title: 'Globixs Technology Solutions | Premier IT Staff Augmentation & Technology Services',
  description:
    'Globixs Technology Solutions offers professional IT staffing solutions, software development services, and technology consulting to help businesses innovate and achieve their digital transformation goals.',
  keywords: [
    'Globixs Technology Solutions',
    'IT staffing solutions',
    'technology staffing',
    'staff augmentation',
    'software development services',
    'IT consulting',
    'tech talent solutions',
    'professional IT services',
    'technology consulting',
    'remote IT staffing',
    'digital transformation',
    'IT recruitment services',
    'software engineers',
    'technology professionals',
    'IT project solutions',
    'technology partner',
  ],
  authors: [{ name: 'Globixs Technology Solutions', url: 'https://www.globixs.com' }],
  creator: 'Globixs Technology Solutions',
  publisher: 'Globixs Technology Solutions',
  openGraph: {
    title: 'Globixs Technology Solutions | Premier IT Staff Augmentation & Technology Services',
    description:
      'Globixs Technology Solutions offers professional IT staffing solutions, software development services, and technology consulting to help businesses innovate and achieve their digital transformation goals.',
    url: 'https://www.globixs.com',
    siteName: 'Globixs Technology Solutions',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: '/imag5.jpg',
        width: 1200,
        height: 630,
        alt: 'Globixs - Home',
      },
    ],
  },
  alternates: {
    canonical: 'https://www.globixs.com',
    languages: {
      'en-US': 'https://www.globixs.com',
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
    nocache: true,
  },
  category: 'Technology',
  appleWebApp: {
    capable: true,
    title: 'Globixs',
    statusBarStyle: 'black-translucent',
  },
  formatDetection: {
    telephone: true,
    date: false,
    address: true,
    email: true,
  },
  other: {
    'google-site-verification': 'your-verification-code',
  },
  appLinks: {
    web: {
      url: 'https://www.globixs.com',
      should_fallback: true,
    },
  },
  verification: {
    google: 'your-verification-code',
  },
};

export default function Home() {
  return (
    <div className="min-h-screen">
      <div className="fixed top-20 left-10 w-64 h-64 bg-globixs-primary/5 rounded-full filter blur-3xl animate-float -z-10"></div>
      <div
        className="fixed bottom-20 right-10 w-64 h-64 bg-globixs-secondary/8 rounded-full filter blur-3xl animate-float -z-10"
        style={{ animationDelay: '2s' }}
      ></div>
      <main>
        <Hero />
        <AboutSection />
        <CoreServicesSection />
        <IndustriesSection />
        <TestimonialsSection />
        <QuoteSection
          quote="Globixs Technology Solutions delivers exceptional IT staffing solutions, connecting businesses with the right talent to drive innovation and growth."
          author="Globixs Technology Solutions"
          role="Your Technology Staffing Partner"
          bgColor="bg-globixs-bgAccent"
          textColor="text-globixs-text"
        />
      </main>
    </div>
  );
}
