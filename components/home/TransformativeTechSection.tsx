'use client';

import React from 'react';
import { Users, Award, Code, Clock } from 'lucide-react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  index: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
  index,
}) => {
  // Tailwind gradient backgrounds for each card
  const gradients = [
    'from-indigo-500 to-purple-500',
    'from-blue-500 to-teal-400',
    'from-violet-500 to-fuchsia-500',
    'from-pink-500 to-rose-500',
  ];

  return (
    <div
      className={`relative overflow-hidden rounded-xl p-1 bg-gradient-to-br ${gradients[index % gradients.length]}`}
    >
      <div className="bg-white dark:bg-gray-900 rounded-lg p-6 h-full backdrop-blur-sm">
        <div className="flex items-center mb-5">
          <div
            className={`flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br ${gradients[index % gradients.length]} text-white`}
          >
            {icon}
          </div>
          <h3 className="text-xl font-semibold ml-4 text-gray-900 dark:text-white">
            {title}
          </h3>
        </div>

        <div className="bg-gray-100 dark:bg-gray-800 h-px w-full mb-4 opacity-30" />

        <p className="text-gray-600 dark:text-gray-300">{description}</p>
      </div>
    </div>
  );
};

const FeatureCards: React.FC = () => {
  const features = [
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Expert Staff',
      description:
        'Our team consists of industry-leading professionals with years of experience delivering exceptional results for clients worldwide.',
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: 'Proven Results',
      description:
        'With a track record of excellence since 2010, we&apos;ve consistently delivered solutions that exceed expectations and drive business growth.',
    },
    {
      icon: <Code className="w-6 h-6" />,
      title: 'Custom Solutions',
      description:
        'We create bespoke solutions tailored to your specific needs, ensuring perfect alignment with your business goals and objectives.',
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: '24/7 Support',
      description:
        'Our dedicated support team is available around the clock to address any concerns and provide immediate assistance whenever you need it.',
    },
  ];

  return (
    <section className="py-16 px-4 pattern-bg">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Why Choose Us
          </h2>
          <div className="h-1 w-24 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureCards;
