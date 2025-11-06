'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const Hero = () => {
  const [currentScreen, setCurrentScreen] = useState(0);

  const screens = [
    {
      headline: 'Talent-led. Purpose-driven. Built for the long run.',
      subtext:
        "At Globixs, we're more than a tech staffing partner—we're your growth enabler. We match great talent with ambitious missions, helping businesses build stronger foundations through deep expertise and meaningful relationships.",
      backgroundImage: '/imag1.jpg',
    },
    {
      headline: 'Where skill meets scale, and speed meets certainty.',
      subtext:
        'From technology staff augmentation to cross-functional delivery pods, we bring the right people, processes, and tools—on demand. Our flexible models help you scale without friction.',
      backgroundImage: '/imag2.jpg',
    },
    {
      headline: 'Solutions tailored by industry, powered by people.',
      subtext:
        'We specialize in Automotive, Healthcare, Tech, Telecom, Retail, and Utilities. We speak your language, understand your priorities, and deliver impact—every time.',
      backgroundImage: '/imag3.jpg',
    },
  ];

  useEffect(() => {
    // Set up rotation timer
    const timer = setInterval(() => {
      setCurrentScreen((prev) => (prev + 1) % screens.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [screens.length]);

  return (
    <div 
      className="relative min-h-screen bg-cover bg-center bg-no-repeat transition-all duration-1000 ease-in-out"
      style={{
        backgroundImage: `url(${screens[currentScreen].backgroundImage})`,
      }}
    >
      {/* Black tint overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-80"></div>
      
      {/* Content */}
      <div className="relative z-10 section-padding">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-block mb-8">
              <div className="relative inline-flex items-center justify-center mt-16">
                <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-globixs-primary to-globixs-secondary opacity-70 blur"></div>
                <div className="relative px-8 py-3 bg-globixs-surface rounded-full text-sm font-medium text-globixs-text shadow-lg">
                  Powering Your Growth with Exceptional Technology Talent
                </div>
              </div>
            </div>

            <div className="relative min-h-[300px]">
              {screens.map((screen, index) => (
                <div
                  key={index}
                  className={`absolute w-full transition-opacity duration-500 ${
                    currentScreen === index
                      ? 'opacity-100'
                      : 'opacity-0 pointer-events-none'
                  }`}
                >
                  <div className="rounded-lg p-8 ">
                    <h1 
                      className="heading-primary mb-8 leading-tight text-white" 
                      style={{ 
                        color: '#fff',
                        textShadow: '2px 2px 4px rgba(0,0,0,0.8), -1px -1px 2px rgba(0,0,0,0.8), 1px -1px 2px rgba(0,0,0,0.8), -1px 1px 2px rgba(0,0,0,0.8)'
                      }}
                    >
                      {screen.headline}
                    </h1>
                    <p 
                      className="text-lead mb-12 max-w-3xl mx-auto text-white"
                      style={{ 
                        color: '#fff',
                        textShadow: '1px 1px 3px rgba(0,0,0,0.9), -1px -1px 2px rgba(0,0,0,0.9)'
                      }}
                    >
                      {screen.subtext}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 mb-8 flex justify-center space-x-2">
              {screens.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentScreen(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    currentScreen === index
                      ? 'bg-globixs-primary scale-125 shadow-md'
                      : 'bg-white bg-opacity-50 hover:bg-globixs-primary/50'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>

            <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mt-12">
              <Link href="/login" className="professional-button">
                Discover Top Talent
              </Link>
              <Link href="/about-us" className="professional-button-outline">
                Explore Our Approach
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
