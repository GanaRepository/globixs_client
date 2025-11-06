// 'use client';

// import React, { useRef } from 'react';
// import { Avatar, AvatarFallback } from '@/components/ui/avatar';
// import { Card, CardContent } from '@/components/ui/card';
// import {
//   QuoteIcon,
//   TrendingUp,
//   Clock,
//   Rocket,
//   CloudCog,
//   Cloud,
//   Brain,
//   Building,
// } from 'lucide-react';
// import { motion } from 'framer-motion';

// export interface TestimonialProps {
//   quote: string;
//   role: string;
//   company: string;
//   initials: string;
//   metric?: string;
//   metricIcon?: React.ReactNode;
// }

// const Testimonial: React.FC<TestimonialProps> = ({
//   quote,
//   role,
//   company,
//   initials,
//   metric,
//   metricIcon,
// }) => {
//   return (
//     <Card className="border-none shadow-lg bg-white/90 backdrop-blur-sm h-full">
//       <CardContent className="p-6 h-full flex flex-col">
//         <div className="relative mb-6">
//           <div className="absolute -top-8 left-0 w-full flex justify-center">
//             <Avatar className="h-16 w-16 border-4 border-white shadow-md ring-2 ring-contact-purple/20">
//               <AvatarFallback className="bg-gradient-to-br from-contact-purple/90 to-contact-teal/90 text-white text-lg font-medium">
//                 <Building size={24} />
//               </AvatarFallback>
//             </Avatar>
//           </div>
//         </div>

//         <div className="text-center mb-4 mt-4">
//           <p className=" text-gray-900">{role}</p>
//           <p className="text-sm text-gray-500">from {company}</p>
//         </div>

//         <div className="relative flex-grow">
//           <div className="flex justify-center mb-2">
//             <QuoteIcon size={28} className="text-contact-purple/30" />
//           </div>
//           <p className="text-center px-2 text-gray-700 italic leading-relaxed mb-6">
//             &quot;{quote}&quot;
//           </p>
//         </div>

//         {metric && (
//           <div className="mt-6 flex items-center justify-center py-3 px-4 rounded-full bg-gradient-to-r from-contact-purple/10 to-contact-teal/10 text-contact-purple">
//             <div className="mr-2 text-contact-purple/80">
//               {metricIcon || <TrendingUp size={18} />}
//             </div>
//             <p className="text-sm font-medium">{metric}</p>
//           </div>
//         )}
//       </CardContent>
//     </Card>
//   );
// };

// interface InfiniteMovingCardsProps {
//   items: React.ReactNode[];
//   direction?: 'left' | 'right';
//   speed?: number;
//   pauseOnHover?: boolean;
// }

// const InfiniteMovingCards: React.FC<InfiniteMovingCardsProps> = ({
//   items,
//   direction = 'left',
//   speed = 40,
//   pauseOnHover = true,
// }) => {
//   const containerRef = useRef<HTMLDivElement | null>(null);

//   return (
//     <div className="relative w-full overflow-hidden" ref={containerRef}>
//       {/* Main container - no blurs */}
//       <motion.div
//         className="flex gap-4 py-4"
//         initial={{ x: direction === 'left' ? '0%' : '-100%' }}
//         animate={{ x: direction === 'left' ? '-100%' : '0%' }}
//         transition={{
//           duration: speed,
//           repeat: Infinity,
//           ease: 'linear',
//           repeatType: 'loop',
//         }}
//         whileHover={{
//           animationPlayState: pauseOnHover ? 'paused' : 'running',
//         }}
//       >
//         {items}
//         {items}
//       </motion.div>
//     </div>
//   );
// };

