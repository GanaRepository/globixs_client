// components/about/HeroSection.tsx
'use client';

import React from 'react';
import { useInView } from 'react-intersection-observer';
import { FiArrowRight } from 'react-icons/fi';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const HeroSection: React.FC = () => {
  const [heroRef, heroInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <div className="relative overflow-hidden pattern-bg">
      <div className="container mx-auto px-4  py-12 sm:py-16 md:py-24 relative z-10">
        <div
          ref={heroRef}
          className={`max-w-5xl mx-auto text-center transition-all duration-1000 ${
            heroInView
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-12'
          }`}
        >
          <div className="inline-block  ">
            <div className="flex flex-row gap-4 justify-center flex-wrap">
              <div className="relative inline-flex items-center justify-center">
                <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-contact-purple to-contact-teal opacity-70 blur"></div>
                <div className="relative px-6 py-2 bg-white rounded-full text-sm font-normal text-gray-800">
                  We&apos;re ready to chat
                </div>
              </div>
              <div>
                <Link href="#contact-form">
                  <Button className="gradient-button rounded-5xl px-6 py-2">
                    Reach Out Now
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
