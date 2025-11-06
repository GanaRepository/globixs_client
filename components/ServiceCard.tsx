import React from 'react';
import { Card } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';

interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  imageUrl: string;
  href?: string;
  delay?: number;
}

const ServiceCard = ({
  icon,
  title,
  description,
  color,
  imageUrl,
  href,
  delay = 0,
}: ServiceCardProps) => {
  return (
    <div
      className="group h-full card-hover"
      style={{
        animationDelay: `${delay * 100}ms`,
        animationFillMode: 'forwards',
      }}
    >
      <Card className="h-full professional-card card-padding transition-all duration-500 overflow-hidden relative">
        <div
          className={`absolute inset-0 ${color} opacity-0 group-hover:opacity-5 transition-all duration-500 ease-in-out`}
        />
        <div className="relative z-10">
          <div className="mb-6 relative h-48 rounded-xl overflow-hidden shadow-lg">
            <Image
              src={imageUrl}
              alt={title}
              fill
              className="object-cover transform group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div
              className={`absolute inset-0 ${color} opacity-10 group-hover:opacity-20 transition-opacity duration-500`}
            />
          </div>
          <div className="feature-icon">{icon}</div>
          <h3 className="heading-tertiary mb-4 group-hover:text-globixs-primary transition-colors duration-300">
            {title}
          </h3>
          <p className="text-body text-globixs-textLight mb-6 group-hover:text-globixs-text transition-colors duration-300">
            {description}
          </p>
          {/* <div className="flex items-center text-globixs-secondary group-hover:text-globixs-primary transition-all duration-300 transform group-hover:translate-x-1">
            Learn more{' '}
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
          </div> */}
        </div>
      </Card>
    </div>
  );
};

export default ServiceCard;
