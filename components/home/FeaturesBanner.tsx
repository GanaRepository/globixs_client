'use client';

import React from 'react';
import Link from 'next/link';
import { Shield, Clock, Award, ArrowUpRight } from 'lucide-react';

interface FeaturesBannerProps {}

const FeaturesBanner: React.FC<FeaturesBannerProps> = () => {
  return (
    <div className="py-8 bg-gradient-to-r from-blue-800 via-blue-600 to-orange-500 text-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-between items-center gap-8 lg:gap-4">
          <div className="flex items-center gap-4">
            <Shield size={32} className="text-white" />
            <div>
              <h3 className="text-lg font-medium">Enterprise-Grade Security</h3>
              <p className="text-white/80 text-sm">
                Advanced protection for your data
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Clock size={32} className="text-white" />
            <div>
              <h3 className="text-lg font-medium">Rapid Deployment</h3>
              <p className="text-white/80 text-sm">
                Quick implementation of solutions
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Award size={32} className="text-white" />
            <div>
              <h3 className="text-lg font-medium">Industry Recognition</h3>
              <p className="text-white/80 text-sm">Award-winning IT services</p>
            </div>
          </div>

          <Link
            href="/contact-us"
            className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-lg backdrop-blur-sm flex items-center gap-2 whitespace-nowrap font-medium"
          >
            Get Started
            <ArrowUpRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
};
export default FeaturesBanner;
