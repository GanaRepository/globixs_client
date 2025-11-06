'use client';

import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { ServiceCardProps } from '@/types';
import Image from 'next/image';
import Link from 'next/link';

const ServiceCard: React.FC<ServiceCardProps> = ({
  icon,
  title,
  description,
  imageUrl,
  ctaText = 'Learn More',
}) => {
  return (
    <div className="flex-shrink-0 w-64 md:w-80 bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
      <div className="h-40 relative overflow-hidden bg-gray-200">
        <div
          className="w-full h-full bg-cover bg-center"
          style={{ backgroundImage: `url(${imageUrl})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60"></div>
      </div>

      <div className="p-6">
        <div className="w-12 h-12 -mt-10 mb-4 rounded-lg bg-white flex items-center justify-center text-globixs-primary shadow-md relative z-10">
          {icon}
        </div>

        <h3 className="text-lg text-gray-800 mb-3">{title}</h3>

        <p className="text-gray-600 mb-5 text-sm line-clamp-3">{description}</p>

        <Link
          href="#"
          className="inline-flex items-center text-globixs-primary font-medium"
        >
          {ctaText}
          <ArrowUpRight size={16} className="ml-2" />
        </Link>
      </div>
    </div>
  );
};

export default ServiceCard;
