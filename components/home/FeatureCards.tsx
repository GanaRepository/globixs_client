'use client';

import React from 'react';
import { Users, Award, Code, Clock } from 'lucide-react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
}) => (
  <div className="professional-card p-6">
    <div className="bg-globixs-primary/10 w-12 h-12 rounded-lg flex items-center justify-center text-globixs-primary mb-4">
      {icon}
    </div>
    <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const FeatureCards: React.FC = () => {
  const features = [
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Expert Staff',
      description: 'Top industry professionals',
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: 'Proven Results',
      description: 'Delivering excellence since 2010',
    },
    {
      icon: <Code className="w-6 h-6" />,
      title: 'Custom Solutions',
      description: 'Tailored to your needs',
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: '24/7 Support',
      description: 'Always available assistance',
    },
  ];

  return (
    <section className="py-16 bg-globixs-bgSecondary">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureCards;
