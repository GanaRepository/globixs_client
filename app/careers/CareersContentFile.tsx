'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useInView } from 'react-intersection-observer';
import {
  FiMapPin,
  FiClock,
  FiMonitor,
  FiChevronDown,
  FiArrowRight,
} from 'react-icons/fi';
import { Button } from '@/components/ui/button';
import Toast from '@/components/Toast';
import { IJob } from '@/types';
import useSessionStore from '@/stores/useSessionStore';

export default function CareersContentFile() {
  const router = useRouter();
  const { session } = useSessionStore();
  const [jobs, setJobs] = useState<IJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openJobId, setOpenJobId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<IJob | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error' | 'warning';
    isVisible: boolean;
  } | null>(null);

  // Form refs for auto-filling user data
  const fullNameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const phoneNumberRef = useRef<HTMLInputElement>(null);

  // Add InView hooks for animations
  const { ref: jobsHeaderRef, inView: jobsHeaderInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const { ref: jobsListRef, inView: jobsListInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch('/api/admin/jobs');
        if (!response.ok) throw new Error('Failed to fetch jobs');

        const data = await response.json();
        if (data.success) {
          setJobs(data.jobs);
        } else {
          throw new Error(data.message);
        }
      } catch (error) {
        setError(
          error instanceof Error ? error.message : 'Failed to load jobs'
        );
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // Auto-fill form fields when modal opens and user is logged in
  useEffect(() => {
    if (isModalOpen && session?.user) {
      // Get name based on role
      let fullName = '';

      // For candidate and employee roles, use firstName and lastName
      if (
        session.user.role === 'candidate' ||
        session.user.role === 'employee'
      ) {
        if (session.user.firstName && session.user.lastName) {
          fullName = `${session.user.firstName} ${session.user.lastName}`;
        }
      }
      // For business role, use companyName
      else if (session.user.role === 'business' && session.user.companyName) {
        fullName = session.user.companyName;
      }
      // For admin role, leave blank or use any available name info
      else if (session.user.role === 'admin') {
        if (session.user.firstName && session.user.lastName) {
          fullName = `${session.user.firstName} ${session.user.lastName}`;
        }
      }

      // Set form field values if refs are available
      if (fullNameRef.current) {
        fullNameRef.current.value = fullName;
      }

      if (emailRef.current && session.user.email) {
        emailRef.current.value = session.user.email;
      }
    }
  }, [isModalOpen, session]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch('/api/admin/applications', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setIsModalOpen(false);
        setToast({
          message: 'Your application has been submitted successfully.',
          type: 'success',
          isVisible: true,
        });
        form.reset();
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      setToast({
        message: 'Failed to submit application. Please try again.',
        type: 'error',
        isVisible: true,
      });
    }
  };

  const toggleJobDetails = (jobId: string) => {
    setOpenJobId(openJobId === jobId ? null : jobId);
  };

  // New function to handle Apply Now button click
  const handleApplyClick = (e: React.MouseEvent, job: IJob) => {
    e.stopPropagation(); // Prevent toggling job details

    if (session) {
      // User is logged in, show application modal
      setSelectedJob(job);
      setIsModalOpen(true);
    } else {
      // User is not logged in, redirect to login page
      router.push('/login');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-gray-800 animate-pulse">
          Loading available positions...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-red-400">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className=" text-gray-800 py-16 bg-globixs-bgAccent ">
      {/* Job Listings Section */}
      <div className="container mx-auto px-4 md:px-16 py-12">
        <div
          ref={jobsHeaderRef}
          className={`mb-12 text-center transition-all duration-1000 ${
            jobsHeaderInView
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-8'
          }`}
        >
          <h2 className="text-4xl font-bold mb-4 font-heading">
            Current <span className="text-globixs-primary">Openings</span>
          </h2>
          <p className="text-gray-800 max-w-2xl mx-auto">
            Discover opportunities to grow your career and make a meaningful
            impact in the tech industry.
          </p>
        </div>

        <div
          ref={jobsListRef}
          className={`max-w-4xl mx-auto transition-all duration-1000 ${
            jobsListInView
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-8'
          }`}
        >
          {jobs.length === 0 ? (
            <div className="text-center py-12 bg-globixs-primary rounded-xl">
              <p className="text-xl text-white">
                No job openings available at the moment.
                <br />
                Please check back later for new opportunities.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {jobs.map((job, index) => (
                <div
                  key={job._id as string}
                  className="bg-white rounded-xl border border-gray-200 hover:border-globixs-primary/30 transition-all duration-300 overflow-hidden shadow-sm"
                  style={{
                    transitionDelay: `${index * 100}ms`,
                  }}
                  onClick={() => toggleJobDetails(job._id as string)}
                >
                  <div className="w-full px-8 py-6 text-left flex justify-between items-center">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">
                        {job.title}
                      </h3>
                      <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
                        <span className="flex items-center">
                          <FiMapPin className="w-4 h-4 mr-1 text-globixs-primary" />{' '}
                          {job.location}
                        </span>
                        <span className="flex items-center">
                          <FiClock className="w-4 h-4 mr-1 text-globixs-primary" />{' '}
                          {job.experience}
                        </span>
                        <span className="flex items-center">
                          <FiMonitor className="w-4 h-4 mr-1 text-globixs-primary" />{' '}
                          {job.type}
                        </span>
                      </div>
                    </div>
                    <FiChevronDown
                      className={`w-5 h-5 text-globixs-primary transition-transform duration-300 ${
                        openJobId === (job._id as string) ? 'rotate-180' : ''
                      }`}
                    />
                  </div>

                  {openJobId === (job._id as string) && (
                    <div className="px-8 pb-6 animate-fadeIn">
                      <div className="text-gray-700 whitespace-pre-wrap font-[inherit] text-sm mb-6">
                        {job.description}
                      </div>
                      <Button
                        onClick={(e) => handleApplyClick(e, job)}
                        className="bg-globixs-primary hover:bg-globixs-primary/90 text-white px-8 py-3 rounded-full transition-all duration-300 flex items-center group"
                      >
                        Apply Now
                        <FiArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Application Modal */}
      {isModalOpen && selectedJob && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white rounded-xl w-full max-w-md mx-4 p-8 border border-gray-200 shadow-xl transform transition-all duration-300 animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                Apply for{' '}
                <span className="text-globixs-primary">
                  {selectedJob.title}
                </span>
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-800 hover:text-gray-600 p-1 rounded-full hover:bg-gray-200 transition-colors"
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="hidden"
                name="jobId"
                value={selectedJob._id as string}
              />
              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  {session?.user?.role === 'business'
                    ? 'Company Name'
                    : 'Full Name'}{' '}
                  *
                </label>
                <input
                  name="fullName"
                  ref={fullNameRef}
                  required
                  className="w-full px-3 py-2 bg-white text-black border border-gray-300 hover:border-globixs-primary/30 focus:border-globixs-primary/50 rounded-md transition-colors focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  Email *
                </label>
                <input
                  name="email"
                  ref={emailRef}
                  type="email"
                  required
                  className="w-full px-3 py-2 bg-white text-black border border-gray-300 hover:border-globixs-primary/30 focus:border-globixs-primary/50 rounded-md transition-colors focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  Phone Number *
                </label>
                <input
                  name="phoneNumber"
                  ref={phoneNumberRef}
                  type="tel"
                  required
                  className="w-full px-3 py-2 bg-white text-black border border-gray-300 hover:border-globixs-primary/30 focus:border-globixs-primary/50 rounded-md transition-colors focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  {session?.user?.role === 'business'
                    ? 'Required Skills'
                    : 'Your Skills'}{' '}
                  *
                </label>
                <textarea
                  name="skills"
                  required
                  className="w-full px-3 py-2 bg-white text-black border border-gray-300 hover:border-globixs-primary/30 focus:border-globixs-primary/50 rounded-md transition-colors focus:outline-none min-h-[100px]"
                  placeholder={
                    session?.user?.role === 'business'
                      ? 'Describe the skills required for this position'
                      : 'List your relevant skills and experience'
                  }
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  {session?.user?.role === 'business'
                    ? 'Job Description Document'
                    : 'Resume/CV'}{' '}
                  *
                </label>
                <input
                  name="resume"
                  type="file"
                  required
                  className="w-full px-3 py-2 bg-white text-black border border-gray-300 hover:border-globixs-primary/30 focus:border-globixs-primary/50 rounded-md transition-colors focus:outline-none"
                  accept=".pdf,.doc,.docx"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-globixs-primary hover:bg-globixs-primary/90 text-white py-3 rounded-full transition-all duration-300 flex items-center justify-center group mt-6"
              >
                Submit Application
                <FiArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          isVisible={toast.isVisible}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
