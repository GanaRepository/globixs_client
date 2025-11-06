'use client';

import React from 'react';
import { useInView } from 'react-intersection-observer';

// Define the HeroSlide interface
export interface HeroSlide {
  title: string;
  subtitle: string;
  description?: string;
  backgroundImage?: string;
}

// Define props interface with optional slides
interface HeroSectionProps {
  slides?: HeroSlide[];
}

const HeroSection: React.FC<HeroSectionProps> = ({
  slides = [
    {
      title:
        'Complementing technology staffing and solutions, built around your goals',
      subtitle:
        'From tech talent to DevOps and FinOps, we plug into your vision to accelerate growth, reduce friction and deliver real impact',
      description:
        'We tailor our approach to match your unique challenges and opportunities, ensuring seamless integration with your existing teams and processes.',
    },
  ],
}) => {
  // Animation hook for scroll reveal
  const [heroRef, heroInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <div className="relative overflow-hidden bg-slate-50">
      {/* Decorative elements */}
      <div className="fixed top-0 right-0 w-1/3 bg-gradient-to-b from-globixs-primary/5 to-globixs-secondary/5 -z-10"></div>
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
            <div className="relative inline-flex items-center justify-center mt-12">
              <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-globixs-primary to-globixs-secondary opacity-70 blur"></div>
              <div className="relative px-6 py-2 bg-white rounded-full text-sm font-medium text-gray-800 shadow-lg">
                Discover Our Expertise
              </div>
            </div>
          </div>

          <div className="text-center max-w-7xl mx-auto ">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-normal mb-8 gradient-text leading-tight">
              {slides[0].title}
            </h1>
            <p className="text-lg sm:text-xl text-gray-700 mb-6 max-w-4xl mx-auto leading-relaxed">
              {slides[0].subtitle}
            </p>
            {slides[0].description && (
              <p className="text-md sm:text-lg text-gray-700 max-w-3xl mx-auto">
                {slides[0].description}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
