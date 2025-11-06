'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import HeroSection from './HeroSection';

// Component interfaces
interface SectionHeaderProps {
  children: React.ReactNode;
  className?: string;
}

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

interface StatProps {
  value: string;
  label: string;
  delay?: number;
}

// Section Header component with animated underline
const SectionHeader = ({ children, className = '' }: SectionHeaderProps) => {
  const isTextCentered = className.includes('text-center');

  return (
    <div className={`mb-12 ${className}`}>
      <h2 className="text-3xl md:text-4xl mb-4 text-gray-900 font-normal">
        {children}
      </h2>
      <div className={`${isTextCentered ? 'flex justify-center' : ''}`}>
        <div className="w-20 h-1.5 bg-globixs-primary rounded-full"></div>
      </div>
    </div>
  );
};

// Custom Card component for consistent styling
const ModernCard = ({ children, className = '' }: CardProps) => (
  <Card
    className={`bg-white/90 backdrop-blur-sm p-6 sm:p-8 shadow-sm border border-slate-100 h-full ${className}`}
  >
    {children}
  </Card>
);

// Stats component with animated counter
const Stat = ({ value, label, delay = 0 }: StatProps) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const currentRef = ref.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        }
      },
      { threshold: 0.1 }
    );

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  useEffect(() => {
    if (!inView) return;

    const end = parseInt(value.replace(/[^0-9]/g, ''), 10);
    const duration = 2000;
    const startTimestamp = performance.now();

    const step = (timestamp: number) => {
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.floor(easeProgress * end));

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    const timer = setTimeout(() => {
      window.requestAnimationFrame(step);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay, inView]);

  return (
    <div ref={ref} className="text-center">
      <h3 className="text-4xl sm:text-5xl text-globixs-primary mb-2 font-normal">
        {inView ? count : 0}
        {value.includes('+') && '+'}
      </h3>
      <p className="text-gray-600 font-medium">{label}</p>
    </div>
  );
};

export default function ModernAboutPage() {
  // Core values data
  const valueItems = [
    {
      title: 'Customers First',
      description:
        'We exist to serve customers, whose demand is the driving force behind our development. We continuously create long-term value for customers by being responsive to their needs.',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
    },
    {
      title: 'Dedication',
      description:
        "We win customers' respect and trust through dedication. It includes every effort to create value for customers and improve our capabilities. We value employees' contributions and reward them accordingly.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
      ),
    },
    {
      title: 'Continuous Improvement',
      description:
        'Continuous improvement is required for us to become better partners for our customers, improve our company and grow as individuals. This process requires that we actively listen and learn in order to improve.',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
          />
        </svg>
      ),
    },
    {
      title: 'Openness & Initiative',
      description:
        'Driven by customer needs, we passionately pursue customer-centric innovations in an open manner. We believe that business success is the ultimate measure of the value of any technology, product, solution or process improvement.',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
          />
        </svg>
      ),
    },
    {
      title: 'Integrity',
      description:
        "Integrity is our most valuable asset. It drives us to behave honestly and keep our promises, and, thus, win our customers' trust and respect.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
      ),
    },
    {
      title: 'Teamwork',
      description:
        'We can only succeed through teamwork. By working closely in both good times and bad, we lay the foundation for successful cross-cultural collaboration, streamlined inter-departmental cooperation and efficient processes.',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ),
    },
  ];

  // Why Choose Us features
  const whyChooseUsFeatures = [
    {
      title: 'Trusted Expertise',
      description:
        'Our team brings deep experience across industries and technologies, delivering real value from day one.',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      title: 'Flexible Engagement Models',
      description:
        'Scale your teams and projects as needed—with the right skills at the right time.',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
          />
        </svg>
      ),
    },
    {
      title: 'Commitment to Quality',
      description:
        'We prioritize delivering outcomes that exceed expectations, not just filling roles.',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
          />
        </svg>
      ),
    },
    {
      title: 'Speed to Impact',
      description:
        'Our streamlined onboarding ensures faster deployment of talent and solutions, keeping your projects on track.',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      ),
    },
  ];

  return (
    <>
      {/* Hero Section with Parallax Effect - Keeping for uniformity */}
      <HeroSection />

      {/* About Us Section */}
      <section id="about" className="py-24 bg-globixs-bgAccent">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
                            <SectionHeader>About Globixs Technology Solutions</SectionHeader>
              <p className="text-lg leading-relaxed text-gray-600 mb-8">
                At Globixs Technology Solutions, we bring together a powerhouse of technical
                expertise and industry knowledge to help businesses navigate the
                digital future with confidence. Our team is skilled across a
                broad spectrum of technologies, including cloud computing,
                DevOps automation, enterprise software development,
                cybersecurity, and AI-driven solutions. Whether it’s building
                scalable applications, optimizing IT infrastructure, or
                delivering agile project management, we deliver excellence at
                every step.
              </p>
              <p className="text-lg text-gray-700 mb-6">
                Our capabilities span advanced programming languages, modern
                cloud platforms like AWS, Azure, and GCP, as well as
                cutting-edge tools in data analytics, DevOps pipelines, and
                UI/UX design. We specialize in assembling high-performing teams
                for staff augmentation needs, offering deep expertise in Java,
                .NET, Python, React, Angular, Kubernetes, and more.
              </p>
              <p className="text-lg text-gray-700 mb-6">
                With a commitment to innovation, quality, and speed, Pioneer IT
                Systems stands as a trusted partner for organizations looking to
                scale, modernize, and succeed in a technology-driven world.
              </p>
            </div>
            <div className="relative">
              <div
                className="relative  overflow-hidden shadow-2xl h-96 w-full bg-cover bg-center"
                style={{ backgroundImage: "url('/edit5-min.jpg')" }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <p className="text-white text-lg font-medium">
                    Our talented team driving innovation since 2013
                  </p>
                </div>
              </div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-globixs-secondary/10 rounded-full z-0"></div>
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-globixs-primary/10 rounded-full z-0"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <SectionHeader className="text-center">Why Choose Us</SectionHeader>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyChooseUsFeatures.map((feature, index) => (
              <ModernCard
                key={index}
                className="group hover:shadow-xl transition-all duration-300"
              >
                <div className="mb-4 text-globixs-primary/80 group-hover:text-globixs-primary transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-3 group-hover:text-globixs-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </ModernCard>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section - Updated as per requirements */}
      <section className="bg-white/90 backdrop-blur-sm p-6 sm:p-8 shadow-sm border border-slate-100 h-full">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <Stat value="10+" label="Years Experience" delay={0} />
            <Stat value="150+" label="Consultants Placed" delay={200} />
            <Stat value="98%" label="Client Satisfaction Rate" delay={400} />
            <Stat value="40+" label="Technologies Expertise" delay={600} />
          </div>
        </div>
      </section>

      {/* Vision & Mission - Note: Content to be reviewed with Venkat and Manu */}
      <section id="vision" className="py-24 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <SectionHeader className="text-center">
              Our Vision & Mission
            </SectionHeader>
            <p className="text-lg text-gray-700">
              Guiding our work every day is our vision to enrich life through
              communication and our mission to create maximum value for our
              customers.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="relative overflow-hidden  shadow-lg">
              <div className="bg-globixs-primary h-full p-8 relative z-10">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mt-10 -mr-10 z-0"></div>
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/5 rounded-full -mb-10 -ml-10 z-0"></div>

                <h3 className="text-3xl text-white mb-6 font-normal">Vision</h3>
                <p className="text-xl text-white/90 relative z-10 mb-8">
                  To enrich life through communication
                </p>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16 text-white/20 absolute bottom-4 right-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              </div>
            </div>

            <div className="relative overflow-hidden  shadow-lg">
              <div className="bg-globixs-secondary h-full p-8 relative z-10">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mt-10 -mr-10 z-0"></div>
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/5 rounded-full -mb-10 -ml-10 z-0"></div>

                <h3 className="text-3xl text-white mb-6 font-normal">
                  Mission
                </h3>
                <p className="text-xl text-white/90 relative z-10 mb-4">
                  To focus on our customer&apos;s challenges and needs by
                  providing excellent ICT solutions and services in order to
                  consistently create maximum value for our customers.
                </p>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16 text-white/20 absolute bottom-4 right-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values - Moved to About Us section as requested */}
      <section id="values" className="py-24 bg-globixs-bgAccent">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <SectionHeader className="text-center">Core Values</SectionHeader>
            <p className="text-lg text-gray-700">
              Our core values are deeply rooted in every aspect of our business.
              They are the internal driving force for the Company and are our
              commitments to the ecosystem.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {valueItems.map((item, index) => (
              <ModernCard
                key={index}
                className="group hover:shadow-xl transition-all duration-300"
              >
                <div className="mb-4 text-globixs-primary/80 group-hover:text-globixs-primary transition-colors">
                  {item.icon}
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-3 group-hover:text-globixs-primary transition-colors">
                  {item.title}
                </h3>
                <p className="text-gray-600">{item.description}</p>
              </ModernCard>
            ))}
          </div>
        </div>
      </section>

      {/* Case Study Section */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block bg-gradient-to-r from-globixs-primary/20 to-globixs-secondary/20 px-4 py-1 rounded-full mb-6">
              <span className="text-globixs-primary font-medium text-sm">
                Success Story
              </span>
            </div>
            <h3 className="text-2xl md:text-3xl text-gray-800 font-medium mb-6">
              How We Became a Trusted Growth Partner for a Mid-Sized Tech Firm
            </h3>
            <p className="text-lg text-gray-700 leading-relaxed mb-8">
              By deeply aligning with the client&apos;s goals, culture, and
              roadmap, we provided high-performing tech talent and embedded
              teams that helped them reduce time-to-market by 35% and scale
              efficiently across geographies.
            </p>
            <div className="flex items-center justify-center">
              <div className="w-20 h-1 bg-globixs-primary/30 mr-4"></div>
              <div className="py-3 px-6 rounded-full bg-gradient-to-r from-globixs-primary/10 to-globixs-secondary/10">
                <p className="text-globixs-primary font-medium">
                  35% Faster Time-to-Market
                </p>
              </div>
              <div className="w-20 h-1 bg-globixs-primary/30 ml-4"></div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
