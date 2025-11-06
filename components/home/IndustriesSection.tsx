// // File: components/IndustriesSection.tsx
// 'use client';
// import React from 'react';
// import Link from 'next/link';
// import {
//   ArrowUpRight,
//   Users,
//   Landmark,
//   Activity,
//   ShoppingBag,
//   GraduationCap,
//   Briefcase,
//   Car,
//   Phone,
//   Radio,
//   Zap,
// } from 'lucide-react';
// import { Button } from '../ui/button';
// import { motion } from 'framer-motion';

// interface IndustryCardProps {
//   icon: React.ReactNode;
//   title: string;
//   description: string;
//   imageUrl: string;
//   ctaText?: string;
//   ctaLink: string;
// }

// const IndustryCard: React.FC<IndustryCardProps> = ({
//   icon,
//   title,
//   description,
//   imageUrl,
//   ctaText = 'Learn More',
//   ctaLink,
// }) => {
//   return (
//     <motion.div
//       className="flex-shrink-0 w-full bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 h-full"
//       whileHover={{ y: -8 }}
//       transition={{ type: 'spring', stiffness: 300 }}
//     >
//       <div className="h-48 relative overflow-hidden">
//         <div
//           className="w-full h-full bg-cover bg-center"
//           style={{ backgroundImage: `url(${imageUrl})` }}
//         />
//         <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60"></div>
//       </div>

//       <div className="p-6">
//         <div className="w-12 h-12 -mt-10 mb-4 rounded-lg bg-white flex items-center justify-center text-contact-teal shadow-md relative z-10">
//           {icon}
//         </div>

//         <h3 className="text-xl font-medium text-gray-800 mb-3">{title}</h3>

//         <p className="text-gray-600 mb-5">{description}</p>

//         <Link href={ctaLink}>
//           <Button className="inline-flex items-center text-white font-medium bg-contact-teal hover:bg-contact-teal/90">
//             {ctaText}
//             <ArrowUpRight size={16} className="ml-2" />
//           </Button>
//         </Link>
//       </div>
//     </motion.div>
//   );
// };

// export const IndustriesSection = () => {
//   // Featured industries for the homepage - showing only 3
//   const featuredIndustries: IndustryCardProps[] = [
//     {
//       icon: <Activity size={24} />,
//       title: 'Healthcare',
//       description:
//         'Specialized IT talent for healthcare technology and medical software systems.',
//       imageUrl: '/health.jpg',
//       ctaLink: '/industries#healthcare',
//     },
//     {
//       icon: <Landmark size={24} />,
//       title: 'Finance',
//       description:
//         'Expert IT professionals for fintech, banking, and financial services sectors.',
//       imageUrl: '/finance.jpg',
//       ctaLink: '/industries#finance',
//     },
//     {
//       icon: <Users size={24} />,
//       title: 'Technology',
//       description:
//         'Custom staffing solutions for software development, IT operations, and digital transformation projects.',
//       imageUrl: '/technology.jpg',
//       ctaLink: '/industries#technology',
//     },
//   ];

//   return (
//     <div className="py-12 md:py-24 bg-[#EAF6F6] ">
//       <div className="container mx-auto px-4">
//         <div className="max-w-3xl mx-auto text-center mb-12">
//           <span className="inline-block py-1 px-4 bg-contact-teal/10 text-contact-teal text-sm rounded-full mb-4 font-medium">
//             INDUSTRIES WE SERVE
//           </span>
//           <h2 className="text-3xl md:text-4xl mb-6 bg-gradient-to-r from-contact-purple to-contact-teal bg-clip-text text-transparent pr-2">
//             Tailored Solutions for Your Industry
//           </h2>
//           <p className="text-gray-600 text-lg mt-6 max-w-2xl mx-auto">
//             We deliver specialized IT services across multiple industries,
//             addressing unique sector challenges with innovative technology
//             solutions.
//           </p>
//         </div>

//         <div className="flex justify-center">
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
//             {featuredIndustries.map((industry, index) => (
//               <IndustryCard key={`industry-${index}`} {...industry} />
//             ))}
//           </div>
//         </div>

