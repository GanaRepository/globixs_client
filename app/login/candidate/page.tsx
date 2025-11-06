// 'use client';

// import React, { useState } from 'react';
// import { useInView } from 'react-intersection-observer';
// import { ArrowLeft, Briefcase, Eye, EyeOff } from 'lucide-react';
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';
// import { signIn } from 'next-auth/react';

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

// const CandidateLoginPage: React.FC = () => {
//   const router = useRouter();

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
//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string>('');
//   const [toastMessage, setToastMessage] = useState<string | null>(null);
//   const [showPassword, setShowPassword] = useState<boolean>(false);

//   const togglePasswordVisibility = () => {
//     setShowPassword(!showPassword);
//   };

//   const handleLoginSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setError('');

//     try {
//       // Use NextAuth's signIn function
//       const result = await signIn('credentials', {
//         redirect: false, // Don't redirect automatically
//         email,
//         password,
//       });

//       if (result?.error) {
//         setError(result.error);
//         setToastMessage(`Login Failed: ${result.error}`);
//       } else if (result?.ok) {
//         // Show success toast
//         setToastMessage('Login successful! Redirecting to homepage...');

//         // Redirect to homepage after a short delay
//         setTimeout(() => {
//           router.push('/');
//         }, 1500);
//       }
//     } catch (error) {
//       setError('An unexpected error occurred. Please try again.');
//       setToastMessage('Login Failed: An unexpected error occurred');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <ToastProvider>
//       <>
//         {/* Hero Section */}
//         <section className="relative overflow-hidden pt-24">
//           <div className="container mx-auto px-4 py-12 sm:py-16 md:py-24 relative z-10">
//             <div
//               ref={heroRef}
//               className={`max-w-5xl mx-auto text-center transition-all duration-1000 ${
//                 heroInView
//                   ? 'opacity-100 translate-y-0'
//                   : 'opacity-0 translate-y-12'
//               }`}
//             >
//               <div className="inline-block mb-8">
//                 <div className="relative inline-flex items-center justify-center">
//                   <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-contact-purple to-contact-teal opacity-70 blur"></div>
//                   <div className="relative px-6 py-2 bg-white rounded-full text-sm font-normal text-gray-800">
//                     Candidate Access
//                   </div>
//                 </div>
//               </div>

//               <h1 className="text-5xl md:text-7xl font-normal mb-6 gradient-text leading-tight">
//                 Candidate Login
//               </h1>
//               <p className="text-xl text-gray-700 mb-12 max-w-3xl mx-auto">
//                 Access your candidate profile to apply for jobs and connect with
//                 top employers.
//               </p>
//             </div>
//           </div>
//         </section>

//         {/* Login Form Section */}
//         <section className="py-16 bg-white/90 backdrop-blur-sm">
//           <div className="container mx-auto px-4">
//             <div
//               ref={formRef}
//               className={`max-w-md mx-auto transition-all duration-1000 ${
//                 formInView
//                   ? 'opacity-100 translate-y-0'
//                   : 'opacity-0 translate-y-12'
//               }`}
//             >
//               <Link href="/login">
//                 <Button variant="outline" className="mb-6">
//                   ← Back to options
//                 </Button>
//               </Link>

//               <Card className="border shadow-lg">
//                 <CardContent className="p-8">
//                   <div className="flex items-center justify-center mb-6">
//                     <div className="w-16 h-16 bg-contact-purple/10 rounded-full flex items-center justify-center text-contact-purple">
//                       <Briefcase className="h-8 w-8" />
//                     </div>
//                   </div>

//                   <h2 className="text-2xl font-medium text-center mb-8">
//                     Candidate Login
//                   </h2>

//                   {error && (
//                     <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 text-sm">
//                       {error}
//                     </div>
//                   )}

//                   <form onSubmit={handleLoginSubmit} className="space-y-6">
//                     <div className="space-y-2">
//                       <Label htmlFor="candidate-email">Email</Label>
//                       <Input
//                         id="candidate-email"
//                         type="email"
//                         placeholder="your.email@example.com"
//                         value={email}
//                         onChange={(e) => setEmail(e.target.value)}
//                         required
//                         disabled={isLoading}
//                       />
//                     </div>

