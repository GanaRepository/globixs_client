// 'use client';

// import React, { useState } from 'react';
// import { useInView } from 'react-intersection-observer';
// import { ArrowLeft, UserCircle, Eye, EyeOff } from 'lucide-react';
// import Link from 'next/link';
// import { signIn, signOut, getSession } from 'next-auth/react';
// import { useRouter } from 'next/navigation';

// import { Button } from '@/components/ui/button';
// import { Card, CardContent } from '@/components/ui/card';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import {
//   ToastProvider,
//   ToastViewport,
//   Toast,
//   ToastTitle,
//   ToastDescription,
//   ToastClose,
// } from '@/components/ui/toast';

// import useSessionStore from '@/stores/useSessionStore';

// const EmployeeLoginPage: React.FC = () => {
//   const router = useRouter();
//   const fetchSession = useSessionStore((state) => state.fetchSession);

//   const { ref: heroRef, inView: heroInView } = useInView({
//     triggerOnce: true,
//     threshold: 0.1,
//   });

//   const { ref: formRef, inView: formInView } = useInView({
//     triggerOnce: true,
//     threshold: 0.1,
//   });

//   const [email, setEmail] = useState<string>('');
//   const [password, setPassword] = useState<string>('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string>('');
//   const [toastVisible, setToastVisible] = useState(false);
//   const [toastMessage, setToastMessage] = useState('');
//   const [toastType, setToastType] = useState<'default' | 'destructive'>(
//     'default'
//   );

//   const showToast = (message: string, type: 'default' | 'destructive') => {
//     setToastMessage(message);
//     setToastType(type);
//     setToastVisible(true);

//     // Auto-hide toast after 5 seconds
//     setTimeout(() => {
//       setToastVisible(false);
//     }, 5000);
//   };

//   const togglePasswordVisibility = () => {
//     setShowPassword(!showPassword);
//   };

//   const handleLoginSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setError('');

//     try {
//       const result = await signIn('credentials', {
//         redirect: false,
//         email,
//         password,
//         callbackUrl: '/login/employee', // This helps identify the login portal
//       });

//       if (result?.error) {
//         setError(result.error);
//         showToast(`Login Failed: ${result.error}`, 'destructive');
//       } else if (result?.ok) {
//         // Fetch session to update store
//         await fetchSession();

//         // Get the session to check if the user has the correct role
//         const session = await getSession();

//         if (session?.user?.role !== 'employee') {
//           // Should not happen if the backend is validating correctly
//           showToast('Incorrect account type for this portal', 'destructive');

//           // Sign out immediately
//           await signOut({ redirect: false });

//           setTimeout(() => {
//             // Redirect back to login selection
//             router.push('/login');
//           }, 1500);
//           return;
//         }

//         showToast('Login successful! Redirecting to timesheet...', 'default');

//         // Redirect to timesheet
//         setTimeout(() => {
//           router.push('/employee/timesheet');
//         }, 1000);
//       }
//     } catch (error) {
//       setError('An unexpected error occurred. Please try again.');
//       showToast('Login Failed: An unexpected error occurred', 'destructive');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <ToastProvider>
//       {/* Hero Section */}
//       <section className="relative overflow-hidden pt-24 pattern-bg">
//         <div className="container mx-auto px-4 py-12 sm:py-16 md:py-24 relative z-10">
//           <div
//             ref={heroRef}
//             className={`max-w-5xl mx-auto text-center transition-all duration-1000 ${
//               heroInView
//                 ? 'opacity-100 translate-y-0'
//                 : 'opacity-0 translate-y-12'
//             }`}
//           >
//             <div className="inline-block mb-8">
//               <div className="relative inline-flex items-center justify-center">
//                 <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-contact-purple to-contact-teal opacity-70 blur"></div>
//                 <div className="relative px-6 py-2 bg-white rounded-full text-sm font-normal text-gray-800">
//                   Employee Access
//                 </div>
//               </div>
//             </div>

//             <h1 className="text-5xl md:text-7xl font-normal mb-6 gradient-text leading-tight">
//               Employee Login
//             </h1>
//             <p className="text-xl text-gray-700 mb-12 max-w-3xl mx-auto">
//               Access your personal dashboard to manage timesheets and view
//               company resources.
//             </p>
//           </div>
//         </div>
//       </section>

//       {/* Login Form Section */}
//       <section className="py-16 bg-white/90 backdrop-blur-sm">
//         <div className="container mx-auto px-4">
//           <div
//             ref={formRef}
//             className={`max-w-md mx-auto transition-all duration-1000 ${
//               formInView
//                 ? 'opacity-100 translate-y-0'
//                 : 'opacity-0 translate-y-12'
//             }`}
//           >
//             <Link href="/login">
//               <Button variant="outline" className="mb-6">
//                 <ArrowLeft className="mr-2 h-4 w-4" /> Back to options
//               </Button>
//             </Link>

//             <Card className="border shadow-lg">
//               <CardContent className="p-8">
//                 <div className="flex items-center justify-center mb-6">
//                   <div className="w-16 h-16 bg-contact-purple/10 rounded-full flex items-center justify-center text-contact-purple">
//                     <UserCircle className="h-8 w-8" />
//                   </div>
//                 </div>

//                 <h2 className="text-2xl font-medium text-center mb-8">
//                   Employee Login
//                 </h2>

//                 {error && (
//                   <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 text-sm">
//                     {error}
//                   </div>
//                 )}

