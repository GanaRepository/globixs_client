'use client';

import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { Code, Users, Package, Settings, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import HeroSection from './HeroSection';

export default function ServicesContent(): JSX.Element {
  const { ref: featuresRef, inView: featuresInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Handle hash navigation with proper offset
  useEffect(() => {
    // Add scroll-padding to the document to account for the fixed header
    document.documentElement.style.scrollPadding = '100px 0 0 0';

    // Check if there's a hash in the URL
    if (window.location.hash) {
      // Get the element
      const id = window.location.hash.substring(1);
      const element = document.getElementById(id);

      if (element) {
        // Add a slight delay to ensure DOM is fully loaded
        setTimeout(() => {
          // Get the header height (assuming 80px, adjust as needed)
          const headerOffset = 100;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition =
            elementPosition + window.pageYOffset - headerOffset;

          // Scroll to the element with the offset
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth',
          });
        }, 300);
      }
    }
  }, []);

  // Updated services based on the provided content
  const services = [
    {
      id: 'staffing',
      icon: <Users />,
      title: 'Technology Staff Augmentation',
      description:
        'Finding the right talent at the right time is crucial. Our Technology Staff Augmentation services help you quickly scale your teams with highly skilled professionals across software development, cloud engineering, DevOps, cybersecurity, and more. Whether you need short-term support or long-term contributors, we deliver talent that fits your technical and cultural needs.',
      color: 'bg-gradient-to-br from-amber-500/80 to-orange-600/80',
      imageUrl: '/imag5.jpg',
    },
    {
      id: 'consulting',
      icon: <Code />,
      title: 'IT Consulting',
      description:
        'From strategy to execution, we guide businesses through complex technology decisions. Our IT Consulting services offer actionable insights, roadmap development, system modernization strategies, and digital transformation advisory. We work closely with stakeholders to turn challenges into opportunities and future-proof your IT landscape.',
      color: 'bg-gradient-to-br from-indigo-500/80 to-purple-600/80',
      imageUrl: '/image7.jpg',
    },
    {
      id: 'devops',
      icon: <Settings />,
      title: 'DevOps',
      description:
        'Accelerate your software delivery and operational excellence with our DevOps expertise. We help companies implement CI/CD pipelines, automate infrastructure, improve deployment processes, and enhance system reliability. Our DevOps services are designed to drive collaboration, agility, and faster innovation cycles across your technology teams.',
      color: 'bg-gradient-to-br from-sky-500/80 to-blue-600/80',
      imageUrl: '/devops.jpg',
    },
    {
      id: 'development',
      icon: <Package />,
      title: 'Software Development ',
      description:
        'We design and build scalable, high-performance software solutions tailored to your unique business needs. Whether it&apos;s custom applications, SaaS platforms, mobile solutions, or enterprise integrations, our Software Development services deliver quality, speed, and adaptability. We leverage the latest technologies and agile methodologies to turn ideas into impactful products.',
      color: 'bg-gradient-to-br from-emerald-500/80 to-teal-600/80',
      imageUrl: '/image12.jpg',
    },
  ];

  return (
    <div>
      <HeroSection />

      {/* Introduction Section */}
      <section className="pt-12 md:pt-20 bg-globixs-bgAccent">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-5xl mb-6 md:mb-8 text-center gradient-text">
              Adaptive Technology Solutions
            </h2>
            <div className="text-base md:text-lg text-gray-700 space-y-4">
              <p>
                Technology is evolving faster than ever before — redefining how
                industries operate, innovate, and deliver value. From
                cloud-native applications to AI-driven business models,
                companies must constantly adapt to new ways of working to stay
                competitive. Digital transformation is no longer optional,
                it&apos;s the foundation for survival and growth. To succeed in
                this environment, businesses need agile partners who can keep
                pace with change and help them shape future-ready solutions.
              </p>
              <p>
                At Globixs Technology Solutions, we combine deep technical abilities with hands-on
                industry experience to complement our client&apos;s efforts at
                every stage of their technology journey. We don&apos;t just
                build solutions. we help organizations engineer sustainable
                success - designing systems and processes that stand the test of
                time, scale with ambition, and evolve alongside the market.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section - Responsive alternating layout */}
      <section className="py-12 md:py-20 bg-globixs-bgAccent backdrop-blur-sm relative">
        <div className="container mx-auto px-4 relative">
          <div
            ref={featuresRef}
            className={`space-y-8 md:space-y-12 transition-all duration-1000 ${
              featuresInView
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-12'
            }`}
          >
            {services.map((service, index) => (
              <div
                key={index}
                id={service.id}
                className="bg-white  shadow-lg overflow-hidden"
              >
                {/* Mobile layout - always stack content vertically */}
                <div className="flex flex-col md:hidden">
                  <div className="h-56 relative">
                    <Image
                      src={service.imageUrl}
                      alt={service.title}
                      fill
                      className="object-cover"
                    />
                    <div
                      className={`absolute top-4 left-4 p-3 rounded-lg ${service.color}`}
                    >
                      <div className="text-white">{service.icon}</div>
                    </div>
                  </div>

                  <div className="p-6 flex flex-col justify-center">
                    <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                    <p className="text-gray-600 mb-6">{service.description}</p>
                  </div>
                </div>

                {/* Desktop layout - alternating sides */}
                <div
                  className={`hidden md:flex flex-row ${index % 2 !== 0 ? 'flex-row-reverse' : ''} h-80`}
                >
                  <div className="w-1/2 h-full relative">
                    <Image
                      src={service.imageUrl}
                      alt={service.title}
                      fill
                      className="object-cover"
                    />
                    <div
                      className={`absolute top-4 ${index % 2 !== 0 ? 'right-4' : 'left-4'} p-3 rounded-lg ${service.color}`}
                    >
                      <div className="text-white">{service.icon}</div>
                    </div>
                  </div>

                  <div className="w-1/2 p-8 flex flex-col justify-center">
                    <h3 className="text-2xl font-bold mb-3">{service.title}</h3>
                    <p className="text-gray-600 mb-6">{service.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-sm sm:text-base md:text-lg text-gray-700 space-y-4 max-w-7xl mx-auto px-4 pt-8 sm:pt-12 md:pt-20 bg-globixs-bgAccent">
          At Globixs Technology Solutions, we don&apos;t just deliver services — we deliver
          possibilities. With a deep commitment to innovation, quality, and
          partnership, we help you unlock new opportunities, overcome complex
          challenges, and build a resilient digital future. Wherever you are on
          your technology journey, we&apos;re ready to move forward with you.
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
              Delivering Agile Talent at Scale for a Global Healthcare Provider
            </h3>
            <p className="text-lg text-gray-700 leading-relaxed mb-8">
              Faced with a rapid digital transformation mandate, our client
              turned to us for technology staff augmentation. We onboarded
              skilled engineers across data, cloud, and automation in just 3
              weeks — keeping patient systems running and innovation on track.
            </p>
            <div className="flex items-center justify-center">
              <div className="w-20 h-1 bg-globixs-primary/30 mr-4"></div>
              <div className="py-3 px-6 rounded-full bg-gradient-to-r from-globixs-primary/10 to-globixs-secondary/10">
                <p className="text-globixs-primary font-medium">
                  3-Week Talent Onboarding
                </p>
              </div>
              <div className="w-20 h-1 bg-globixs-primary/30 ml-4"></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
