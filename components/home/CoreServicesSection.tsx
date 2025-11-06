'use client';
import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, Users, Package, Code } from 'lucide-react';
import { Button } from '../ui/button';
import { motion } from 'framer-motion';

interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  imageUrl: string;
  ctaText?: string;
  ctaLink: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  icon,
  title,
  description,
  imageUrl,
  ctaText = 'Learn More',
  ctaLink,
}) => {
  return (
    <motion.div
      className="flex-shrink-0 w-full professional-card shadow-xl overflow-hidden h-full"
      whileHover={{ y: -8 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <div className="h-48 relative overflow-hidden">
        <div
          className="w-full h-full bg-cover bg-center"
          style={{ backgroundImage: `url(${imageUrl})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60"></div>
      </div>

      <div className="p-6">
        <div className="w-12 h-12 -mt-10 mb-4 rounded-lg bg-globixs-surface flex items-center justify-center text-globixs-primary shadow-xl relative z-10">
          {icon}
        </div>

        <h3 className="heading-tertiary mb-3">{title}</h3>

        <p className="text-body text-globixs-textLight mb-5">{description}</p>

        <Link href={ctaLink}>
          <Button className="professional-button inline-flex items-center gap-2">
            {ctaText}
            <ArrowUpRight size={16} />
          </Button>
        </Link>
      </div>
    </motion.div>
  );
};

export const CoreServicesSection = () => {
  // Updated to point to the correct sections on the services page
  const coreServices: ServiceCardProps[] = [
    {
      icon: <Users size={24} />,
      title: 'Technology Staff Augmentation',
      description:
        'Access to top-tier IT talent with expertise in a wide range of technologies. We provide skilled professionals across software development, cloud engineering, DevOps, and cybersecurity.',
      imageUrl: '/imag5.jpg',
      ctaLink: '/services#staffing',
    },
    {
      icon: <Code size={24} />,
      title: 'IT Consulting Services',
      description:
        'From strategy to execution, we guide businesses through complex technology decisions with actionable insights, roadmap development, and digital transformation advisory.',
      imageUrl: '/image7.jpg',
      ctaLink: '/services#consulting',
    },
    {
      icon: <Package size={24} />,
      title: 'Software Development',
      description:
        'We design and build scalable, high-performance software solutions tailored to your unique business needs, from custom applications to enterprise integrations.',
      imageUrl: '/image12.jpg',
      ctaLink: '/services#development',
    },
  ];

  return (
    <div className="section-padding bg-globixs-bgLight bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="heading-secondary mb-6">
            Specialized IT Solutions for Your Business
          </h2>
          <p className="text-lead text-globixs-textLight mt-6 max-w-2xl mx-auto">
            We deliver high-impact technology services designed to transform
            your business operations and drive sustainable growth.
          </p>
        </div>

        <div className="flex justify-center">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {coreServices.map((service, index) => (
              <ServiceCard key={`core-service-${index}`} {...service} />
            ))}
          </div>
        </div>

        <div className="text-center mt-12">
          <Link href="/services">
            <Button className="professional-button px-8 py-6 text-lg inline-flex items-center gap-2">
              View All Services
              <ArrowUpRight size={20} />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
