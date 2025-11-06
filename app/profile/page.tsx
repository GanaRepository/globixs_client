'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User, Building, Mail, Phone } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
} from '@/components/ui/toast';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-pulse text-center">
          <div className="h-12 w-12 rounded-full bg-gray-300 mx-auto mb-4"></div>
          <div className="h-4 w-32 bg-gray-300 mx-auto mb-2 rounded"></div>
          <div className="h-3 w-24 bg-gray-300 mx-auto rounded"></div>
        </div>
      </div>
    );
  }

  if (!session?.user) {
    return null; // This should not happen due to the redirect
  }

  const isCandidate = session.user.role === 'candidate';
  const isBusiness = session.user.role === 'business';

  return (
    <ToastProvider>
      <div className="min-h-screen bg-gray-50 pt-28 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Profile Header */}
            <div className="bg-gradient-to-r from-contact-purple to-contact-teal p-0.5 rounded-lg shadow-lg mb-6">
              <div className="bg-white rounded-lg p-6 md:p-8">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                  <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-r from-contact-purple to-contact-teal flex items-center justify-center text-white text-2xl font-semibold">
                    {isBusiness ? (
                      <Building size={40} />
                    ) : (
                      <span>
                        {session.user.firstName
                          ? session.user.firstName.charAt(0)
                          : ''}
                        {session.user.lastName
                          ? session.user.lastName.charAt(0)
                          : ''}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <h1 className="text-2xl md:text-3xl font-semibold">
                      {isBusiness
                        ? session.user.companyName
                        : `${session.user.firstName || ''} ${session.user.lastName || ''}`}
                    </h1>
                    <p className="text-gray-500 mt-1 capitalize">
                      {session.user.role}
                    </p>
                    <div className="mt-3 flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                      <div className="flex items-center justify-center md:justify-start">
                        <Mail className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-600">
                          {session.user.email}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Account Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Account Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <dl className="space-y-4">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Email
                      </dt>
                      <dd className="mt-1 text-gray-900">
                        {session.user.email}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Account Type
                      </dt>
                      <dd className="mt-1 text-gray-900 capitalize">
                        {session.user.role}
                      </dd>
                    </div>
                    {isCandidate && (
                      <>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">
                            First Name
                          </dt>
                          <dd className="mt-1 text-gray-900">
                            {session.user.firstName || 'Not set'}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">
                            Last Name
                          </dt>
                          <dd className="mt-1 text-gray-900">
                            {session.user.lastName || 'Not set'}
                          </dd>
                        </div>
                      </>
                    )}
                    {isBusiness && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">
                          Company Name
                        </dt>
                        <dd className="mt-1 text-gray-900">
                          {session.user.companyName || 'Not set'}
                        </dd>
                      </div>
                    )}
                  </dl>
                </CardContent>
              </Card>

              {/* Quick Links */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Quick Links</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {isCandidate && (
                      <Link
                        href="/careers"
                        className="flex items-center p-3 rounded-md hover:bg-gray-50 transition-colors border border-gray-100"
                      >
                        <div className="w-10 h-10 rounded-full bg-contact-purple/10 flex items-center justify-center text-contact-purple mr-4">
                          <User className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-medium">Browse Job Openings</h3>
                          <p className="text-sm text-gray-500">
                            Find and apply for new opportunities
                          </p>
                        </div>
                      </Link>
                    )}
                    {isBusiness && (
                      <Link
                        href="/services"
                        className="flex items-center p-3 rounded-md hover:bg-gray-50 transition-colors border border-gray-100"
                      >
                        <div className="w-10 h-10 rounded-full bg-contact-purple/10 flex items-center justify-center text-contact-purple mr-4">
                          <Building className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-medium">Our Services</h3>
                          <p className="text-sm text-gray-500">
                            Explore recruitment services
                          </p>
                        </div>
                      </Link>
                    )}
                    <Link
                      href="/contact-us"
                      className="flex items-center p-3 rounded-md hover:bg-gray-50 transition-colors border border-gray-100"
                    >
                      <div className="w-10 h-10 rounded-full bg-contact-teal/10 flex items-center justify-center text-contact-teal mr-4">
                        <Phone className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-medium">Contact Us</h3>
                        <p className="text-sm text-gray-500">
                          Inquiry or feedback
                        </p>
                      </div>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {toastMessage && (
          <Toast>
            <ToastTitle>Notification</ToastTitle>
            <ToastDescription>{toastMessage}</ToastDescription>
            <ToastClose onClick={() => setToastMessage(null)} />
          </Toast>
        )}
        <ToastViewport />
      </div>
    </ToastProvider>
  );
}
