// // app/register/candidate/page.tsx
// 'use client';

// import React, { useState, useEffect } from 'react';
// import { useInView } from 'react-intersection-observer';
// import { ArrowRight, ArrowLeft, User, Eye, EyeOff } from 'lucide-react';
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';
// import { signIn } from 'next-auth/react';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent } from '@/components/ui/card';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Checkbox } from '@/components/ui/checkbox';
// import {
//   ToastProvider,
//   ToastViewport,
//   Toast,
//   ToastTitle,
//   ToastDescription,
//   ToastClose,
// } from '@/components/ui/toast';

// const RegisterCandidatePage: React.FC = () => {
//   const router = useRouter();
//   const { ref: heroRef, inView: heroInView } = useInView({
//     triggerOnce: true,
//     threshold: 0.1,
//   });

//   const { ref: formRef, inView: formInView } = useInView({
//     triggerOnce: true,
//     threshold: 0.1,
//   });

//   const [formData, setFormData] = useState({
//     firstName: '',
//     lastName: '',
//     email: '',
//     password: '',
//     confirmPassword: '',
//     agreeToTerms: false,
//   });

//   const [toastMessage, setToastMessage] = useState<string | null>(null);
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);

//   useEffect(() => {
//     if (toastMessage) {
//       console.log('Toast message set:', toastMessage);
//     }
//   }, [toastMessage]);

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleCheckboxChange = (name: string, checked: boolean) => {
//     setFormData((prev) => ({
//       ...prev,
//       [name]: checked,
//     }));
//   };

//   const togglePasswordVisibility = () => {
//     setShowPassword(!showPassword);
//   };

//   const toggleConfirmPasswordVisibility = () => {
//     setShowConfirmPassword(!showConfirmPassword);
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);

//     try {
//       // Password validation on the client side too
//       const passwordRegex =
//         /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
//       if (!passwordRegex.test(formData.password)) {
//         setToastMessage(
//           'Password must be at least 8 characters and include uppercase, lowercase, number, and special character'
//         );
//         setIsLoading(false);
//         return;
//       }

//       if (formData.password !== formData.confirmPassword) {
//         setToastMessage('Passwords do not match');
//         setIsLoading(false);
//         return;
//       }

//       console.log('Sending registration request...');
//       const response = await fetch('/api/auth/register/candidate', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(formData),
//       });

//       const data = await response.json();
//       console.log('Registration response:', response.status, data);

//       if (!response.ok) {
//         console.log('Registration failed:', data.error);
//         setToastMessage(data.error || 'Registration failed');
//         setIsLoading(false);
//         return;
//       }

//       setToastMessage('Registration successful! Logging you in...');

//       // Auto-login immediately after successful registration
//       const signInResult = await signIn('credentials', {
//         redirect: false,
//         email: formData.email,
//         password: formData.password,
//       });

//       if (signInResult?.error) {
//         console.error('Auto login failed:', signInResult.error);
//         // If auto-login fails, redirect to login page
//         window.location.href = '/login/candidate';
//       } else {
//         // If successful, redirect to home page
//         window.location.href = '/';
//       }
//     } catch (error) {
//       console.error('Registration error:', error);
//       setToastMessage(
//         error instanceof Error
//           ? error.message
//           : 'Registration failed. Please try again.'
//       );
//       setIsLoading(false);
//     }
//   };

//   return (
//     <ToastProvider>
//       <div className="min-h-screen pattern-bg">
//         {/* Decorative elements */}
//         <div className="fixed top-0 right-0 w-1/3 h-screen bg-gradient-to-b from-contact-purple/5 to-contact-teal/5 -z-10"></div>
//         <div className="fixed top-20 left-10 w-64 h-64 bg-contact-purple/10 rounded-full filter blur-3xl animate-float -z-10"></div>
//         <div
//           className="fixed bottom-20 right-10 w-64 h-64 bg-contact-teal/10 rounded-full filter blur-3xl animate-float -z-10"
//           style={{ animationDelay: '2s' }}
//         ></div>

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
//                     Candidate Registration
//                   </div>
//                 </div>
//               </div>

//               <h1 className="text-5xl md:text-7xl font-normal mb-6 gradient-text leading-tight">
//                 Join Our Talent Pool
//               </h1>
//               <p className="text-xl text-gray-700 mb-12 max-w-3xl mx-auto">
//                 Create your candidate profile to access job opportunities and
//                 connect with top employers.
//               </p>
//             </div>
//           </div>
//         </section>

//         {/* Registration Form Section */}
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
//               <Card className="border shadow-lg">
//                 <CardContent className="p-6 md:p-8">
//                   <h2 className="text-2xl font-medium text-center mb-8">
//                     Account Information
//                   </h2>

//                   <form onSubmit={handleSubmit} className="space-y-6">
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                       <div className="space-y-2">
//                         <Label htmlFor="firstName">First Name</Label>
//                         <Input
//                           id="firstName"
//                           name="firstName"
//                           value={formData.firstName}
//                           onChange={handleInputChange}
//                           placeholder="Enter your first name"
//                           required
//                           disabled={isLoading}
//                         />
//                       </div>

//                       <div className="space-y-2">
//                         <Label htmlFor="lastName">Last Name</Label>
//                         <Input
//                           id="lastName"
//                           name="lastName"
//                           value={formData.lastName}
//                           onChange={handleInputChange}
//                           placeholder="Enter your last name"
//                           required
//                           disabled={isLoading}
//                         />
//                       </div>
//                     </div>

//                     <div className="space-y-2">
//                       <Label htmlFor="email">Email</Label>
//                       <Input
//                         id="email"
//                         name="email"
//                         type="email"
//                         value={formData.email}
//                         onChange={handleInputChange}
//                         placeholder="your.email@example.com"
//                         required
//                         disabled={isLoading}
//                       />
//                     </div>

