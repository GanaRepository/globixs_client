'use client';

import React from 'react';
import { useInView } from 'react-intersection-observer';
import { FiArrowRight } from 'react-icons/fi';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface CareerHeroSectionProps {
  badgeText?: string;
  title?: string;
  subtitle?: string;
  buttonText?: string;
  buttonLink?: string;
}

const CareerHeroSection: React.FC<CareerHeroSectionProps> = ({
  badgeText = 'Join Our Team',
  title = 'Grow with purpose. Build with passion.',
  subtitle = "At Globixs, your career is more than a role — it's a journey shaped by curiosity, collaboration, and impact.",
  buttonText = 'View Open Positions',
  buttonLink = '/careers',
}) => {
  // Animation hook for scroll reveal
  const [sectionRef, sectionInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <div className="relative overflow-hidden bg-slate-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-24 relative z-10">
        <div
          ref={sectionRef}
          className={`max-w-5xl mx-auto text-center transition-all duration-1000 ${
            sectionInView
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-12'
          }`}
        >
          <div className="inline-block mb-8 ">
            <div className="relative inline-flex items-center justify-center mt-12">
              <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-globixs-primary to-globixs-secondary opacity-70 blur"></div>
              <div className="relative px-6 py-2 bg-white rounded-full text-sm font-normal text-gray-800">
                {badgeText}
              </div>
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-normal mb-6 gradient-text leading-tight">
            {title}
          </h1>
          <p className="text-xl text-gray-700 mb-12 max-w-7xl mx-auto">
            {subtitle}
          </p>
          <Link href={buttonLink}>
            <Button className="gradient-button">
              {buttonText}
              <FiArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CareerHeroSection;
