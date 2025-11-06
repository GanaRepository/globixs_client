'use client';

import React from 'react';
import { useInView } from 'react-intersection-observer';
import { Building, User, ArrowRight, UserCircle } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

type LoginOption = {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  link: string;
};

const LoginPage: React.FC = () => {
  const { ref: heroRef, inView: heroInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const { ref: cardsRef, inView: cardsInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const loginOptions: LoginOption[] = [
    {
      id: 'candidate',
      title: 'Candidate',
      description:
        'For job seekers looking to apply for positions or manage their application profile.',
      icon: <User className="h-8 w-8" />,
      link: '/login/candidate',
    },
    {
      id: 'business',
      title: 'Business Portal',
      description:
        'For organizations and consultants working with our staffing and recruitment services.',
      icon: <Building className="h-8 w-8" />,
      link: '/login/business',
    },
    {
      id: 'employee',
      title: 'Employee',
      description:
        'For staff members to manage timesheets and access company resources.',
      icon: <UserCircle className="h-8 w-8" />,
      link: '/login/employee',
    },
  ];

  return (
    <>
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
                <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-globixs-primary to-globixs-secondary opacity-70 blur"></div>
                <div className="relative px-6 py-2 bg-white rounded-full text-sm font-normal text-gray-800">
                  Account Access
                </div>
              </div>
            </div>

            <h1 className="text-5xl md:text-7xl font-normal mb-6 gradient-text leading-tight">
              Login to Your Portal
            </h1>
            <p className="text-xl text-gray-700 mb-12 max-w-3xl mx-auto">
              Select your account type below to access your personalized
              dashboard.
            </p>
          </div>
        </div>
      </section>

      {/* Login Options Section */}
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {loginOptions.map((option, index) => (
                <Card
                  key={option.id}
                  className="border shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <CardContent className="p-8 flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-globixs-primary/10 rounded-full flex items-center justify-center mb-4 text-globixs-primary">
                      {option.icon}
                    </div>
                    <h3 className="text-xl font-medium mb-2">{option.title}</h3>
                    <p className="text-gray-600 mb-6">{option.description}</p>
                    <Link href={option.link} className="w-full">
                      <Button className="w-full professional-button group">
                        Access {option.title} Portal
                        <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>

            <p className="text-center mt-8 text-gray-600">
              Don&apos;t have an account yet?{' '}
              <Link
                href="/register"
                className="text-globixs-primary hover:underline"
              >
                Sign up here
              </Link>
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default LoginPage;
