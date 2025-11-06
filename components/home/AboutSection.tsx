// import React from 'react';
// import Image from 'next/image';
// import Link from 'next/link';
// import { ChevronRight } from 'lucide-react';

// export const AboutSection = () => {
//   return (
//     <section className="py-24 overflow-hidden bg-[#EAF6F6]" id="about">
//       <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
//           {/* Text Content */}
//           <div className="order-2 lg:order-1">
//             <h2 className="text-3xl md:text-4xl lg:text-5xl  mb-6 text-gray-800 leading-tight">
//               Welcome to{' '}
//               <span className="bg-gradient-to-r from-contact-purple to-contact-teal bg-clip-text text-transparent pr-2">
//                 Globixs
//               </span>
//               Systems
//             </h2>

//             <h3 className="text-xl text-contact-teal  mb-6">
//               Enterprise IT, Done Right
//             </h3>

//             <p className="text-gray-600 text-lg leading-relaxed mb-6">
//               We transform businesses through technology, delivering world-class
//               solutions, best-in-class talent, and a partnership mindset.
//               Whether you need custom development, staffing, daily support, or
//               business strategy—Globixs is your trusted partner.
//             </p>

//             <div className="flex flex-wrap gap-4 mt-6">
//               <Link
//                 href="/about-us"
//                 className="bg-gradient-to-r from-contact-purple to-contact-teal text-white px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center gap-2 font-medium"
//               >
//                 Learn More
//                 <ChevronRight className="w-5 h-5" />
//               </Link>
//             </div>

//             {/* Stats */}
//             <div className="mt-10 grid grid-cols-3 gap-4">
//               <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
//                 <p className="text-2xl  bg-gradient-to-r from-contact-purple to-contact-teal bg-clip-text text-transparent">
//                   12+
//                 </p>
//                 <p className="text-gray-600 text-sm">Years of Excellence</p>
//               </div>
//               <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
//                 <p className="text-2xl  bg-gradient-to-r from-contact-purple to-contact-teal bg-clip-text text-transparent">
//                   500+
//                 </p>
//                 <p className="text-gray-600 text-sm">Successful Projects</p>
//               </div>
//               <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
//                 <p className="text-2xl  bg-gradient-to-r from-contact-purple to-contact-teal bg-clip-text text-transparent">
//                   100%
//                 </p>
//                 <p className="text-gray-600 text-sm">Client Satisfaction</p>
//               </div>
//             </div>
//           </div>

//           {/* Image Content */}
//           <div className="order-1 lg:order-2 relative">
//             <div className="relative z-10">
//               <div className="grid grid-cols-12 grid-rows-12 gap-3">
//                 {/* Main image - occupies more space */}
//                 <div className="col-span-8 row-span-8 col-start-1 row-start-1 relative rounded-2xl overflow-hidden shadow-lg">
//                   <Image
//                     src="/image2.jpg"
//                     alt="Team working together"
//                     className="object-cover w-full h-full"
//                     width={900}
//                     height={650}
//                   />
//                   <div className="absolute inset-0 bg-gradient-to-t from-contact-purple/30 to-transparent"></div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export const AboutSection = () => {
  return (
    <section
      className="section-padding overflow-hidden bg-globixs-bgAccent"
      id="about"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Text Content */}
          <div className="order-2 lg:order-1">
            <h2 className="heading-secondary mb-6">Welcome to Globixs Technology Solutions</h2>

            <h3 className="text-xl text-globixs-textLight mb-6">
              Powering Your Growth with Exceptional Technology Talent
            </h3>

            <p className="text-body text-globixs-textLight mb-6">
              We transform businesses through technology, delivering world-class
              solutions, best-in-class talent, and a partnership mindset.
              Whether you need custom development, staffing, daily support, or
              business strategy-Globixs is your trusted partner.
            </p>

            <div className="flex flex-wrap gap-4 mt-6 justify-center lg:justify-start">
              <Link
                href="/about-us"
                className="professional-button flex items-center gap-2"
              >
                Learn More
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-10 grid grid-cols-3 gap-4">
              <div className="professional-card p-4">
                <p className="text-2xl font-bold gradient-text">12+</p>
                <p className="text-globixs-textLight text-sm">
                  Years of Excellence
                </p>
              </div>
              <div className="professional-card p-4">
                <p className="text-2xl font-bold gradient-text">500+</p>
                <p className="text-globixs-textLight text-sm">
                  Successful Projects
                </p>
              </div>
              <div className="professional-card p-4">
                <p className="text-2xl font-bold gradient-text">100%</p>
                <p className="text-globixs-textLight text-sm">
                  Client Satisfaction
                </p>
              </div>
            </div>
          </div>

          {/* Improved Image Gallery Section */}
          <div className="order-1 lg:order-2 relative">
            <div className="relative">
              {/* Main large image */}
              <div className="relative rounded-xl overflow-hidden shadow-xl transition-transform duration-500 transform hover:scale-[1.02] mx-auto md:mx-0 max-w-md md:max-w-none">
                <Image
                  src="/image2.jpg"
                  alt="Team working together"
                  className="object-cover w-full h-full"
                  width={600}
                  height={450}
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-globixs-primary/30 to-transparent"></div>
              </div>

              {/* Decorative smaller images that appear on medium screens and up */}
              <div className="hidden md:block absolute -bottom-6 -left-6 w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 rounded-xl overflow-hidden shadow-lg transform rotate-6 z-20">
                <Image
                  src="/image3.jpg"
                  alt="Our team in action"
                  className="object-cover w-full h-full"
                  width={200}
                  height={200}
                />
                <div className="absolute inset-0 bg-gradient-to-br from-transparent to-globixs-secondary/20"></div>
              </div>

              <div className="hidden md:block absolute -top-8 -right-4 lg:-right-8 w-28 h-28 md:w-36 md:h-36 lg:w-44 lg:h-44 rounded-xl overflow-hidden shadow-lg transform -rotate-3 z-10">
                <Image
                  src="/image4.jpg"
                  alt="Technology innovation"
                  className="object-cover w-full h-full"
                  width={180}
                  height={180}
                />
                <div className="absolute inset-0 bg-gradient-to-tl from-transparent to-globixs-primary/20"></div>
              </div>

              {/* Floating decorative elements */}
              <div className="absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2">
                <div className="w-16 h-16 md:w-24 md:h-24 rounded-full bg-gradient-to-r from-globixs-primary/20 to-globixs-secondary/20 blur-xl"></div>
              </div>

              <div className="absolute bottom-1/4 left-0 transform -translate-x-1/2">
                <div className="w-12 h-12 md:w-20 md:h-20 rounded-full bg-gradient-to-r from-globixs-secondary/20 to-globixs-primary/20 blur-xl"></div>
              </div>
            </div>

            {/* Responsive mobile-only badge - visible only on small screens */}
          </div>
        </div>
      </div>
    </section>
  );
};
