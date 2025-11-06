'use client';

import React, { useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { ArrowLeft, UserCircle, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { signIn, signOut, getSession } from 'next-auth/react';
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

import useSessionStore from '@/stores/useSessionStore';

const EmployeeLoginContent: React.FC = () => {
  const router = useRouter();
  const fetchSession = useSessionStore((state) => state.fetchSession);

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
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'default' | 'destructive'>(
    'default'
  );

  const showToast = (message: string, type: 'default' | 'destructive') => {
    setToastMessage(message);
    setToastType(type);
    setToastVisible(true);

    // Auto-hide toast after 5 seconds
    setTimeout(() => {
      setToastVisible(false);
    }, 5000);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
        callbackUrl: '/login/employee', // This helps identify the login portal
      });

      if (result?.error) {
        setError(result.error);
        showToast(`Login Failed: ${result.error}`, 'destructive');
      } else if (result?.ok) {
        // Fetch session to update store
        await fetchSession();

        // Get the session to check if the user has the correct role
        const session = await getSession();

        if (session?.user?.role !== 'employee') {
          // Should not happen if the backend is validating correctly
          showToast('Incorrect account type for this portal', 'destructive');

          // Sign out immediately
          await signOut({ redirect: false });

          setTimeout(() => {
            // Redirect back to login selection
            router.push('/login');
          }, 1500);
          return;
        }

        showToast('Login successful! Redirecting to timesheet...', 'default');

        // Redirect to timesheet
        setTimeout(() => {
          router.push('/employee/timesheet');
        }, 1000);
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again.');
      showToast('Login Failed: An unexpected error occurred', 'destructive');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ToastProvider>
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
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to options
              </Button>
            </Link>

            <Card className="border shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-center justify-center mb-6">
                  <div className="w-16 h-16 bg-globixs-primary/10 rounded-full flex items-center justify-center text-globixs-primary">
                    <UserCircle className="h-8 w-8" />
                  </div>
                </div>

                <h2 className="text-2xl font-medium text-center mb-8">
                  Employee Login
                </h2>

                {error && (
                  <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 text-sm">
                    {error}
                  </div>
                )}

                <form onSubmit={handleLoginSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="employee-email">Email</Label>
                    <Input
                      id="employee-email"
                      type="email"
                      placeholder="your.name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value.toLowerCase())}
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="employee-password">Password</Label>
                    <div className="relative">
                      <Input
                        id="employee-password"
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
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-globixs-primary transition-colors"
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
                    className="w-full bg-gradient-to-r from-globixs-primary to-globixs-secondary text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center">
                        <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                        Signing in...
                      </span>
                    ) : (
                      'Sign In'
                    )}
                  </Button>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-500 mt-4">
                    By signing in, you agree to our{' '}
                    <Link
                      href="/terms-of-service"
                      className="text-globixs-primary hover:underline"
                    >
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link
                      href="/privacy-policy"
                      className="text-globixs-primary hover:underline"
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

      {/* Toast Notification */}
      {toastVisible && (
        <Toast
          variant={toastType}
          className={`fixed top-4 right-4 z-50 w-auto max-w-md ${
            toastType === 'default'
              ? 'bg-globixs-primary/10 border-globixs-primary'
              : 'bg-red-950 border-red-500'
          }`}
        >
          <div className="flex">
            <div className="flex-1">
              <ToastTitle
                className={
                  toastType === 'default'
                    ? 'text-globixs-primary'
                    : 'text-red-300'
                }
              >
                {toastType === 'default' ? 'Success' : 'Error'}
              </ToastTitle>
              <ToastDescription className="text-gray-700 dark:text-white">
                {toastMessage}
              </ToastDescription>
            </div>
            <ToastClose
              onClick={() => setToastVisible(false)}
              className="opacity-100 text-gray-700 dark:text-white hover:text-gray-500"
            />
          </div>
        </Toast>
      )}
      <ToastViewport />
    </ToastProvider>
  );
};

export default EmployeeLoginContent;