//         <div className="text-center mt-12">
//           <Link href="/industries">
//             <Button className="bg-contact-purple hover:bg-contact-purple/90 text-white px-8 py-6 rounded-lg text-lg inline-flex items-center gap-2">
//               View All Industries
//               <ArrowUpRight size={20} />
//             </Button>
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// };

'use client';
import React from 'react';
import Link from 'next/link';
import {
  ArrowUpRight,
  Users,
  Landmark,
  Activity,
  ShoppingBag,
  GraduationCap,
  Briefcase,
  Car,
  Phone,
  Radio,
  Zap,
} from 'lucide-react';
import { Button } from '../ui/button';
import { motion } from 'framer-motion';

interface IndustryCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  imageUrl: string;
  ctaText?: string;
  ctaLink: string;
}

const IndustryCard: React.FC<IndustryCardProps> = ({
  icon,
  title,
  description,
  imageUrl,
  ctaText = 'Learn More',
  ctaLink,
}) => {
  return (
    <motion.div
      className="flex-shrink-0 w-full bg-white  shadow-md overflow-hidden border border-gray-100 h-full"
      whileHover={{ y: -8 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <div className="h-48 relative overflow-hidden">
        <div
          className="w-full h-full bg-cover bg-center"
          style={{ backgroundImage: `url(${imageUrl})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60"></div>
      </div>

      <div className="p-6">
        <div className="w-12 h-12 -mt-10 mb-4 rounded-lg bg-globixs-surface flex items-center justify-center text-globixs-secondary shadow-xl relative z-10">
          {icon}
        </div>

        <h3 className="heading-tertiary mb-3">{title}</h3>

        <p className="text-body text-globixs-textLight mb-5">{description}</p>

        <Link href={ctaLink}>
          <Button className="inline-flex items-center text-white font-medium gradient-button">
            {ctaText}
            <ArrowUpRight size={16} className="ml-2" />
          </Button>
        </Link>
      </div>
    </motion.div>
  );
};

export const IndustriesSection = () => {
  // Featured industries for the homepage - showing only 3
  const featuredIndustries: IndustryCardProps[] = [
    {
      icon: <Car size={24} />,
      title: 'Automotive',
      description:
        'Smarter systems. Smoother mobility. From connected vehicle ecosystems to supply chain digitization, we support automotive enterprises with agile DevOps practices.',
      imageUrl: '/automotive.jpg',
      ctaLink: '/industries#automotive',
    },
    {
      icon: <Activity size={24} />,
      title: 'Healthcare',
      description:
        'Secure, scalable, and patient-first. We help healthcare organizations stay compliant, improve patient engagement, and build resilient infrastructure.',
      imageUrl: '/health_care.jpg',
      ctaLink: '/industries#healthcare',
    },
    {
      icon: <Users size={24} />,
      title: 'Technology',
      description:
        'For tech companies, by a tech partner that gets it. We bring the engineering muscle, DevOps mindset, and staffing precision to help tech companies thrive.',
      imageUrl: '/technology.jpg',
      ctaLink: '/industries#technology',
    },
  ];

  return (
    <div className="py-24 bg-globixs-bgAccent ">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto text-center mb-12">
          {/* <span className="inline-block py-1 px-4 bg-contact-teal/10 text-contact-teal text-sm rounded-full mb-4 font-medium">
            INDUSTRIES WE SERVE
          </span> */}
          <h2 className="heading-secondary mb-6">
            Trusted by Leading Industries
          </h2>
          <p className="text-lead text-globixs-textLight mt-6 max-w-7xl mx-auto">
            From healthcare to automotive, financial services to energy, we
            understand the unique challenges and opportunities within each
            sector we serve.
          </p>
        </div>

        <div className="flex justify-center">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {featuredIndustries.map((industry, index) => (
              <IndustryCard key={`industry-${index}`} {...industry} />
            ))}
          </div>
        </div>

        <div className="text-center mt-12">
          <Link href="/industries">
            <Button className="gradient-button text-white px-8 py-6 rounded-lg text-lg inline-flex items-center gap-2">
              View All Industries
              <ArrowUpRight size={20} />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default IndustriesSection;