// export const TestimonialsSection: React.FC = () => {
//   const testimonials: TestimonialProps[] = [
//     {
//       quote:
//         'Globixs helped us implement a DevOps pipeline that dramatically improved our deployment frequency and reliability.',
//       role: 'A CTO',
//       company: 'HealthTech Solutions',
//       initials: 'CTO',
//       metric: '50% faster DevOps pipeline in 6 months',
//       metricIcon: <CloudCog size={18} />,
//     },
//     {
//       quote:
//         'The quality of technical talent provided by Globixs has been exceptional. We were able to accelerate our digital transformation journey.',
//       role: 'A VP of Technology',
//       company: 'Global Insurance Corp',
//       initials: 'VP',
//       metric: 'Augmented IT team with 30+ specialists',
//       metricIcon: <Rocket size={18} />,
//     },
//     {
//       quote:
//         'Their IT staffing solutions helped us build a custom CRM platform that perfectly matched our requirements and market needs.',
//       role: 'A Senior Project Manager',
//       company: 'Financial Services Inc',
//       initials: 'PM',
//       metric: 'Reduced time-to-market by 40%',
//       metricIcon: <Clock size={18} />,
//     },
//     {
//       quote:
//         'The cloud migration strategy implemented by Globixs was seamless. We now have a scalable infrastructure that grows with our business needs.',
//       role: 'A Cloud Architect',
//       company: 'RetailPlus Group',
//       initials: 'CA',
//       metric: 'Migrated 100+ services with zero downtime',
//       metricIcon: <Cloud size={18} />,
//     },
//     {
//       quote:
//         'We needed specialized expertise for our high-traffic e-commerce platform, and Globixs delivered exceptional talent that integrated seamlessly with our team.',
//       role: 'A Technical Director',
//       company: 'Fashion Forward',
//       initials: 'TD',
//       metric: 'Handled 300% increase in site traffic during peak seasons',
//       metricIcon: <Brain size={18} />,
//     },
//   ];

//   // Map testimonials to cards
//   const testimonialCards = testimonials.map((testimonial, index) => (
//     <div key={`testimonial-${index}`} className="flex-shrink-0 w-80 md:w-96">
//       <Testimonial {...testimonial} />
//     </div>
//   ));

//   return (
//     <section className="py-24 pattern-bg overflow-hidden">
//       <div className="container mx-auto px-4">
//         <div className="text-center max-w-4xl mx-auto mb-16">
//           <h2 className="text-4xl  mb-6 bg-gradient-to-r from-contact-purple to-contact-teal bg-clip-text text-transparent pr-2">
//             Client Testimonials
//           </h2>
//           <p className="text-lg text-gray-600">
//             See how we&apos;ve helped organizations across industries achieve
//             their technology goals with our staffing solutions.
//           </p>
//         </div>

//         <div>
//           <InfiniteMovingCards
//             items={testimonialCards}
//             direction="left"
//             speed={40}
//             pauseOnHover={true}
//           />
//         </div>
//       </div>
//     </section>
//   );
// };

// export default TestimonialsSection;

'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import {
  QuoteIcon,
  TrendingUp,
  Clock,
  Rocket,
  CloudCog,
  Cloud,
  Brain,
  Building,
} from 'lucide-react';
import { motion } from 'framer-motion';

export interface TestimonialProps {
  quote: string;
  role: string;
  company: string;
  initials: string;
  metric?: string;
  metricIcon?: React.ReactNode;
}

