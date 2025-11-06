'use client';

import React, { useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { ArrowLeft, Mail } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
} from '@/components/ui/toast';

const ForgotPasswordPage: React.FC = () => {
  const router = useRouter();

  const { ref: heroRef, inView: heroInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const { ref: formRef, inView: formInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [email, setEmail] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Email validation
      const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
      if (!emailRegex.test(email)) {
        setError('Please enter a valid email address');
        setToastMessage('Please enter a valid email address');
        setIsLoading(false);
        return;
      }

      // Send request to reset password API
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setToastMessage('Password reset link has been sent to your email');

        // Clear the form
        setEmail('');

        // Redirect to login page after a delay
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      } else {
        setError(data.message || 'Failed to send password reset email');
        setToastMessage(data.message || 'Failed to send password reset email');
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again.');
      setToastMessage('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ToastProvider>
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
                  <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-contact-purple to-contact-teal opacity-70 blur"></div>
                  <div className="relative px-6 py-2 bg-white rounded-full text-sm font-normal text-gray-800">
                    Account Recovery
                  </div>
                </div>
              </div>

              <h1 className="text-5xl md:text-7xl font-normal mb-6 gradient-text leading-tight">
                Forgot Password
              </h1>
              <p className="text-xl text-gray-700 mb-12 max-w-3xl mx-auto">
                Enter your email address and we&apos;ll send you a link to reset
                your password.
              </p>
            </div>
          </div>
        </section>

        {/* Form Section */}
        <section className="py-16 bg-white/90 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <div
              ref={formRef}
              className={`max-w-md mx-auto transition-all duration-1000 ${
                formInView
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-12'
              }`}
            >
              <Link href="/login">
                <Button variant="outline" className="mb-6">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Login
                </Button>
              </Link>

              <Card className="border shadow-lg">
                <CardContent className="p-8">
                  <div className="flex items-center justify-center mb-6">
                    <div className="w-16 h-16 bg-contact-purple/10 rounded-full flex items-center justify-center text-contact-purple">
                      <Mail className="h-8 w-8" />
                    </div>
                  </div>

                  <h2 className="text-2xl font-medium text-center mb-8">
                    Reset Your Password
                  </h2>

                  {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 text-sm">
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your.email@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={isLoading}
                      />
                      <p className="text-xs text-gray-500">
                        Enter the email address associated with your account.
                      </p>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-contact-purple to-contact-teal text-white"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Sending...' : 'Send Reset Link'}
                    </Button>
                  </form>

                  <div className="mt-6 text-center">
                    <p className="text-gray-600">
                      Remember your password?{' '}
                      <Link
                        href="/login"
                        className="text-contact-purple hover:underline"
                      >
                        Back to Login
                      </Link>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {toastMessage && (
          <Toast>
            <ToastTitle>
              {toastMessage.includes('has been sent') ? 'Success' : 'Error'}
            </ToastTitle>
            <ToastDescription>{toastMessage}</ToastDescription>
            <ToastClose onClick={() => setToastMessage(null)} />
          </Toast>
        )}
        <ToastViewport />
      </>
    </ToastProvider>
  );
};

export default ForgotPasswordPage;
