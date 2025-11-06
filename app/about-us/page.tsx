// // app/about/page.tsx
// import React from 'react';
// import ModernAboutPage from './ModernAboutPage';

// export default function AboutPage() {
//   return (
//     <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
//       <ModernAboutPage />
//     </div>
//   );
// }

// File: app/about/page.tsx
import { Metadata, Viewport } from 'next';
import AboutContent from './ModernAboutPage';

export const viewport: Viewport = {
  themeColor: '#0a192f',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://www.globixs.com'),
  title: 'About Us | Globixs Technology Solutions - Our Story, Mission & Core Values',
  description:
    'Learn about Globixs Technology Solutions, our mission to deliver exceptional IT services, our core values, and our commitment to helping businesses navigate the digital future with confidence.',
  keywords: [
    'Globixs Technology Solutions',
    'about Globixs Technology Solutions',
    'IT company history',
    'technology consulting mission',
    'IT services values',
    'technology expertise',
    'IT consulting team',
    'staff augmentation company',
    'software development values',
    'Globixs Technology Solutions vision',
    'IT consulting mission',
    'tech company culture',
    'digital transformation experts',
    'IT services background',
    'software engineering team',
    'IT staffing expertise',
  ],
  authors: [{ name: 'Globixs Technology Solutions', url: 'https://www.globixs.com' }],
  creator: 'Globixs Technology Solutions',
  publisher: 'Globixs Technology Solutions',
  openGraph: {
    title: 'About Us | Globixs Technology Solutions - Our Story, Mission & Core Values',
    description:
      'Learn about Globixs Technology Solutions, our mission to deliver exceptional IT services, our core values, and our commitment to helping businesses navigate the digital future with confidence.',
    url: 'https://www.globixs.com/about',
    siteName: 'Globixs Technology Solutions',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: '/imag5.jpg',
        width: 1200,
        height: 630,
        alt: 'Globixs Technology Solutions - About Us',
      },
    ],
  },
  alternates: {
    canonical: 'https://www.globixs.com/about',
    languages: {
      'en-US': 'https://www.globixs.com/about',
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
    title: 'Globixs Technology Solutions',
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

export default function AboutPage() {
  return <AboutContent />;
}
