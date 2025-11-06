// app/register/page.tsx
'use client';

import React, { useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { Building, User, ArrowRight } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

type RegistrationOption = {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  link: string;
};

const RegisterPage: React.FC = () => {
  const { ref: heroRef, inView: heroInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const { ref: cardsRef, inView: cardsInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const registrationOptions: RegistrationOption[] = [
    {
      id: 'candidate',
      title: 'Candidate',
      description:
        'For job seekers looking to apply for positions or manage their application profile.',
      icon: <User className="h-8 w-8" />,
      link: '/register/candidate',
    },
    {
      id: 'business',
      title: 'Business Portal',
      description:
        'For organizations and consultants working with our staffing and recruitment services.',
      icon: <Building className="h-8 w-8" />,
      link: '/register/business',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Decorative elements */}
      <div className="fixed top-0 right-0 w-1/3 h-screen bg-gradient-to-b from-contact-purple/5 to-contact-teal/5 -z-10"></div>
      <div className="fixed top-20 left-10 w-64 h-64 bg-contact-purple/10 rounded-full filter blur-3xl animate-float -z-10"></div>
      <div
        className="fixed bottom-20 right-10 w-64 h-64 bg-contact-teal/10 rounded-full filter blur-3xl animate-float -z-10"
        style={{ animationDelay: '2s' }}
      ></div>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24">
        <div className="container mx-auto px-4 py-12 sm:py-16 md:py-24 relative z-10">
          <div
            ref={heroRef}
            className={`max-w-5xl mx-auto text-center transition-all duration-1000 ${
              heroInView
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-12'
            }`}
          >
            <div className="inline-block mb-8">
              <div className="relative inline-flex items-center justify-center">
                <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-contact-purple to-contact-teal opacity-70 blur"></div>
                <div className="relative px-6 py-2 bg-white rounded-full text-sm font-normal text-gray-800">
                  Registration
                </div>
              </div>
            </div>

            <h1 className="text-5xl md:text-7xl font-normal mb-6 gradient-text leading-tight">
              Create an Account
            </h1>
            <p className="text-xl text-gray-700 mb-12 max-w-3xl mx-auto">
              Select the type of account you&apos;d like to create to get
              started with our services.
            </p>
          </div>
        </div>
      </section>

      {/* Registration Options Section */}
      <section className="py-16 bg-white/90 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div
            ref={cardsRef}
            className={`max-w-5xl mx-auto transition-all duration-1000 ${
              cardsInView
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-12'
            }`}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
              {registrationOptions.map((option, index) => (
                <Card
                  key={option.id}
                  className="border shadow-md hover:shadow-xl transition-all duration-300"
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <CardContent className="p-8 flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-contact-purple/10 rounded-full flex items-center justify-center mb-4 text-contact-purple">
                      {option.icon}
                    </div>
                    <h3 className="text-xl font-medium mb-2">{option.title}</h3>
                    <p className="text-gray-600 mb-6">{option.description}</p>
                    <Link href={option.link} className="w-full">
                      <Button className="w-full bg-gradient-to-r from-contact-purple to-contact-teal text-white group">
                        Register as {option.title}
                        <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>

            <p className="text-center mt-8 text-gray-600">
              Already have an account?{' '}
              <Link
                href="/login"
                className="text-contact-purple hover:underline"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default RegisterPage;
