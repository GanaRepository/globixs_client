'use client';

import { useState, useEffect, Suspense } from 'react';
import { useInView } from 'react-intersection-observer';
import { ArrowLeft, Lock, EyeOff, Eye } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

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

// Loading fallback component
function ResetPasswordFallback() {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="w-16 h-16 bg-globixs-primary/10 rounded-full flex items-center justify-center text-globixs-primary mb-6">
        <div className="animate-spin h-8 w-8 border-4 border-globixs-primary/30 border-t-globixs-primary rounded-full"></div>
      </div>
      <h2 className="text-2xl font-medium text-center mb-2">Loading</h2>
      <p className="text-gray-500">Retrieving your reset information...</p>
    </div>
  );
}

// Component that uses useSearchParams
function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const { ref: heroRef, inView: heroInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const { ref: formRef, inView: formInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Redirect if no token is present
  useEffect(() => {
    if (!token) {
      setToastMessage('Invalid or missing reset token');
      setTimeout(() => {
        router.push('/forgot-password');
      }, 2000);
    }
  }, [token, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      setError('Missing reset token');
      setToastMessage('Missing reset token');
      return;
    }

    setIsLoading(true);
    setError('');

    // Password validation
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      setError(
        'Password must be at least 8 characters and include uppercase, lowercase, number, and special character'
      );
      setToastMessage(
        'Password must be at least 8 characters and include uppercase, lowercase, number, and special character'
      );
      setIsLoading(false);
      return;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setToastMessage('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      // Send request to reset password API
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setToastMessage(
          'Password has been reset successfully! You can now log in with your new password.'
        );

        // Clear the form
        setPassword('');
        setConfirmPassword('');

        // Redirect to login page after a delay
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      } else {
        setError(data.message || 'Failed to reset password');
        setToastMessage(data.message || 'Failed to reset password');
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again.');
      setToastMessage('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

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
                  Security
                </div>
              </div>
            </div>

            <h1 className="text-5xl md:text-7xl font-normal mb-6 gradient-text leading-tight">
              Reset Password
            </h1>
            <p className="text-xl text-gray-700 mb-12 max-w-3xl mx-auto">
              Create a new password for your account.
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
                  <div className="w-16 h-16 bg-globixs-primary/10 rounded-full flex items-center justify-center text-globixs-primary">
                    <Lock className="h-8 w-8" />
                  </div>
                </div>

                <h2 className="text-2xl font-medium text-center mb-8">
                  Create New Password
                </h2>

                {error && (
                  <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 text-sm">
                    {error}
                  </div>
                )}

                {!token ? (
                  <div className="text-center py-4">
                    <p className="text-gray-500 mb-4">
                      Invalid or missing reset token.
                    </p>
                    <Link href="/forgot-password">
                      <Button variant="outline">Request New Reset Link</Button>
                    </Link>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="password">New Password</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Enter your new password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          disabled={isLoading}
                          className="pr-10"
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                      <p className="text-xs text-gray-500">
                        Password must be at least 8 characters and include
                        uppercase, lowercase, number, and special character.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">
                        Confirm New Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? 'text' : 'password'}
                          placeholder="Confirm your new password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                          disabled={isLoading}
                          className="pr-10"
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-globixs-primary to-globixs-secondary text-white"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Resetting Password...' : 'Reset Password'}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {toastMessage && (
        <Toast>
          <ToastTitle>
            {toastMessage.includes('success') ? 'Success' : 'Error'}
          </ToastTitle>
          <ToastDescription>{toastMessage}</ToastDescription>
          <ToastClose onClick={() => setToastMessage(null)} />
        </Toast>
      )}
      <ToastViewport />
    </>
  );
}

// Main component with Suspense boundary
export default function ResetPasswordPage() {
  return (
    <ToastProvider>
      <div className="min-h-screen bg-slate-50">
        <div className="fixed top-0 right-0 w-1/3 h-screen bg-gradient-to-b from-globixs-primary/5 to-globixs-secondary/5 -z-10"></div>
        <div className="fixed top-20 left-10 w-64 h-64 bg-globixs-primary/10 rounded-full filter blur-3xl animate-float -z-10"></div>
        <div
          className="fixed bottom-20 right-10 w-64 h-64 bg-globixs-secondary/10 rounded-full filter blur-3xl animate-float -z-10"
          style={{ animationDelay: '2s' }}
        ></div>

        <Suspense fallback={<ResetPasswordFallback />}>
          <ResetPasswordContent />
        </Suspense>
      </div>
    </ToastProvider>
  );
}
