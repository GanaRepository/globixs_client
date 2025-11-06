'use client';

import React, { useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { ArrowLeft, Building, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

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

const BusinessLoginContent: React.FC = () => {
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
  const [password, setPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Use NextAuth's signIn function
      const result = await signIn('credentials', {
        redirect: false, // Don't redirect automatically
        email,
        password,
      });

      if (result?.error) {
        setError(result.error);
        setToastMessage(`Login Failed: ${result.error}`);
      } else if (result?.ok) {
        // Show success toast
        setToastMessage('Login successful! Redirecting to homepage...');

        // Redirect to homepage after a short delay
        setTimeout(() => {
          router.push('/');
        }, 1500);
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again.');
      setToastMessage('Login Failed: An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ToastProvider>
      <>
        {/* Hero Section */}
        {/* <section className="relative overflow-hidden pt-24">
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
                    Business Access
                  </div>
                </div>
              </div>

              <h1 className="text-5xl md:text-7xl font-normal mb-6 gradient-text leading-tight">
                Business Portal
              </h1>
              <p className="text-xl text-gray-700 mb-12 max-w-3xl mx-auto">
                Access your business account to manage recruitment and staffing
                services.
              </p>
            </div>
          </div>
        </section> */}

        {/* Login Form Section */}
        <section className="py-16 bg-white/90 backdrop-blur-sm pt-28">
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
                  ← Back to options
                </Button>
              </Link>

              <Card className="border shadow-lg">
                <CardContent className="p-8">
                  <div className="flex items-center justify-center mb-6">
                    <div className="w-16 h-16 bg-contact-purple/10 rounded-full flex items-center justify-center text-contact-purple">
                      <Building className="h-8 w-8" />
                    </div>
                  </div>

                  <h2 className="text-2xl font-medium text-center mb-8">
                    Business Portal
                  </h2>

                  {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 text-sm">
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleLoginSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="business-email">Email</Label>
                      <Input
                        id="business-email"
                        type="email"
                        placeholder="your.business@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value.toLowerCase())}
                        required
                        disabled={isLoading}
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label htmlFor="business-password">Password</Label>
                        <Link
                          href="/forgot-password"
                          className="text-sm text-contact-purple hover:underline"
                        >
                          Forgot password?
                        </Link>
                      </div>
                      <div className="relative">
                        <Input
                          id="business-password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Enter your password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          disabled={isLoading}
                          className="pr-10"
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-contact-purple transition-colors"
                          onClick={togglePasswordVisibility}
                          tabIndex={-1}
                        >
                          {showPassword ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </button>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-contact-purple to-contact-teal text-white"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Accessing...' : 'Access Portal'}
                    </Button>
                  </form>

                  <div className="mt-6 text-center">
                    <p className="text-gray-600">
                      Not registered yet?{' '}
                      <Link
                        href="/register/business"
                        className="text-contact-purple hover:underline"
                      >
                        Sign Up
                      </Link>
                    </p>
                    <p className="text-sm text-gray-500 mt-4">
                      By signing in, you agree to our{' '}
                      <Link
                        href="/terms-of-service"
                        className="text-contact-purple hover:underline"
                      >
                        Terms of Service
                      </Link>{' '}
                      and{' '}
                      <Link
                        href="/privacy-policy"
                        className="text-contact-purple hover:underline"
                      >
                        Privacy Policy
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
              {toastMessage.startsWith('Login Failed')
                ? 'Login Failed'
                : 'Success'}
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

export default BusinessLoginContent;
