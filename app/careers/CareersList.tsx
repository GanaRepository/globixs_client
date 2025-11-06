// File: app/careers/CareersContent.tsx (Client Component)
'use client';

import { useInView } from 'react-intersection-observer';
import { FiTarget, FiZap, FiBriefcase, FiStar } from 'react-icons/fi';
import QuoteSection from '@/components/contact/QuoteSection';
import CareersContentFile from './CareersContentFile';
import CareerHeroSection from './CareerHeroSection';

interface Benefit {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export default function CareersList(): JSX.Element {
  // Animation hooks for scroll reveals
  const { ref: benefitsRef, inView: benefitsInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Team benefits for the "Why Join Us" section
  const benefits: Benefit[] = [
    {
      icon: <FiTarget className="h-6 w-6" />,
      title: 'Strategic Career Growth',
      description:
        'Clear paths for advancement and professional development tailored to your goals',
    },
    {
      icon: <FiStar className="h-6 w-6" />,
      title: 'Innovative Culture',
      description:
        'Work in a creative environment where new ideas are valued and encouraged',
    },
    {
      icon: <FiZap className="h-6 w-6" />,
      title: 'Flexible Work Options',
      description:
        'Balance work and life with remote, hybrid, and flexible scheduling options',
    },
    {
      icon: <FiBriefcase className="h-6 w-6" />,
      title: 'Continuous Learning',
      description:
        'Access to learning resources, workshops, and conferences to expand your skills',
    },
  ];

  return (
    <div>
      <CareerHeroSection
        badgeText="Join Our Team"
        title="Grow with purpose. Build with passion."
        subtitle="At Globixs Technology Solutions, your career is more than a role — it's a journey shaped by curiosity, collaboration, and impact."
        buttonText="View Open Positions"
        buttonLink="#open-positions"
      />

      {/* Benefits / Why Join Us Section */}
      <div className="bg-globixs-bgAccent backdrop-blur-sm pb-12">
        <div className="container mx-auto px-8 sm:px-10 lg:px-12">
          <div
            ref={benefitsRef}
            className={`max-w-6xl mx-auto transition-all duration-1000 ${
              benefitsInView
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-12'
            }`}
          >
            <h2 className="text-4xl font-normal text-center mb-3 gradient-text pt-16 pb-6">
              Why Join Our Team
            </h2>

            <p className="text-gray-600 text-center mb-16 max-w-7xl mx-auto text-xl">
              At Globixs Technology Solutions, we believe that our people are our greatest strength.
              We are passionate about building a culture where innovation
              thrives, ideas are valued, and every team member has the
              opportunity to grow and make a meaningful impact. Whether
              you&apos;re an experienced professional or just beginning your
              career journey, we offer exciting opportunities to work on
              transformative projects across industries and technologies. If
              you&apos;re ready to challenge yourself, collaborate with talented
              peers, and shape the future of technology, we invite you to join
              our team.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="glass p-8 rounded-2xl card-hover"
                  style={{
                    transitionDelay: `${index * 100}ms`,
                  }}
                >
                  <div className="feature-icon text-white">{benefit.icon}</div>
                  <h3 className="text-xl font-normal mb-3">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Open Positions Section */}
      <div id="open-positions">
        <CareersContentFile />
      </div>

      {/* Quote Section */}
      <QuoteSection
        quote="Join a team where innovation meets opportunity. Together, we're not just building technology - we're shaping the future of digital transformation."
        bgColor="bg-slate-50 "
        textColor="text-gray-800"
        author="Globixs Technology Solutions"
        role="Talent Acquisition Team"
      />
    </div>
  );
}
