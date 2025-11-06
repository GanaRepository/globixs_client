// 'use client';

// import React, { useEffect } from 'react';
// import { useInView } from 'react-intersection-observer';
// import { Users, Activity, ShoppingBag, Car, Phone, Zap } from 'lucide-react';
// import HeroSection from './IndustriesHeroSection';
// import Image from 'next/image';

// export default function IndustriesPage(): JSX.Element {
//   const { ref: featuresRef, inView: featuresInView } = useInView({
//     triggerOnce: true,
//     threshold: 0.1,
//   });

//   // Handle hash navigation with proper offset
//   useEffect(() => {
//     // Add scroll-padding to the document to account for the fixed header
//     document.documentElement.style.scrollPadding = '100px 0 0 0';

//     // Check if there's a hash in the URL
//     if (window.location.hash) {
//       // Get the element
//       const id = window.location.hash.substring(1);
//       const element = document.getElementById(id);

//       if (element) {
//         // Add a slight delay to ensure DOM is fully loaded
//         setTimeout(() => {
//           // Get the header height (assuming 100px, adjust as needed)
//           const headerOffset = 100;
//           const elementPosition = element.getBoundingClientRect().top;
//           const offsetPosition =
//             elementPosition + window.pageYOffset - headerOffset;

//           // Scroll to the element with the offset
//           window.scrollTo({
//             top: offsetPosition,
//             behavior: 'smooth',
//           });
//         }, 300);
//       }
//     }
//   }, []);

//   // List of 6 industries for the industries page
//   const industries = [
//     {
//       id: 'automotive',
//       icon: <Car />,
//       title: 'Automotive',
//       description:
//         'Smarter systems. Smoother mobility. From connected vehicle ecosystems to supply chain digitization, we support automotive enterprises with agile DevOps practices, cloud engineering, and specialized talent to drive speed and innovation on and off the road.',
//       color: 'bg-gradient-to-br from-purple-500/80 to-indigo-600/80',
//       imageUrl: '/automotive.jpg',
//     },
//     {
//       id: 'healthcare',
//       icon: <Activity />,
//       title: 'Healthcare',
//       description:
//         'Secure, scalable, and patient-first. We help healthcare organizations stay compliant, improve patient engagement, and build resilient infrastructure — delivering talent and solutions across EHR modernization, cloud security, and data interoperability.',
//       color: 'bg-gradient-to-br from-emerald-500/80 to-teal-600/80',
//       imageUrl: '/health.jpg',
//     },
//     {
//       id: 'technology',
//       icon: <Users />,
//       title: 'Technology',
//       description:
//         'For tech companies, by a tech partner that gets it. Whether youre scaling fast, optimizing cloud costs, or building new digital products, we bring the engineering muscle, DevOps mindset, and staffing precision to help tech companies thrive at every stage of growth.',
//       color: 'bg-gradient-to-br from-blue-500/80 to-cyan-600/80',
//       imageUrl: '/technology.jpg',
//     },
//     {
//       id: 'telecom',
//       icon: <Phone />,
//       title: 'Telecom',
//       description:
//         'Enabling the networks of tomorrow. With demand surging for 5G, edge computing, and real-time connectivity, we help telecom players modernize legacy systems, streamline operations, and deploy expert talent for complex rollouts.',
//       color: 'bg-gradient-to-br from-orange-500/80 to-amber-600/80',
//       imageUrl: '/telecom.jpg',
//     },
//     {
//       id: 'retail',
//       icon: <ShoppingBag />,
//       title: 'Retail',
//       description:
//         'Omnichannel-ready and customer-obsessed. We support retailers with scalable IT teams, automation expertise, and cloud-first strategies to optimize supply chains, personalize experiences, and adapt to ever-changing consumer behavior.',
//       color: 'bg-gradient-to-br from-rose-500/80 to-pink-600/80',
//       imageUrl: '/retail.jpg',
//     },
//     {
//       id: 'utilities',
//       icon: <Zap />,
//       title: 'Utilities',
//       description:
//         'Powering smarter, greener operations. From predictive maintenance to customer self-service portals, we help energy and utility providers adopt digital solutions that improve efficiency, sustainability, and service delivery.',
//       color: 'bg-gradient-to-br from-slate-500/80 to-gray-600/80',
//       imageUrl: '/image11.jpg',
//     },
//   ];

//   return (
//     <div>
//       <HeroSection />
//       {/* Introduction Section */}
//       <section className="pt-12 md:pt-20 bg-[#EAF6F6]">
//         <div className="container mx-auto px-4 md:px-6">
//           <div className="max-w-7xl mx-auto">
//             <h2 className="text-3xl md:text-5xl mb-6 md:mb-8 text-center gradient-text">
//               Our Industry Expertise
//             </h2>
//             <div className="text-base md:text-lg text-gray-700 space-y-4">
//               <p>
//                 At Globixs, we don&apos;t believe in
//                 one-size-fits-all. Every industry has unique challenges,
//                 pressures, and opportunities — and we&apos;re here to meet them
//                 head-on. With deep domain understanding and a flexible delivery
//                 model, we help businesses across sectors accelerate
//                 transformation, modernize operations, and stay future-ready.
//               </p>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Industries Section - Responsive alternating layout */}
//       <section className="py-12 md:py-20 bg-[#EAF6F6] backdrop-blur-sm relative">
//         <div className="container mx-auto px-4 relative">
//           <div
//             ref={featuresRef}
//             className={`space-y-8 md:space-y-12 transition-all duration-1000 ${
//               featuresInView
//                 ? 'opacity-100 translate-y-0'
//                 : 'opacity-0 translate-y-12'
//             }`}
//           >
//             {industries.map((industry, index) => (
//               <div
//                 key={index}
//                 id={industry.id}
//                 className="bg-white  shadow-lg overflow-hidden"
//               >
//                 {/* Mobile layout - always stack content vertically */}
//                 <div className="flex flex-col md:hidden">
//                   <div className="h-56 relative">
//                     <Image
//                       src={industry.imageUrl}
//                       alt={industry.title}
//                       fill
//                       className="object-cover"
//                     />
//                     <div
//                       className={`absolute top-4 left-4 p-3 rounded-lg ${industry.color}`}
//                     >
//                       <div className="text-white">{industry.icon}</div>
//                     </div>
//                   </div>