const Testimonial: React.FC<TestimonialProps> = ({
  quote,
  role,
  company,
  initials,
  metric,
  metricIcon,
}) => {
  return (
    <Card className="border-none shadow-lg bg-white/90 backdrop-blur-sm h-full">
      <CardContent className="p-6 h-full flex flex-col">
        <div className="relative mb-6">
          <div className="absolute -top-8 left-0 w-full flex justify-center">
            <Avatar className="h-16 w-16 border-4 border-globixs-surface shadow-xl ring-2 ring-globixs-primary/20">
              <AvatarFallback className="bg-gradient-to-br from-globixs-primary/90 to-globixs-secondary/90 text-white text-lg font-medium">
                <Building size={24} />
              </AvatarFallback>
            </Avatar>
          </div>
        </div>

        <div className="text-center mb-4 mt-4">
          <p className="font-medium text-globixs-text">{role}</p>
          <p className="text-sm text-globixs-textLight">from {company}</p>
        </div>

        <div className="relative flex-grow">
          <div className="flex justify-center mb-2">
            <QuoteIcon size={28} className="text-globixs-primary/30" />
          </div>
          <p className="text-center px-2 text-globixs-textLight italic leading-relaxed mb-6">
            &quot;{quote}&quot;
          </p>
        </div>

        {metric && (
          <div className="mt-6 flex items-center justify-center py-3 px-4 rounded-full bg-gradient-to-r from-globixs-primary/10 to-globixs-secondary/10 text-globixs-primary">
            <div className="mr-2 text-globixs-primary/80">
              {metricIcon || <TrendingUp size={18} />}
            </div>
            <p className="text-sm font-medium">{metric}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

interface InfiniteMovingCardsProps {
  items: React.ReactNode[];
  direction?: 'left' | 'right';
  speed?: number;
  pauseOnHover?: boolean;
}

const InfiniteMovingCards: React.FC<InfiniteMovingCardsProps> = ({
  items,
  direction = 'left',
  speed = 40,
  pauseOnHover = true,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  return (
    <div className="relative w-full overflow-hidden" ref={containerRef}>
      <motion.div
        className="flex gap-4 py-4"
        initial={{ x: direction === 'left' ? '0%' : '-100%' }}
        animate={{ x: direction === 'left' ? '-100%' : '0%' }}
        transition={{
          duration: speed,
          repeat: Infinity,
          ease: 'linear',
          repeatType: 'loop',
        }}
        style={{
          willChange: 'transform', // Performance optimization
        }}
        whileHover={pauseOnHover ? { animationPlayState: 'paused' } : undefined}
      >
        {items}
        {items}
      </motion.div>
    </div>
  );
};

export const TestimonialsSection: React.FC = () => {
  const testimonials: TestimonialProps[] = [
    {
      quote:
        'Globixs helped us implement a DevOps pipeline that dramatically improved our deployment frequency and reliability.',
      role: 'A CTO',
      company: 'HealthTech Solutions',
      initials: 'CTO',
      metric: '50% faster DevOps pipeline in 6 months',
      metricIcon: <CloudCog size={18} />,
    },
    {
      quote:
        'The quality of technical talent provided by Globixs has been exceptional. We were able to accelerate our digital transformation journey.',
      role: 'A VP of Technology',
      company: 'Global Insurance Corp',
      initials: 'VP',
      metric: 'Augmented IT team with 30+ specialists',
      metricIcon: <Rocket size={18} />,
    },
    {
      quote:
        'Their IT staffing solutions helped us build a custom CRM platform that perfectly matched our requirements and market needs.',
      role: 'A Senior Project Manager',
      company: 'Financial Services Inc',
      initials: 'PM',
      metric: 'Reduced time-to-market by 40%',
      metricIcon: <Clock size={18} />,
    },
    {
      quote:
        'The cloud migration strategy implemented by Globixs was seamless. We now have a scalable infrastructure that grows with our business needs.',
      role: 'A Cloud Architect',
      company: 'RetailPlus Group',
      initials: 'CA',
      metric: 'Migrated 100+ services with zero downtime',
      metricIcon: <Cloud size={18} />,
    },
    {
      quote:
        'We needed specialized expertise for our high-traffic e-commerce platform, and Globixs delivered exceptional talent that integrated seamlessly with our team.',
      role: 'A Technical Director',
      company: 'Fashion Forward',
      initials: 'TD',
      metric: 'Handled 300% increase in site traffic during peak seasons',
      metricIcon: <Brain size={18} />,
    },
  ];

  // Map testimonials to cards
  const testimonialCards = testimonials.map((testimonial, index) => (
    <div key={`testimonial-${index}`} className="flex-shrink-0 w-80 md:w-96">
      <Testimonial {...testimonial} />
    </div>
  ));

  return (
    <section className="py-24 bg-slate-50 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <h2 className="heading-secondary mb-6">Client Testimonials</h2>
          <p className="text-lg text-gray-600">
            See how we&apos;ve helped organizations across industries achieve
            their technology goals with our staffing solutions.
          </p>
        </div>

        <div>
          <InfiniteMovingCards
            items={testimonialCards}
            direction="left"
            speed={40}
            pauseOnHover={true}
          />
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
