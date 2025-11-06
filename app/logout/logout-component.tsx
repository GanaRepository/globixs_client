// app/logout/logout-component.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import {
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
} from '@/components/ui/toast';
import useSessionStore from '@/stores/useSessionStore';

export default function LogoutPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const logout = useSessionStore((state) => state.logout);

  // Only run the logout logic once on component mount
  useEffect(() => {
    const performLogout = async () => {
      try {
        // First clear the Zustand store state
        await logout();

        // Show success message
        setToastMessage('Successfully logged out');

        // Navigate to home page after a short delay
        setTimeout(() => {
          window.location.href = '/';
        }, 1500);
      } catch (error) {
        console.error('Logout error:', error);
        setError('An error occurred during logout');
        setToastMessage('An error occurred while logging out');

        // Even if there's an error, redirect to home
        setTimeout(() => {
          window.location.href = '/';
        }, 1500);
      } finally {
        setIsLoading(false);
      }
    };

    performLogout();
  }, [logout]);

  return (
    <ToastProvider>
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-full max-w-md">
          <div className="relative mb-8">
            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-contact-purple to-contact-teal opacity-70 blur"></div>
            <div className="relative px-6 py-2 bg-white rounded-full text-sm font-normal text-gray-800 text-center">
              Account Security
            </div>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="flex flex-col items-center justify-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-r from-contact-purple to-contact-teal rounded-full flex items-center justify-center text-white mb-4">
                <LogOut size={32} />
              </div>
              <h1 className="text-3xl font-semibold text-center">Log Out</h1>
              <p className="text-gray-600 text-center mt-2">
                {isLoading
                  ? 'Logging you out...'
                  : error || 'You have been logged out successfully.'}
              </p>
            </div>

            <div className="flex justify-center mt-6">
              {isLoading ? (
                <div className="animate-spin h-8 w-8 border-4 border-[#7E69AB] border-t-transparent rounded-full"></div>
              ) : (
                !error && (
                  <svg
                    className="w-12 h-12 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                )
              )}
            </div>
          </div>
        </div>

        {toastMessage && (
          <Toast>
            <ToastTitle>{error ? 'Error' : 'Success'}</ToastTitle>
            <ToastDescription>{toastMessage}</ToastDescription>
            <ToastClose onClick={() => setToastMessage(null)} />
          </Toast>
        )}
        <ToastViewport />
      </div>
    </ToastProvider>
  );
}
