// app/layout.tsx
'use client';

import { Inter, Poppins } from 'next/font/google';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import './globals.css';
import ScrollProgressBar from '@/components/ScrollProgressBar';
import { SessionProvider } from 'next-auth/react';
import { SessionSyncProvider } from '@/components/providers/SessionSyncProvider';

const inter = Inter({ subsets: ['latin'] });
const poppins = Poppins({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
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
      <body className={`${poppins.className} antialiased`}>
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
