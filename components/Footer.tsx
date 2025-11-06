'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  FiMail,
  FiPhone,
  FiMapPin,
  FiChevronRight,
  FiArrowUp,
} from 'react-icons/fi';
import { FaTwitter, FaLinkedin, FaInstagram } from 'react-icons/fa';

interface FooterNavItemProps {
  href: string;
  children: React.ReactNode;
}

const FooterNavItem = ({ href, children }: FooterNavItemProps) => {
  return (
    <li className="group">
      <Link
        href={href}
        className="text-sm text-globixs-textOnDark/90 hover:text-globixs-secondary transition-all duration-200 flex items-center group"
      >
        <FiChevronRight className="h-3 w-3 mr-2 opacity-0 group-hover:opacity-100 transition-all duration-200 -ml-5 group-hover:ml-0 text-globixs-secondary" />
        {children}
      </Link>
    </li>
  );
};

const Footer: React.FC = () => {
  return (
    <footer
      className="relative bg-globixs-dark text-globixs-textOnDark overflow-hidden"
      id="contact"
    >
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Company Info - Takes 1 column */}
          <div className="lg:col-span-1">
            <div className="mb-6">
              <Link href="/">
                <Image
                  src="/logo_globix.png"
                  alt="Globixs Logo"
                  width={250}
                  height={250}
                  className="h-16 w-auto object-contain"
                />
              </Link>
            </div>

            <p className="text-sm text-globixs-textOnDark/90 mb-4 leading-relaxed">
              Powering Your Growth with Exceptional Technology Talent
            </p>

            <p className="text-sm text-globixs-textOnDark/80 mb-8 leading-relaxed">
              Globixs Technology Solutions is a leading provider of IT services and solutions,
              helping businesses transform through technology to meet the
              growing demands of the digital era.
            </p>
{/* 
            <div>
              <h3 className="text-lg font-semibold mb-4 relative pl-4 before:content-[''] before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:bg-globixs-accent">
                Connect With Us
              </h3>
              <div className="flex space-x-3">
                <Link
                  href="https://x.com/globixs"
                  className="w-10 h-10 rounded-full bg-globixs-accent/20 flex items-center justify-center hover:bg-globixs-accent hover:text-globixs-dark transition-all duration-300"
                  aria-label="Twitter"
                >
                  <FaTwitter className="h-4 w-4" />
                </Link>
                <Link
                  href="https://www.instagram.com/globixs/"
                  className="w-10 h-10 rounded-full bg-globixs-accent/20 flex items-center justify-center hover:bg-globixs-accent hover:text-globixs-dark transition-all duration-300"
                  aria-label="Instagram"
                >
                  <FaInstagram className="h-4 w-4" />
                </Link>
              </div>
            </div> */}
          </div>

          {/* Quick Links - Takes 1 column */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-semibold mb-6 relative pl-4 before:content-[''] before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:bg-globixs-accent">
              Quick Links
            </h3>
            <ul className="space-y-3">
              <FooterNavItem href="/">Home</FooterNavItem>
              <FooterNavItem href="/about-us">About Us</FooterNavItem>
              <FooterNavItem href="/services">Our Services</FooterNavItem>
              <FooterNavItem href="/careers">Careers</FooterNavItem>
              <FooterNavItem href="/contact-us">Contact Us</FooterNavItem>
              <FooterNavItem href="/media">Media</FooterNavItem>
              <FooterNavItem href="/login/candidate">
                Candidate Login
              </FooterNavItem>
              <FooterNavItem href="/login/business">
                Business Login
              </FooterNavItem>
           
            </ul>
          </div>

          {/* Contact Us - Takes 2 columns */}
          <div className="lg:col-span-2">
            <h3 className="text-lg font-semibold mb-6 relative pl-4 before:content-[''] before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:bg-globixs-accent">
              Contact Us
            </h3>

            {/* Office Location Card */}
            <div className="bg-globixs-surface/10 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex flex-col md:flex-row">
                {/* Image Section - Top on mobile, Left on desktop */}
                <div className="relative w-full md:w-1/2">
                  <div className="absolute top-3 right-3 bg-globixs-accent rounded-lg px-3 py-1 text-xs font-bold text-globixs-textOnDark z-10">
                    US
                  </div>
                  <div className="h-48 md:h-full md:min-h-[200px] relative">
                    <Image
                      src="/new8.jpg"
                      alt="USA Office"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>

                {/* Content Section - Bottom on mobile, Right on desktop */}
                <div className="w-full md:w-1/2 p-4 md:p-6 flex flex-col justify-center">
                  <h4 className="font-bold text-lg mb-4 md:mb-6 text-center text-globixs-textOnDark">
                    USA Office
                  </h4>

                  <div className="space-y-3 md:space-y-4">
                    <div className="flex items-start">
                      <FiMapPin className="h-5 w-5 mr-3 mt-0.5 text-globixs-accent flex-shrink-0" />
                      <div className="text-sm text-globixs-textOnDark/90">
                        <p>1729 208th ST SE,</p>
                        <p>Suite 103, Bothell</p>
                        <p>WA 98021</p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <FiPhone className="h-5 w-5 mr-3 text-globixs-accent flex-shrink-0" />
                      <Link
                        href="tel:+14256668998"
                        className="text-sm text-globixs-textOnDark/90 hover:text-globixs-secondary transition-colors"
                      >
                        +1 (425) 666-8998
                      </Link>
                    </div>

                    <div className="flex items-center">
                      <FiMail className="h-5 w-5 mr-3 text-globixs-accent flex-shrink-0" />
                      <Link
                        href="mailto:Connect@Globixs.com"
                        className="text-sm text-globixs-textOnDark/90 hover:text-globixs-secondary transition-colors break-all md:break-normal"
                      >
                        Connect@Globixs.com
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-globixs-textOnDark/20">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-globixs-textOnDark/80">
              © {new Date().getFullYear()} Globixs Technology Solutions. All rights reserved.
            </p>
            <div className="flex flex-wrap gap-6">
              <Link
                href="/privacy-policy"
                className="text-sm text-globixs-textOnDark/80 hover:text-globixs-secondary transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms-of-service"
                className="text-sm text-globixs-textOnDark/80 hover:text-globixs-secondary transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                href="/cookie-policy"
                className="text-sm text-globixs-textOnDark/80 hover:text-globixs-secondary transition-colors"
              >
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Back to top button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-globixs-accent text-globixs-textOnDark flex items-center justify-center shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 hover:scale-105 z-40"
        aria-label="Back to top"
      >
        <FiArrowUp size={18} />
      </button>
    </footer>
  );
};

export default Footer;
