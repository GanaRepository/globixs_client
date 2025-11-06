// app/layout.tsx
'use client';

import { Playfair_Display, Work_Sans, Space_Grotesk } from 'next/font/google';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import './globals.css';
import ScrollProgressBar from '@/components/ScrollProgressBar';
import { SessionProvider } from 'next-auth/react';
import { SessionSyncProvider } from '@/components/providers/SessionSyncProvider';

const playfairDisplay = Playfair_Display({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair',
});

const workSans = Work_Sans({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-work-sans',
});

const spaceGrotesk = Space_Grotesk({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-space-grotesk',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <title>Globixs Technology Solutions</title>
        <link rel="icon" href="/favicon2.ico" type="image/png" />
      </head>
      <body className={`${workSans.variable} ${playfairDisplay.variable} ${spaceGrotesk.variable} font-sans antialiased`}>
        <SessionProvider>
          <SessionSyncProvider>
            <Navbar />
            <ScrollProgressBar />
            <main>{children}</main>
            <Footer />
          </SessionSyncProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