//                   <div className="p-6 flex flex-col justify-center">
//                     <h3 className="text-xl font-bold mb-3">{industry.title}</h3>
//                     <p className="text-gray-600 mb-6">{industry.description}</p>
//                   </div>
//                 </div>

//                 {/* Desktop layout - alternating sides */}
//                 <div
//                   className={`hidden md:flex flex-row ${index % 2 !== 0 ? 'flex-row-reverse' : ''} h-80`}
//                 >
//                   <div className="w-1/2 h-full relative">
//                     <Image
//                       src={industry.imageUrl}
//                       alt={industry.title}
//                       fill
//                       className="object-cover"
//                     />
//                     <div
//                       className={`absolute top-4 ${index % 2 !== 0 ? 'right-4' : 'left-4'} p-3 rounded-lg ${industry.color}`}
//                     >
//                       <div className="text-white">{industry.icon}</div>
//                     </div>
//                   </div>

//                   <div className="w-1/2 p-8 flex flex-col justify-center">
//                     <h3 className="text-2xl font-bold mb-3">
//                       {industry.title}
//                     </h3>
//                     <p className="text-gray-600 mb-6">{industry.description}</p>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Case Study Section */}
//       <section className="py-20  pattern-bg">
//         <div className="container mx-auto px-4">
//           <div className="max-w-4xl mx-auto text-center">
//             <div className="inline-block bg-gradient-to-r from-contact-purple/20 to-contact-teal/20 px-4 py-1 rounded-full mb-6">
//               <span className="text-contact-purple font-medium text-sm">
//                 Success Story
//               </span>
//             </div>
//             <h3 className="text-2xl md:text-3xl text-gray-800 font-medium mb-6">
//               Driving Smart Solutions in the Automotive Sector
//             </h3>
//             <p className="text-lg text-gray-700 leading-relaxed mb-8">
//               A leading automotive client needed to modernize legacy systems
//               while managing real-time manufacturing data. We delivered scalable
//               architecture, flexible integration, and domain-aligned talent —
//               increasing system uptime by 40% and insights velocity by 60%.
//             </p>
//             <div className="flex items-center justify-center">
//               <div className="w-20 h-1 bg-contact-purple/30 mr-4"></div>
//               <div className="py-3 px-6 rounded-full bg-gradient-to-r from-contact-purple/10 to-contact-teal/10">
//                 <p className="text-contact-purple font-medium">
//                   40% System Uptime Improvement
//                 </p>
//               </div>
//               <div className="w-20 h-1 bg-contact-purple/30 ml-4"></div>
//             </div>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// }

// File: app/industries/page.tsx
import { Metadata, Viewport } from 'next';
import IndustriesContent from './IndustriesContent';

export const viewport: Viewport = {
  themeColor: '#0a192f',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://www.globixs.com'),
  title: 'Industry Solutions | Globixs Technology Solutions - Specialized Technology Expertise',
  description:
    "Explore Globixs Technology Solutions' industry-specific technology solutions for automotive, healthcare, tech, telecom, retail, and utilities sectors. Tailored IT expertise for your business needs.",
  keywords: [
    'Globixs Technology Solutions',
    'industry solutions',
    'automotive IT solutions',
    'healthcare technology',
    'telecom IT services',
    'retail technology',
    'utility sector IT',
    'technology industry solutions',
    'sector-specific IT',
    'specialized technology services',
    'IT consulting by industry',
    'technology staffing solutions',
    'industry expertise',
    'digital transformation',
    'domain knowledge',
    'tech consulting',
  ],
  authors: [{ name: 'Globixs Technology Solutions', url: 'https://www.globixs.com' }],
  creator: 'Globixs',
  publisher: 'Globixs',
  openGraph: {
    title: 'Industry Solutions | Globixs - Specialized Technology Expertise',
    description:
      "Explore Globixs' industry-specific technology solutions for automotive, healthcare, tech, telecom, retail, and utilities sectors. Tailored IT expertise for your business needs.",
    url: 'https://www.globixs.com/industries',
    siteName: 'Globixs',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: '/industry-solutions-og.jpg', // Update with your actual image path
        width: 1200,
        height: 630,
        alt: 'Globixs - Industry Solutions',
      },
    ],
  },
  alternates: {
    canonical: 'https://www.globixs.com/industries',
    languages: {
      'en-US': 'https://www.globixs.com/industries',
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
    nocache: false,
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

export default function IndustriesPage() {
  return <IndustriesContent />;
}
