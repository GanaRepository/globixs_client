'use client';
import React, { ReactNode } from 'react';
import {
  ArrowUpRight,
  Code,
  Phone,
  Cloud,
  Users,
  Database,
  ShieldCheck,
  Laptop,
  Server,
} from 'lucide-react';
import { Button } from './ui/button';
import { motion } from 'framer-motion';

interface ServiceCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  imageUrl: string;
  ctaText?: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  icon,
  title,
  description,
  imageUrl,
  ctaText = 'Learn More',
}) => {
  return (
    <motion.div
      className="flex-shrink-0 w-64 md:w-80 bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 group hover:shadow-lg transition-all duration-500"
      whileHover={{ translateY: -8 }}
    >
      <div className="h-40 relative overflow-hidden bg-gray-200">
        <div
          className="w-full h-full bg-cover bg-center"
          style={{ backgroundImage: `url(${imageUrl})` }}
        />
        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60"
          whileHover={{
            background:
              'linear-gradient(to bottom, transparent, transparent, rgba(0, 0, 0, 0.6))',
          }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <div className="p-6">
        <motion.div
          className="w-12 h-12 -mt-10 mb-4 rounded-lg bg-white flex items-center justify-center text-blue-600 shadow-md relative z-10"
          whileHover={{ backgroundColor: '#2563eb', color: '#ffffff' }}
          transition={{ duration: 0.3 }}
        >
          {icon}
        </motion.div>

        <motion.h3
          className="text-lg text-gray-800 mb-3"
          whileHover={{ color: '#2563eb' }}
          transition={{ duration: 0.3 }}
        >
          {title}
        </motion.h3>

        <p className="text-gray-600 mb-5 text-sm line-clamp-3">{description}</p>

        <Button className="inline-flex items-center text-white font-medium transition-colors duration-300 bg-globixs-primary hover:bg-globixs-primary/90">
          {ctaText}
          <ArrowUpRight size={16} className="ml-2" />
        </Button>
      </div>
    </motion.div>
  );
};

interface InfiniteMovingCardsProps {
  items: ReactNode[];
  direction?: 'left' | 'right';
  speed?: number;
  pauseOnHover?: boolean;
}

const InfiniteMovingCards: React.FC<InfiniteMovingCardsProps> = ({
  items,
  direction = 'left',
  speed = 10,
  pauseOnHover = true,
}) => {
  const animationVariants = {
    animate: {
      x: direction === 'left' ? '-50%' : '0%',
      transition: {
        x: {
          repeat: Infinity,
          repeatType: 'loop',
          duration: 120 / speed,
          ease: 'linear',
        },
      },
    },
  };

  return (
    <div className="relative w-full">
      <div className="absolute left-0 top-0 h-full w-32 bg-gradient-to-r from-gray-100 to-transparent z-10 pointer-events-none"></div>
      <div className="absolute right-0 top-0 h-full w-32 bg-gradient-to-l from-gray-100 to-transparent z-10 pointer-events-none"></div>

      <motion.div
        className="overflow-hidden w-full relative"
        whileHover={pauseOnHover ? { animationPlayState: 'paused' } : {}}
      >
        <motion.div
          className="flex gap-4 py-4"
          style={{ minWidth: 'max-content' }}
          variants={animationVariants}
          animate="animate"
        >
          {items}
          {items}
        </motion.div>
      </motion.div>
    </div>
  );
};

export const ResponsiveServicesSection = () => {
  const serviceCardsRow1: ServiceCardProps[] = [
    {
      icon: <Code size={24} />,
      title: 'Web Application Development',
      description:
        'Dynamic, scalable web applications built with modern frameworks and responsive design principles.',
      imageUrl: '/appdevelopment.jpg',
    },
    {
      icon: <Phone size={24} />,
      title: 'Mobile App Development',
      description:
        'Native and cross-platform mobile applications that deliver exceptional user experiences across all devices.',
      imageUrl: '/uiux.jpg',
    },
    {
      icon: <Cloud size={24} />,
      title: 'Cloud Services & Migration',
      description:
        'Seamless cloud migration and management services to enhance flexibility, scalability, and cost-efficiency.',
      imageUrl: '/cloud.jpg',
    },
    {
      icon: <Users size={24} />,
      title: 'IT Staffing & Consulting',
      description:
        'Access to top IT talent and strategic consulting to strengthen your team and optimize operations.',
      imageUrl: '/staffing.jpg',
    },
  ];

  const serviceCardsRow2: ServiceCardProps[] = [
    {
      icon: <Database size={24} />,
      title: 'Database Management',
      description:
        'Comprehensive database design, optimization, and maintenance services to ensure data integrity and performance.',
      imageUrl: '/edit6-min.jpg',
    },
    {
      icon: <ShieldCheck size={24} />,
      title: 'Cybersecurity Solutions',
      description:
        'Protect your business with advanced security measures, compliance frameworks, and risk management strategies.',
      imageUrl: '/set6.jpg',
    },
    {
      icon: <Laptop size={24} />,
      title: 'DevOps Automation',
      description:
        'Streamline your development and operations processes with advanced automation and CI/CD pipelines.',
      imageUrl: '/devops.jpg',
    },
    {
      icon: <Server size={24} />,
      title: 'Infrastructure Management',
      description:
        'Comprehensive solutions for managing your IT infrastructure with high reliability and performance.',
      imageUrl: '/image4.jpg',
    },
  ];

  return (
    <div className="py-12 md:py-24 bg-gray-100 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <span className="inline-block py-1 px-4 bg-blue-100 text-blue-600 text-sm rounded-full mb-4 font-medium">
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
            speed={8}
          />
        </div>

        <div className="mb-12 relative">
          <InfiniteMovingCards
            items={serviceCardsRow2.map((service, index) => (
              <ServiceCard key={`service-2-${index}`} {...service} />
            ))}
            direction="right"
            speed={6}
          />
        </div>
      </div>
    </div>
  );
};
