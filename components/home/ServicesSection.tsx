'use client';

import React from 'react';
import {
  Code,
  Users,
  Database,
  ShieldCheck,
  Laptop,
  Server,
} from 'lucide-react';
import { ServiceCardProps } from '@/types';
import ServiceCard from './ServiceCard';
import InfiniteMovingCards from './InfiniteMovingCards';

export const ServicesSection = () => {
  const serviceCardsRow1: ServiceCardProps[] = [
    {
      icon: <Users size={24} />,
      title: 'IT Staff Augmentation',
      description:
        'Access top-tier tech talent to strengthen your team and accelerate project delivery.',
      imageUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c',
    },
    {
      icon: <Code size={24} />,
      title: 'Technical Recruitment',
      description:
        'Expert recruitment services specializing in software development and IT operations roles.',
      imageUrl: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d',
    },
    {
      icon: <Users size={24} />,
      title: 'Contract Staffing',
      description:
        'Flexible IT staffing solutions for short-term projects and seasonal demands.',
      imageUrl: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b',
    },
    {
      icon: <Users size={24} />,
      title: 'Direct Hire Solutions',
      description:
        'Find permanent tech talent that fits your company culture and technical requirements.',
      imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158',
    },
  ];

  const serviceCardsRow2: ServiceCardProps[] = [
    {
      icon: <Database size={24} />,
      title: 'Executive IT Recruitment',
      description:
        'Strategic placement of IT leadership and executive tech positions.',
      imageUrl: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6',
    },
    {
      icon: <ShieldCheck size={24} />,
      title: 'Technical Screening',
      description:
        'Comprehensive assessment and vetting of technical candidates.',
      imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085',
    },
    {
      icon: <Laptop size={24} />,
      title: 'Remote Team Building',
      description:
        'Build and manage distributed tech teams with our remote staffing solutions.',
      imageUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c',
    },
    {
      icon: <Server size={24} />,
      title: 'Team Management',
      description:
        'End-to-end team management and resource allocation services.',
      imageUrl: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d',
    },
  ];

  return (
    <div className="py-12 md:py-24 bg-gray-100 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <span className="inline-block py-1 px-4 bg-globixs-primary/10 text-globixs-primary text-sm rounded-full mb-4 font-medium">
            OUR CORE SERVICES
          </span>
          <h2 className="text-3xl md:text-4xl text-gray-800 mb-6">
            Comprehensive IT Solutions for Your Business
          </h2>
          <p className="text-gray-600 text-lg mt-6 max-w-2xl mx-auto">
            Discover our range of specialized IT services designed to transform
            your business operations and drive growth through innovation.
          </p>
        </div>

        <div className="mb-12 relative">
          <InfiniteMovingCards
            items={serviceCardsRow1.map((service, index) => (
              <ServiceCard key={`service-1-${index}`} {...service} />
            ))}
            direction="left"
            speed={8} // Much slower speed
          />
        </div>

        <div className="mb-12 relative">
          <InfiniteMovingCards
            items={serviceCardsRow2.map((service, index) => (
              <ServiceCard key={`service-2-${index}`} {...service} />
            ))}
            direction="right"
            speed={6} // Even slower for the second row
          />
        </div>
      </div>
    </div>
  );
};

export default ServicesSection;
