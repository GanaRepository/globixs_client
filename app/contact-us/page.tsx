// File: app/contact-us/page.tsx
import { Metadata, Viewport } from 'next';
import ContactFormContent from './ContactFormContent';

export const viewport: Viewport = {
  themeColor: '#0a192f',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://www.globixs.com'),
  title: 'Contact Us | Globixs - Get in Touch with Our Team',
  description:
    'Connect with Globixs for technology solutions, staffing services, or business inquiries. Our expert team is ready to help with your technology and recruitment needs.',
  keywords: [
    'Globixs',
    'contact us',
    'IT consulting contact',
    'tech staffing inquiries',
    'software development contact',
    'technology solutions contact',
    'DevOps services',
    'IT experts',
    'tech recruitment',
    'business inquiries',
    'get in touch',
    'request IT services',
    'tech consultation',
    'project inquiry',
    'tech talent solutions',
    'IT support contact',
  ],
  authors: [{ name: 'Globixs', url: 'https://www.globixs.com' }],
  creator: 'Globixs',
  publisher: 'Globixs',
  openGraph: {
    title: 'Contact Us | Globixs - Get in Touch with Our Team',
    description:
      'Connect with Globixs for technology solutions, staffing services, or business inquiries. Our expert team is ready to help with your technology and recruitment needs.',
    url: 'https://www.globixs.com/contact-us',
    siteName: 'Globixs',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: '/contact-us-og.jpg', // Update with your actual image path
        width: 1200,
        height: 630,
        alt: 'Globixs - Contact Us',
      },
    ],
  },
  alternates: {
    canonical: 'https://www.globixs.com/contact-us',
    languages: {
      'en-US': 'https://www.globixs.com/contact-us',
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
    nocache: false,
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

export default function ContactPage() {
  return <ContactFormContent />;
}
