'use client';

import React, { useState, useEffect } from 'react';

const ScrollProgressBar: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
    };

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);

    // Clean up event listener
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Define professional Globixs colors
  const globixsPrimary = '#1e3a8a'; // Deep navy blue
  const globixsSecondary = '#0ea5e9'; // Sky blue
  const globixsAccent = '#f97316'; // Professional orange

  return (
    <div
      className="fixed top-0 left-0 w-full h-[3px] z-[100] bg-transparent"
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
      }}
    >
      <div
        className="h-full transition-all duration-200"
        style={{
          width: `${scrollProgress}%`,
          background: `linear-gradient(to right, ${globixsPrimary}, ${globixsSecondary}, ${globixsAccent})`,
          boxShadow: `0 0 10px rgba(30, 58, 138, 0.7)`,
        }}
      />
    </div>
  );
};

export default ScrollProgressBar;
