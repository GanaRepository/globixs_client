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
    <div className="relative overflow-hidden bg-slate-50">
      {/* Decorative elements */}
      <div className="fixed top-0 right-0 w-1/3 h-screen bg-gradient-to-b from-globixs-primary/5 to-globixs-secondary/5 -z-10"></div>
      <div className="fixed top-20 left-10 w-64 h-64 bg-globixs-primary/10 rounded-full filter blur-3xl animate-float -z-10"></div>
      <div
        className="fixed bottom-20 right-10 w-64 h-64 bg-globixs-secondary/10 rounded-full filter blur-3xl animate-float -z-10"
        style={{ animationDelay: '2s' }}
      ></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-24 relative z-10">
        <div
          ref={heroRef}
          className={`max-w-5xl mx-auto text-center transition-all duration-1000 ${
            heroInView
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-12'
          }`}
        >
          <div className="inline-block mb-8">
            <div className="relative inline-flex items-center justify-center mt-16">
              <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-globixs-primary to-globixs-secondary opacity-70 blur"></div>
              <div className="relative px-6 py-2 bg-white rounded-full text-sm font-normal text-gray-800">
                Experience & Expertise
              </div>
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-normal mb-6 gradient-text leading-tight">
            About Our Company
          </h1>
          <p className="text-xl text-gray-700 mb-12 max-w-6xl mx-auto">
            At PioneerIT,we&apos;re dedicated to delivering exceptional
            technology solutions built on experience and expertise. Our team
            combines deep technical knowledge with industry insights to help
            your business thrive. Whether you need custom software development,
            system integration, or strategic IT consulting, we provide the right
            solutions to meet your unique challenges. We pride ourselves on
            building lasting partnerships and delivering results that drive your
            business forward in today&apos;s competitive landscape.
          </p>
          <Link href="#values">
            <Button className="gradient-button">
              Our Core Values
              <FiArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