//                 <form onSubmit={handleLoginSubmit} className="space-y-6">
//                   <div className="space-y-2">
//                     <Label htmlFor="employee-email">Email</Label>
//                     <Input
//                       id="employee-email"
//                       type="email"
//                       placeholder="your.name@example.com"
//                       value={email}
//                       onChange={(e) => setEmail(e.target.value)}
//                       required
//                       disabled={isLoading}
//                     />
//                   </div>

//                   <div className="space-y-2">
//                     <Label htmlFor="employee-password">Password</Label>
//                     <div className="relative">
//                       <Input
//                         id="employee-password"
//                         type={showPassword ? 'text' : 'password'}
//                         placeholder="Enter your password"
//                         value={password}
//                         onChange={(e) => setPassword(e.target.value)}
//                         required
//                         disabled={isLoading}
//                         className="pr-10"
//                       />
//                       <button
//                         type="button"
//                         className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-contact-purple transition-colors"
//                         onClick={togglePasswordVisibility}
//                         tabIndex={-1}
//                       >
//                         {showPassword ? (
//                           <EyeOff size={18} />
//                         ) : (
//                           <Eye size={18} />
//                         )}
//                       </button>
//                     </div>
//                   </div>

//                   <Button
//                     type="submit"
//                     className="w-full bg-gradient-to-r from-contact-purple to-contact-teal text-white"
//                     disabled={isLoading}
//                   >
//                     {isLoading ? (
//                       <span className="flex items-center justify-center">
//                         <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
//                         Signing in...
//                       </span>
//                     ) : (
//                       'Sign In'
//                     )}
//                   </Button>
//                 </form>

//                 <div className="mt-6 text-center">
//                   <p className="text-sm text-gray-500 mt-4">
//                     By signing in, you agree to our{' '}
//                     <Link
//                       href="/terms-of-service"
//                       className="text-contact-purple hover:underline"
//                     >
//                       Terms of Service
//                     </Link>{' '}
//                     and{' '}
//                     <Link
//                       href="/privacy-policy"
//                       className="text-contact-purple hover:underline"
//                     >
//                       Privacy Policy
//                     </Link>
//                   </p>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       </section>

//       {/* Toast Notification */}
//       {toastVisible && (
//         <Toast
//           variant={toastType}
//           className={`fixed top-4 right-4 z-50 w-auto max-w-md ${
//             toastType === 'default'
//               ? 'bg-contact-purple/10 border-contact-purple'
//               : 'bg-red-950 border-red-500'
//           }`}
//         >
//           <div className="flex">
//             <div className="flex-1">
//               <ToastTitle
//                 className={
//                   toastType === 'default'
//                     ? 'text-contact-purple'
//                     : 'text-red-300'
//                 }
//               >
//                 {toastType === 'default' ? 'Success' : 'Error'}
//               </ToastTitle>
//               <ToastDescription className="text-gray-700 dark:text-white">
//                 {toastMessage}
//               </ToastDescription>
//             </div>
//             <ToastClose
//               onClick={() => setToastVisible(false)}
//               className="opacity-100 text-gray-700 dark:text-white hover:text-gray-500"
//             />
//           </div>
//         </Toast>
//       )}
//       <ToastViewport />
//     </ToastProvider>
//   );
// };

// export default EmployeeLoginPage;

// File: app/login/employee/page.tsx
import { Metadata, Viewport } from 'next';
import EmployeeLoginContent from './EmployeeLoginContent';

export const viewport: Viewport = {
  themeColor: '#0a192f',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://www.globixs.com'),
  title: 'Employee Login | Globixs - Access Your Dashboard',
  description:
    'Access your Globixs employee dashboard to manage timesheets, view company resources, and connect with your team members and clients.',
  keywords: [
    'Globixs',
    'employee login',
    'staff portal',
    'timesheet management',
    'employee dashboard',
    'IT company resources',
    'tech employee portal',
    'internal systems access',
    'staff login',
    'company portal',
    'employee resources',
    'IT timesheet system',
    'tech staff login',
    'employee access',
    'workforce management',
    'internal communications',
  ],
  authors: [{ name: 'Globixs', url: 'https://www.globixs.com' }],
  creator: 'Globixs',
  publisher: 'Globixs',
  openGraph: {
    title: 'Employee Login | Globixs - Access Your Dashboard',
    description:
      'Access your Globixs employee dashboard to manage timesheets, view company resources, and connect with your team members and clients.',
    url: 'https://www.globixs.com/login/employee',
    siteName: 'Globixs',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: '/employee-login-og.jpg', // Update with your actual image path
        width: 1200,
        height: 630,
        alt: 'Globixs - Employee Login',
      },
    ],
  },
  alternates: {
    canonical: 'https://www.globixs.com/login/employee',
    languages: {
      'en-US': 'https://www.globixs.com/login/employee',
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
    nocache: true,
  },
  category: 'Technology',
  appleWebApp: {
    capable: true,
    title: 'Globixs',
    statusBarStyle: 'black-translucent',
  },
  formatDetection: {
    telephone: true,
    date: false,
    address: true,
    email: true,
  },
  other: {
    'google-site-verification': 'your-verification-code',
  },
  appLinks: {
    web: {
      url: 'https://www.globixs.com',
      should_fallback: true,
    },
  },
  verification: {
    google: 'your-verification-code',
  },
};

export default function EmployeeLoginPage() {
  return <EmployeeLoginContent />;
}