//                     <div className="space-y-2">
//                       <Label htmlFor="password">Password</Label>
//                       <div className="relative">
//                         <Input
//                           id="password"
//                           name="password"
//                           type={showPassword ? 'text' : 'password'}
//                           value={formData.password}
//                           onChange={handleInputChange}
//                           placeholder="Create a secure password"
//                           required
//                           disabled={isLoading}
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
//                       <p className="text-xs text-gray-500">
//                         Password must be at least 8 characters and include
//                         uppercase, lowercase, number, and special character.
//                       </p>
//                     </div>

//                     <div className="space-y-2">
//                       <Label htmlFor="confirmPassword">Confirm Password</Label>
//                       <div className="relative">
//                         <Input
//                           id="confirmPassword"
//                           name="confirmPassword"
//                           type={showConfirmPassword ? 'text' : 'password'}
//                           value={formData.confirmPassword}
//                           onChange={handleInputChange}
//                           placeholder="Confirm your password"
//                           required
//                           disabled={isLoading}
//                         />
//                         <button
//                           type="button"
//                           className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-contact-purple transition-colors"
//                           onClick={toggleConfirmPasswordVisibility}
//                           tabIndex={-1}
//                         >
//                           {showConfirmPassword ? (
//                             <EyeOff size={18} />
//                           ) : (
//                             <Eye size={18} />
//                           )}
//                         </button>
//                       </div>
//                     </div>

//                     <div className="flex items-center space-x-2">
//                       <Checkbox
//                         id="agreeToTerms"
//                         checked={formData.agreeToTerms}
//                         onCheckedChange={(checked) =>
//                           handleCheckboxChange(
//                             'agreeToTerms',
//                             checked as boolean
//                           )
//                         }
//                         required
//                         disabled={isLoading}
//                       />
//                       <Label htmlFor="agreeToTerms" className="text-sm">
//                         I agree to the{' '}
//                         <Link
//                           href="/terms"
//                           className="text-contact-purple hover:underline"
//                         >
//                           Terms of Service
//                         </Link>{' '}
//                         and{' '}
//                         <Link
//                           href="/privacy"
//                           className="text-contact-purple hover:underline"
//                         >
//                           Privacy Policy
//                         </Link>
//                       </Label>
//                     </div>

//                     {/* Navigation Buttons */}
//                     <div className="flex justify-between mt-8">
//                       <Link href="/login">
//                         <Button
//                           type="button"
//                           variant="outline"
//                           className="flex items-center"
//                           disabled={isLoading}
//                         >
//                           <ArrowLeft className="mr-2 h-4 w-4" />
//                           Back to Login
//                         </Button>
//                       </Link>

//                       <Button
//                         type="submit"
//                         className="bg-gradient-to-r from-contact-purple to-contact-teal text-white"
//                         disabled={isLoading}
//                       >
//                         {isLoading ? (
//                           <span className="flex items-center justify-center">
//                             <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
//                             Processing...
//                           </span>
//                         ) : (
//                           <>
//                             Create Account
//                             <ArrowRight className="ml-2 h-4 w-4" />
//                           </>
//                         )}
//                       </Button>
//                     </div>
//                   </form>
//                 </CardContent>
//               </Card>

//               <div className="mt-6 text-center">
//                 <p className="text-gray-600">
//                   Already have an account?{' '}
//                   <Link
//                     href="/login"
//                     className="text-contact-purple hover:underline"
//                   >
//                     Sign in here
//                   </Link>
//                 </p>
//               </div>
//             </div>
//           </div>
//         </section>

//         {toastMessage && (
//           <Toast className="z-50">
//             <ToastTitle>
//               {toastMessage.includes('successful') ? 'Success' : 'Error'}
//             </ToastTitle>
//             <ToastDescription>{toastMessage}</ToastDescription>
//             <ToastClose onClick={() => setToastMessage(null)} />
//           </Toast>
//         )}
//         <ToastViewport />
//       </div>
//     </ToastProvider>
//   );
// };

// export default RegisterCandidatePage;

// app/register/candidate/page.tsx
import { Metadata, Viewport } from 'next';
import RegisterCandidateContent from './RegisterCandidateContent';

export const viewport: Viewport = {
  themeColor: '#0a192f',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://www.globixs.com'),
  title: 'Candidate Registration | Globixs - Join Our Talent Pool',
  description:
    'Create your candidate profile with Globixs to access job opportunities in technology, connect with top employers, and advance your career in the tech industry.',
  keywords: [
    'Globixs',
    'candidate registration',
    'tech job opportunities',
    'talent pool',
    'IT career',
    'technology jobs',
    'software development careers',
    'tech talent',
    'tech recruiting',
    'job application',
    'IT staffing',
    'candidate profile',
    'tech professional',
    'career advancement',
    'job search',
    'technology employment',
  ],
  authors: [{ name: 'Globixs', url: 'https://www.globixs.com' }],
  creator: 'Globixs',
  publisher: 'Globixs',
  openGraph: {
    title: 'Candidate Registration | Globixs - Join Our Talent Pool',
    description:
      'Create your candidate profile with Globixs to access job opportunities in technology, connect with top employers, and advance your career in the tech industry.',
    url: 'https://www.globixs.com/register/candidate',
    siteName: 'Globixs',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: '/candidate-register-og.jpg', // Update with your actual image path
        width: 1200,
        height: 630,
        alt: 'Globixs - Candidate Registration',
      },
    ],
  },
  alternates: {
    canonical: 'https://www.globixs.com/register/candidate',
    languages: {
      'en-US': 'https://www.globixs.com/register/candidate',
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

export default function RegisterCandidatePage() {
  return <RegisterCandidateContent />;
}