//                     <div className="space-y-2">
//                       <div className="flex justify-between items-center">
//                         <Label htmlFor="candidate-password">Password</Label>
//                         <Link
//                           href="/forgot-password"
//                           className="text-sm text-contact-purple hover:underline"
//                         >
//                           Forgot password?
//                         </Link>
//                       </div>
//                       <div className="relative">
//                         <Input
//                           id="candidate-password"
//                           type={showPassword ? 'text' : 'password'}
//                           placeholder="Enter your password"
//                           value={password}
//                           onChange={(e) => setPassword(e.target.value)}
//                           required
//                           disabled={isLoading}
//                           className="pr-10"
//                         />
//                         <button
//                           type="button"
//                           className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-contact-purple transition-colors"
//                           onClick={togglePasswordVisibility}
//                           tabIndex={-1}
//                         >
//                           {showPassword ? (
//                             <EyeOff size={18} />
//                           ) : (
//                             <Eye size={18} />
//                           )}
//                         </button>
//                       </div>
//                     </div>

//                     <Button
//                       type="submit"
//                       className="w-full bg-gradient-to-r from-contact-purple to-contact-teal text-white"
//                       disabled={isLoading}
//                     >
//                       {isLoading ? 'Signing in...' : 'Sign In'}
//                     </Button>
//                   </form>

//                   <div className="mt-6 text-center">
//                     <p className="text-gray-600">
//                       Need an account?{' '}
//                       <Link
//                         href="/register/candidate"
//                         className="text-contact-purple hover:underline"
//                       >
//                         Apply Now
//                       </Link>
//                     </p>
//                     <p className="text-sm text-gray-500 mt-4">
//                       By signing in, you agree to our{' '}
//                       <Link
//                         href="/terms-of-service"
//                         className="text-contact-purple hover:underline"
//                       >
//                         Terms of Service
//                       </Link>{' '}
//                       and{' '}
//                       <Link
//                         href="/privacy-policy"
//                         className="text-contact-purple hover:underline"
//                       >
//                         Privacy Policy
//                       </Link>
//                     </p>
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>
//           </div>
//         </section>

//         {toastMessage && (
//           <Toast>
//             <ToastTitle>
//               {toastMessage.startsWith('Login Failed')
//                 ? 'Login Failed'
//                 : 'Success'}
//             </ToastTitle>
//             <ToastDescription>{toastMessage}</ToastDescription>
//             <ToastClose onClick={() => setToastMessage(null)} />
//           </Toast>
//         )}
//         <ToastViewport />
//       </>
//     </ToastProvider>
//   );
// };

// export default CandidateLoginPage;

// File: app/login/candidate/page.tsx
import { Metadata, Viewport } from 'next';
import CandidateLoginContent from './CandidateLoginContent';

export const viewport: Viewport = {
  themeColor: '#0a192f',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://www.globixs.com'),
  title: 'Candidate Login | Globixs - Access Your Profile',
  description:
    'Access your Globixs candidate profile to apply for tech jobs, track applications, and connect with top employers in the technology industry.',
  keywords: [
    'Globixs',
    'candidate login',
    'job seeker portal',
    'tech jobs access',
    'IT candidate login',
    'job applications',
    'tech career portal',
    'job search account',
    'candidate profile',
    'tech job opportunities',
    'IT career access',
    'job application tracking',
    'tech talent login',
    'software developer jobs',
    'tech recruitment',
    'IT staffing',
  ],
  authors: [{ name: 'Globixs', url: 'https://www.globixs.com' }],
  creator: 'Globixs',
  publisher: 'Globixs',
  openGraph: {
    title: 'Candidate Login | Globixs - Access Your Profile',
    description:
      'Access your Globixs candidate profile to apply for tech jobs, track applications, and connect with top employers in the technology industry.',
    url: 'https://www.globixs.com/login/candidate',
    siteName: 'Globixs',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: '/candidate-login-og.jpg', // Update with your actual image path
        width: 1200,
        height: 630,
        alt: 'Globixs - Candidate Login',
      },
    ],
  },
  alternates: {
    canonical: 'https://www.globixs.com/login/candidate',
    languages: {
      'en-US': 'https://www.globixs.com/login/candidate',
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

export default function CandidateLoginPage() {
  return <CandidateLoginContent />;
}
