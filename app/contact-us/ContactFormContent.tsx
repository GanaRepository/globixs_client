'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaCommentAlt,
  FaLock,
  FaPaperPlane,
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaWhatsapp,
  FaInstagram,
} from 'react-icons/fa';
import { MdEmail, MdPhone } from 'react-icons/md';
import Link from 'next/link';

import useSessionStore from '@/stores/useSessionStore';
import {
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
} from '@/components/ui/toast';

// Main Contact Form Component
export default function ContactFormContent() {
  const { session } = useSessionStore();
  const formRef = useRef<HTMLFormElement>(null);
  const firstNameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'default' | 'destructive'>(
    'default'
  );

  // Auto-fill form fields when component mounts and session is available
  useEffect(() => {
    if (session?.user) {
      // Handle auto-filling based on user role
      if (session.user.role === 'business' && session.user.companyName) {
        // For business users, split company name into first and last name if possible
        const companyNameParts = session.user.companyName.split(' ');

        if (companyNameParts.length > 1) {
          // If company name has spaces, use first part as firstName and rest as lastName
          const firstName = companyNameParts[0];
          const lastName = companyNameParts.slice(1).join(' ');

          if (firstNameRef.current) firstNameRef.current.value = firstName;
          if (lastNameRef.current) lastNameRef.current.value = lastName;
        } else {
          // If no spaces, use entire company name as firstName
          if (firstNameRef.current)
            firstNameRef.current.value = session.user.companyName;
          if (lastNameRef.current) lastNameRef.current.value = '';
        }
      } else {
        // For non-business users, use firstName and lastName if available
        if (firstNameRef.current && session.user.firstName) {
          firstNameRef.current.value = session.user.firstName;
        }

        if (lastNameRef.current && session.user.lastName) {
          lastNameRef.current.value = session.user.lastName;
        }
      }

      // Auto-fill email for all user types
      if (emailRef.current && session.user.email) {
        emailRef.current.value = session.user.email;
      }
    }
  }, [session]);

  // Auto-hide toast after 5 seconds
  useEffect(() => {
    if (toastVisible) {
      const timer = setTimeout(() => {
        setToastVisible(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [toastVisible]);

  const showToast = (message: string, type: 'default' | 'destructive') => {
    setToastMessage(message);
    setToastType(type);
    setToastVisible(true);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      const form = e.currentTarget;
      const formData = new FormData(form);

      // Validate required fields
      const requiredFields = [
        'firstName',
        'lastName',
        'email',
        'phone',
        'message',
      ];
      for (const field of requiredFields) {
        if (!formData.get(field)) {
          showToast(
            `Please fill in the ${field.replace(/([A-Z])/g, ' $1').toLowerCase()} field`,
            'destructive'
          );
          setIsSubmitting(false);
          return;
        }
      }

      // Validate email format
      const email = formData.get('email') as string;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showToast('Please enter a valid email address', 'destructive');
        setIsSubmitting(false);
        return;
      }

      // Validate phone number (basic validation)
      const phone = formData.get('phone') as string;
      const phoneRegex = /^\+?[\d\s-()]{10,}$/;
      if (!phoneRegex.test(phone)) {
        showToast('Please enter a valid phone number', 'destructive');
        setIsSubmitting(false);
        return;
      }

      const response = await fetch('/api/contact', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.success) {
        showToast('Your message has been sent successfully!', 'default');
        form.reset();
        // Reset all form fields
        const inputs = form.querySelectorAll('input, textarea');
        inputs.forEach((element) => {
          if (
            element instanceof HTMLInputElement ||
            element instanceof HTMLTextAreaElement
          ) {
            element.value = '';
          }
        });
      } else {
        throw new Error(data.message || 'Failed to send message');
      }
    } catch (error) {
      showToast(
        error instanceof Error
          ? error.message
          : 'Failed to send message. Please try again.',
        'destructive'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ToastProvider>
      <section className="py-16 px-4 md:px-0 bg-globixs-bgAccent">
        <div className="max-w-7xl mx-auto pt-12 ">
          {/* Modern 3D Card with Glassmorphism */}
          <div className="relative  overflow-hidden shadow-xl bg-slate-50">
            {/* Content Wrapper */}
            <div className="relative grid grid-cols-1 lg:grid-cols-3">
              {/* Left Side - Form */}
              <div className="p-8 md:p-12 backdrop-blur-sm relative z-10 lg:col-span-2">
                <h2 className="text-4xl font-bold mb-2 text-black tracking-tight mt-12">
                  Get in Touch
                </h2>
                <p className="text-gray-900 mb-8">
                  We&apos;re excited to hear from you and help bring your vision
                  to life.
                </p>

                <form
                  ref={formRef}
                  onSubmit={handleSubmit}
                  className="space-y-5"
                  id="contact-form"
                >
                  <div className="grid grid-cols-2 gap-5">
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-globixs-primary to-globixs-secondary rounded-xl blur group-hover:blur-md transition-all duration-300 opacity-20"></div>
                      <div className="relative flex items-center bg-white border border-white/10 rounded-xl overflow-hidden px-3">
                        <FaUser className="h-5 w-5 text-black" />
                        <input
                          ref={firstNameRef}
                          name="firstName"
                          placeholder="First Name"
                          required
                          className="p-3 pl-2 w-full bg-transparent text-black placeholder-black/50 focus:outline-none focus:placeholder-black/80 transition-colors"
                        />
                      </div>
                    </div>

                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-globixs-primary to-globixs-secondary rounded-xl blur group-hover:blur-md transition-all duration-300 opacity-20"></div>
                      <div className="relative flex items-center bg-white border border-white/10 rounded-xl overflow-hidden px-3">
                        <FaUser className="h-5 w-5 text-black" />
                        <input
                          ref={lastNameRef}
                          name="lastName"
                          placeholder="Last Name"
                          required
                          className="p-3 pl-2 w-full bg-transparent text-black placeholder-black/50 focus:outline-none focus:placeholder-black/80 transition-colors"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-globixs-primary to-globixs-secondary rounded-xl blur group-hover:blur-md transition-all duration-300 opacity-20"></div>
                    <div className="relative flex items-center bg-white border border-white/10 rounded-xl overflow-hidden px-3">
                      <FaEnvelope className="h-5 w-5 text-black" />
                      <input
                        ref={emailRef}
                        name="email"
                        type="email"
                        placeholder="Email Address"
                        required
                        className="p-3 pl-2 w-full bg-transparent text-black placeholder-black/50 focus:outline-none focus:placeholder-black/80 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-globixs-primary to-globixs-secondary rounded-xl blur group-hover:blur-md transition-all duration-300 opacity-20"></div>
                    <div className="relative flex items-center bg-white border border-white/10 rounded-xl overflow-hidden px-3">
                      <FaPhone className="h-5 w-5 text-black" />
                      <input
                        ref={phoneRef}
                        name="phone"
                        type="tel"
                        placeholder="Phone Number"
                        required
                        className="p-3 pl-2 w-full bg-transparent text-black placeholder-black/50 focus:outline-none focus:placeholder-black/80 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-globixs-primary to-globixs-secondary rounded-xl blur group-hover:blur-md transition-all duration-300 opacity-20"></div>
                    <div className="relative flex bg-white border border-white/10 rounded-xl overflow-hidden px-3 py-3">
                      <FaCommentAlt className="h-5 w-5 text-black mt-1" />
                      <textarea
                        name="message"
                        placeholder="How can we help you today?"
                        required
                        rows={4}
                        className="p-1 pl-2 w-full bg-transparent text-black placeholder-black/50 focus:outline-none focus:placeholder-black/80 transition-colors resize-none"
                      ></textarea>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 text-sm text-gray-900 bg-white/5 p-3 rounded-xl border border-white/10">
                    <FaLock className="h-4 w-4 flex-shrink-0" />
                    <p>
                      Your information is encrypted and never shared with third
                      parties.
                    </p>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full relative overflow-hidden group"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-globixs-primary to-globixs-secondary rounded-xl blur-md transition-all duration-500 opacity-80 group-hover:opacity-100"></div>
                      <div className="relative bg-gradient-to-r from-globixs-primary to-globixs-secondary text-white font-medium py-4 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:bg-gradient-to-r group-hover:from-globixs-primary group-hover:to-globixs-secondary">
                        {isSubmitting ? (
                          <div className="flex items-center">
                            <svg
                              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            SENDING MESSAGE...
                          </div>
                        ) : (
                          <div className="flex items-center">
                            SEND MESSAGE
                            <FaPaperPlane className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform duration-300" />
                          </div>
                        )}
                      </div>
                    </button>
                  </div>
                </form>
              </div>

              {/* Right Side - Information & Graphics */}
              <div className="relative bg-gradient-to-br from-globixs-primary to-globixs-secondary/80 p-8 md:p-12 hidden lg:block overflow-hidden">
                <div className="absolute inset-0">
                  <div className="absolute inset-0 bg-globixs-primary/90"></div>
                  <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-b from-globixs-primary/30 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-t from-globixs-secondary/60 to-transparent"></div>

                  {/* Abstract Circles */}
                  <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 w-60 h-60 bg-globixs-primary/20 rounded-full filter blur-2xl"></div>
                  <div className="absolute bottom-1/4 left-1/2 transform -translate-x-1/2 w-80 h-80 bg-globixs-secondary/10 rounded-full filter blur-2xl"></div>
                </div>

                <div className="relative">
                  <h3 className="text-2xl font-bold text-white mb-4">
                    Why Work With Us
                  </h3>

                  <div className="space-y-6">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-globixs-primary to-globixs-secondary flex items-center justify-center flex-shrink-0">
                        <svg
                          className="w-4 h-4 text-white"
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
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-white">
                          Expert Team
                        </h4>
                        <p className="text-white mt-1">
                          Our professionals bring years of industry experience
                          to every project.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-globixs-primary to-globixs-secondary flex items-center justify-center flex-shrink-0">
                        <svg
                          className="w-4 h-4 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M13 10V3L4 14h7v7l9-11h-7z"
                          ></path>
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-white">
                          Fast Delivery
                        </h4>
                        <p className="text-white mt-1">
                          We deliver high-quality solutions on time and within
                          budget.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-globixs-primary to-globixs-secondary flex items-center justify-center flex-shrink-0">
                        <svg
                          className="w-4 h-4 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                          ></path>
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-white">
                          Secure Solutions
                        </h4>
                        <p className="text-white mt-1">
                          We prioritize security and confidentiality in
                          everything we do.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Quick Links Section */}
                  <div className="mt-8 border-t border-white/10 pt-8">
                    <h4 className="text-lg font-semibold text-white mb-4">
                      Quick Links
                    </h4>
                    <div className="space-y-4">
                      <Link
                        href="mailto:Connect@Globixs.com"
                        className="flex items-center space-x-3 text-white hover:text-white transition-colors"
                      >
                        <div className="w-8 h-8 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center transition-colors">
                          <MdEmail className="w-4 h-4" />
                        </div>
                        <span>Connect@Globixs.com</span>
                      </Link>
                      <Link
                        href="tel:+14256668998"
                        className="flex items-center space-x-3 text-white hover:text-white transition-colors"
                      >
                        <div className="w-8 h-8 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center transition-colors">
                          <MdPhone className="w-4 h-4" />
                        </div>
                        <span>+1 (425) 666-8998</span>
                      </Link>
                      {/* <Link
                        href="https://wa.me/14259005221"
                        className="flex items-center space-x-3 text-white hover:text-white transition-colors"
                      >
                        <div className="w-8 h-8 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center transition-colors">
                          <FaWhatsapp className="w-4 h-4" />
                        </div>
                        <span>WhatsApp</span>
                      </Link> */}
                    </div>
                  </div>

                  {/* Connect with us Section */}
                  <div className="mt-8">
                    <p className="text-white font-medium">Connect with us</p>
                    <div className="flex space-x-4 mt-3">
                      <Link
                        href="https://x.com/pioneer_it_sys"
                        className="w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center transition-colors"
                        aria-label="Twitter"
                      >
                        <FaTwitter className="w-5 h-5 text-white" />
                      </Link>
                      <Link
                        href="https://www.instagram.com/pioneerit_systems/"
                        className="w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center transition-colors"
                        aria-label="Instagram"
                      >
                        <FaInstagram className="w-5 h-5 text-white" />
                      </Link>
                      {/* <Link
                        href="#"
                        className="w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center transition-colors"
                        aria-label="LinkedIn"
                      >
                        <FaLinkedinIn className="w-5 h-5 text-white" />
                      </Link> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {toastVisible && (
          <Toast
            variant={toastType}
            className={`fixed bottom-4 right-4 z-50 w-auto max-w-md ${
              toastType === 'default'
                ? 'bg-globixs-primary/10 border-globixs-primary'
                : 'bg-red-500/10 border-red-500'
            }`}
          >
            <div className="flex">
              <div className="flex-1">
                <ToastTitle
                  className={
                    toastType === 'default'
                      ? 'text-globixs-primary'
                      : 'text-red-500'
                  }
                >
                  {toastType === 'default' ? 'Success' : 'Error'}
                </ToastTitle>
                <ToastDescription className="text-gray-700 dark:text-white">
                  {toastMessage}
                </ToastDescription>
              </div>
              <ToastClose
                onClick={() => setToastVisible(false)}
                className="opacity-100 text-gray-700 dark:text-white hover:text-gray-500"
              />
            </div>
          </Toast>
        )}
        <ToastViewport />
      </section>
    </ToastProvider>
  );
}
