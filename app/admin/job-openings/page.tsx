// 'use client';

// import { useState, useEffect, useCallback } from 'react';
// import {
//   Trash2,
//   BriefcaseBusiness,
//   PlusCircle,
//   ArrowRight,
// } from 'lucide-react';
// import { IJob } from '@/types';
// import {
//   ToastProvider,
//   ToastViewport,
//   Toast,
//   ToastTitle,
//   ToastDescription,
//   ToastClose,
// } from '@/components/ui/toast';
// import { Button } from '@/components/ui/button';
// import ConfirmPopup from '@/components/ui/ConfirmPopup';

// const JOB_TYPES = [
//   { value: 'on-site', label: 'On-site' },
//   { value: 'remote', label: 'Remote' },
//   { value: 'hybrid', label: 'Hybrid' },
//   { value: 'fulltime', label: 'Full Time' },
// ] as const;

// type JobFormData = {
//   title: string;
//   location: string;
//   experience: string;
//   type: IJob['type'];
//   description: string;
// };

// const INITIAL_JOB: JobFormData = {
//   title: '',
//   location: '',
//   experience: '',
//   type: 'on-site',
//   description: '',
// };

// type ToastType = 'default' | 'destructive';

// export default function AdminJobOpenings() {
//   const [jobs, setJobs] = useState<IJob[]>([]);
//   const [newJob, setNewJob] = useState<JobFormData>(INITIAL_JOB);
//   const [isLoading, setIsLoading] = useState(true);
//   const [toast, setToast] = useState({
//     show: false,
//     message: '',
//     type: 'default' as ToastType,
//   });

//   // State for the confirm popup
//   const [confirmPopup, setConfirmPopup] = useState({
//     isOpen: false,
//     jobId: '',
//   });

//   const fetchJobs = useCallback(async () => {
//     try {
//       const res = await fetch('/api/admin/jobs');
//       const data = await res.json();
//       if (data.success) setJobs(data.jobs);
//     } catch (error) {
//       showToast('Failed to load jobs', 'destructive');
//     } finally {
//       setIsLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchJobs();
//   }, [fetchJobs]);

//   const showToast = (message: string, type: ToastType = 'default') => {
//     setToast({ show: true, message, type });
//     setTimeout(
//       () => setToast({ show: false, message: '', type: 'default' }),
//       3000
//     );
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       const res = await fetch('/api/admin/jobs', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(newJob),
//       });
//       const data = await res.json();

//       if (data.success) {
//         showToast(data.message || 'Job added successfully');
//         setNewJob(INITIAL_JOB);
//         fetchJobs();
//       } else {
//         throw new Error(data.message || 'Failed to add job');
//       }
//     } catch (error) {
//       showToast(
//         error instanceof Error ? error.message : 'Failed to add job',
//         'destructive'
//       );
//     }
//   };

//   // Open confirm popup instead of directly deleting
//   const confirmDelete = (id: string) => {
//     setConfirmPopup({
//       isOpen: true,
//       jobId: id,
//     });
//   };

//   // Handle actual deletion when confirmed
//   const handleDelete = async () => {
//     const id = confirmPopup.jobId;

//     try {
//       const res = await fetch(`/api/admin/jobs/${id}`, { method: 'DELETE' });
//       const data = await res.json();

//       if (data.success) {
//         showToast(data.message || 'Job deleted successfully');
//         fetchJobs();
//       } else {
//         throw new Error(data.message || 'Failed to delete job');
//       }
//     } catch (error) {
//       showToast(
//         error instanceof Error ? error.message : 'Failed to delete job',
//         'destructive'
//       );
//     } finally {
//       // Close the confirm popup
//       setConfirmPopup({ isOpen: false, jobId: '' });
//     }
//   };

//   // Cancel deletion
//   const cancelDelete = () => {
//     setConfirmPopup({ isOpen: false, jobId: '' });
//   };

//   if (isLoading) {
//     return (
//       <div className="flex justify-center items-center min-h-screen bg-[#F6F9FC]">
//         <div className="text-center p-8">
//           <div className="animate-spin h-8 w-8 border-4 border-[#7E69AB] border-t-transparent rounded-full mx-auto mb-4"></div>
//           <p className="text-gray-700">Loading jobs...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <ToastProvider>
//       <main className="min-h-screen bg-[#F6F9FC] py-12 px-4">
//         <div className="max-w-4xl mx-auto">
//           {/* Header */}
//           <div className="mb-8">
//             <div className="inline-flex items-center gap-2 bg-[#7E69AB]/10 rounded-full px-4 py-1.5 mb-4 border border-[#7E69AB]/20">
//               <BriefcaseBusiness className="w-4 h-4 text-[#7E69AB]" />
//               <span className="text-[#7E69AB] text-sm uppercase tracking-wider font-medium">
//                 Post Job Openings in Your Company
//               </span>
//             </div>
//             <div className="flex justify-between items-center">
//               <h1 className="text-3xl font-bold text-gray-900">
//                 Post Openings
//               </h1>
//               <a
//                 href="/careers"
//                 className="text-[#7E69AB] hover:text-[#9b87f5] flex items-center group transition-colors"
//               >
//                 View Careers Page
//                 <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
//               </a>
//             </div>
//           </div>

//           <div className="bg-white/90 backdrop-blur-sm rounded-xl p-8 border border-gray-100 hover:border-[#7E69AB]/20 transition-all duration-300 shadow-lg mb-12">
//             <h2 className="text-2xl font-bold text-gray-900 mb-6">
//               <span className="text-[#7E69AB]">Add</span> New Job
//             </h2>
//             <form onSubmit={handleSubmit} className="space-y-6">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div>
//                   <label className="block text-sm text-gray-600 mb-2">
//                     Job Title *
//                   </label>
//                   <input
//                     required
//                     className="w-full px-3 py-2 bg-white text-gray-800 border border-gray-200 hover:border-[#7E69AB]/30 focus:border-[#7E69AB]/50 rounded-md transition-colors focus:outline-none"
//                     value={newJob.title}
//                     onChange={(e) =>
//                       setNewJob({ ...newJob, title: e.target.value })
//                     }
//                     placeholder="e.g., Senior Frontend Developer"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm text-gray-600 mb-2">
//                     Location *
//                   </label>
//                   <input
//                     required
//                     className="w-full px-3 py-2 bg-white text-gray-800 border border-gray-200 hover:border-[#7E69AB]/30 focus:border-[#7E69AB]/50 rounded-md transition-colors focus:outline-none"
//                     value={newJob.location}
//                     onChange={(e) =>
//                       setNewJob({ ...newJob, location: e.target.value })
//                     }
//                     placeholder="e.g., New York, NY"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm text-gray-600 mb-2">
//                     Experience *
//                   </label>
//                   <input
//                     required
//                     className="w-full px-3 py-2 bg-white text-gray-800 border border-gray-200 hover:border-[#7E69AB]/30 focus:border-[#7E69AB]/50 rounded-md transition-colors focus:outline-none"
//                     value={newJob.experience}
//                     onChange={(e) =>
//                       setNewJob({ ...newJob, experience: e.target.value })
//                     }
//                     placeholder="e.g., 3-5 years"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm text-gray-600 mb-2">
//                     Type *
//                   </label>
//                   <select
//                     required
//                     className="w-full px-3 py-2 bg-white text-gray-800 border border-gray-200 hover:border-[#7E69AB]/30 focus:border-[#7E69AB]/50 rounded-md transition-colors focus:outline-none"
//                     value={newJob.type}
//                     onChange={(e) =>
//                       setNewJob({
//                         ...newJob,
//                         type: e.target.value as IJob['type'],
//                       })
//                     }
//                   >
//                     <option value="">Select type</option>
//                     {JOB_TYPES.map((type) => (
//                       <option key={type.value} value={type.value}>
//                         {type.label}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               </div>
//               <div>
//                 <label className="block text-sm text-gray-600 mb-2">
//                   Description *
//                 </label>
//                 <textarea
//                   required
//                   className="w-full px-3 py-2 bg-white text-gray-800 border border-gray-200 hover:border-[#7E69AB]/30 focus:border-[#7E69AB]/50 rounded-md transition-colors focus:outline-none min-h-[200px]"
//                   value={newJob.description}
//                   onChange={(e) =>
//                     setNewJob({ ...newJob, description: e.target.value })
//                   }
//                   style={{ whiteSpace: 'pre-wrap' }}
//                   placeholder="Provide a detailed job description including responsibilities and requirements..."
//                 />
//               </div>
//               <Button
//                 type="submit"
//                 className="w-full bg-gradient-to-r from-[#7E69AB] to-[#33C3F0] hover:from-[#7E69AB]/90 hover:to-[#33C3F0]/90 text-white rounded-full py-3 transition-all duration-300 flex items-center justify-center group"
//               >
//                 <PlusCircle className="w-5 h-5 mr-2" />
//                 Add Job Position
//               </Button>
//             </form>
//           </div>

//           {/* Current Jobs List */}
//           {jobs.length > 0 && (
//             <div className="bg-white/90 backdrop-blur-sm rounded-xl p-8 border border-gray-100 hover:border-[#7E69AB]/20 transition-all duration-300 shadow-lg mb-8">
//               <h2 className="text-xl font-bold text-gray-900 mb-6">
//                 Current Job Listings
//               </h2>
//               <div className="space-y-4">
//                 {jobs.map((job) => (
//                   <div
//                     key={job._id as string}
//                     className="bg-white rounded-lg p-4 border border-gray-100 hover:border-[#7E69AB]/30 transition-all duration-300"
//                   >
//                     <div className="flex justify-between items-start">
//                       <div>
//                         <h3 className="text-lg font-medium text-gray-900">
//                           {job.title}
//                         </h3>
//                         <div className="flex flex-wrap gap-3 mt-2 text-sm">
//                           <span className="text-gray-600">{job.location}</span>
//                           <span className="text-gray-400">•</span>
//                           <span className="text-gray-600">
//                             {job.experience}
//                           </span>
//                           <span className="text-gray-400">•</span>
//                           <span className="text-gray-600">{job.type}</span>
//                         </div>
//                       </div>
//                       <button
//                         onClick={() => confirmDelete(job._id as string)}
//                         className="text-red-500 hover:text-red-400 p-1 rounded-full hover:bg-red-500/10 transition-colors"
//                         aria-label="Delete job"
//                       >
//                         <Trash2 className="h-5 w-5" />
//                       </button>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* Confirm Popup */}
//           <ConfirmPopup
//             isOpen={confirmPopup.isOpen}
//             title="Delete Job Position"
//             message="Are you sure you want to delete this job position? This action cannot be undone."
//             confirmText="Delete Job"
//             cancelText="Cancel"
//             onConfirm={handleDelete}
//             onCancel={cancelDelete}
//             variant="danger"
//           />

//           {toast.show && (
//             <Toast
//               variant={toast.type}
//               className={toast.type === 'default' ? 'border-[#7E69AB]' : ''}
//             >
//               <div className="flex">
//                 <div className="flex-1">
//                   <ToastTitle>
//                     {toast.type === 'default' ? 'Success' : 'Error'}
//                   </ToastTitle>
//                   <ToastDescription>{toast.message}</ToastDescription>
//                 </div>
//                 <ToastClose
//                   onClick={() => setToast({ ...toast, show: false })}
//                 />
//               </div>
//             </Toast>
//           )}
//           <ToastViewport />
//         </div>
//       </main>
//     </ToastProvider>
//   );
// }

'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Trash2,
  BriefcaseBusiness,
  PlusCircle,
  ArrowRight,
  Edit,
  X,
} from 'lucide-react';
import { IJob } from '@/types';
import {
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
} from '@/components/ui/toast';
import { Button } from '@/components/ui/button';
import ConfirmPopup from '@/components/ui/ConfirmPopup';

const JOB_TYPES = [
  { value: 'on-site', label: 'On-site' },
  { value: 'remote', label: 'Remote' },
  { value: 'hybrid', label: 'Hybrid' },
  { value: 'fulltime', label: 'Full Time' },
] as const;

type JobFormData = {
  title: string;
  location: string;
  experience: string;
  type: IJob['type'];
  description: string;
};

const INITIAL_JOB: JobFormData = {
  title: '',
  location: '',
  experience: '',
  type: 'on-site',
  description: '',
};

type ToastType = 'default' | 'destructive';

export default function AdminJobOpenings() {
  const [jobs, setJobs] = useState<IJob[]>([]);
  const [formJob, setFormJob] = useState<JobFormData>(INITIAL_JOB);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState({
    show: false,
    message: '',
    type: 'default' as ToastType,
  });

  // State to track if we're editing an existing job
  const [editingJobId, setEditingJobId] = useState<string | null>(null);
  const isEditing = !!editingJobId;

  // State for the confirm popup
  const [confirmPopup, setConfirmPopup] = useState({
    isOpen: false,
    jobId: '',
  });

  const fetchJobs = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/jobs');
      const data = await res.json();
      if (data.success) setJobs(data.jobs);
    } catch (error) {
      showToast('Failed to load jobs', 'destructive');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const showToast = (message: string, type: ToastType = 'default') => {
    setToast({ show: true, message, type });
    setTimeout(
      () => setToast({ show: false, message: '', type: 'default' }),
      3000
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let url = '/api/admin/jobs';
      let method = 'POST';

      // If editing, use PUT method and include the job ID in URL
      if (isEditing && editingJobId) {
        url = `/api/admin/jobs/${editingJobId}`;
        method = 'PUT';
      }

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formJob),
      });

      const data = await res.json();

      if (data.success) {
        showToast(
          data.message || `Job ${isEditing ? 'updated' : 'added'} successfully`
        );
        setFormJob(INITIAL_JOB);
        setEditingJobId(null);
        fetchJobs();
      } else {
        throw new Error(
          data.message || `Failed to ${isEditing ? 'update' : 'add'} job`
        );
      }
    } catch (error) {
      showToast(
        error instanceof Error
          ? error.message
          : `Failed to ${isEditing ? 'update' : 'add'} job`,
        'destructive'
      );
    }
  };

  // Start editing a job
  const handleEdit = (job: IJob) => {
    setFormJob({
      title: job.title,
      location: job.location,
      experience: job.experience,
      type: job.type,
      description: job.description,
    });
    setEditingJobId(job._id as string);

    // Scroll to the form
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  // Cancel editing
  const cancelEdit = () => {
    setFormJob(INITIAL_JOB);
    setEditingJobId(null);
  };

  // Open confirm popup instead of directly deleting
  const confirmDelete = (id: string) => {
    setConfirmPopup({
      isOpen: true,
      jobId: id,
    });
  };

  // Handle actual deletion when confirmed
  const handleDelete = async () => {
    const id = confirmPopup.jobId;

    try {
      const res = await fetch(`/api/admin/jobs/${id}`, { method: 'DELETE' });
      const data = await res.json();

      if (data.success) {
        showToast(data.message || 'Job deleted successfully');
        fetchJobs();
      } else {
        throw new Error(data.message || 'Failed to delete job');
      }
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : 'Failed to delete job',
        'destructive'
      );
    } finally {
      // Close the confirm popup
      setConfirmPopup({ isOpen: false, jobId: '' });
    }
  };

  // Cancel deletion
  const cancelDelete = () => {
    setConfirmPopup({ isOpen: false, jobId: '' });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#F6F9FC]">
        <div className="text-center p-8">
          <div className="animate-spin h-8 w-8 border-4 border-[#7E69AB] border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-700">Loading jobs...</p>
        </div>
      </div>
    );
  }

  return (
    <ToastProvider>
      <main className="min-h-screen bg-[#F6F9FC] py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 bg-[#7E69AB]/10 rounded-full px-4 py-1.5 mb-4 border border-[#7E69AB]/20">
              <BriefcaseBusiness className="w-4 h-4 text-[#7E69AB]" />
              <span className="text-[#7E69AB] text-sm uppercase tracking-wider font-medium">
                Post Job Openings in Your Company
              </span>
            </div>
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-gray-900">
                Post Openings
              </h1>
              <a
                href="/careers"
                className="text-[#7E69AB] hover:text-[#9b87f5] flex items-center group transition-colors"
              >
                View Careers Page
                <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-8 border border-gray-100 hover:border-[#7E69AB]/20 transition-all duration-300 shadow-lg mb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                <span className="text-[#7E69AB]">
                  {isEditing ? 'Edit' : 'Add'}
                </span>{' '}
                {isEditing ? 'Existing' : 'New'} Job
              </h2>
              {isEditing && (
                <button
                  onClick={cancelEdit}
                  className="flex items-center text-gray-500 hover:text-[#7E69AB] transition-colors"
                >
                  <X className="w-4 h-4 mr-1" />
                  Cancel Edit
                </button>
              )}
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-gray-600 mb-2">
                    Job Title *
                  </label>
                  <input
                    required
                    className="w-full px-3 py-2 bg-white text-gray-800 border border-gray-200 hover:border-[#7E69AB]/30 focus:border-[#7E69AB]/50 rounded-md transition-colors focus:outline-none"
                    value={formJob.title}
                    onChange={(e) =>
                      setFormJob({ ...formJob, title: e.target.value })
                    }
                    placeholder="e.g., Senior Frontend Developer"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-2">
                    Location *
                  </label>
                  <input
                    required
                    className="w-full px-3 py-2 bg-white text-gray-800 border border-gray-200 hover:border-[#7E69AB]/30 focus:border-[#7E69AB]/50 rounded-md transition-colors focus:outline-none"
                    value={formJob.location}
                    onChange={(e) =>
                      setFormJob({ ...formJob, location: e.target.value })
                    }
                    placeholder="e.g., New York, NY"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-2">
                    Experience *
                  </label>
                  <input
                    required
                    className="w-full px-3 py-2 bg-white text-gray-800 border border-gray-200 hover:border-[#7E69AB]/30 focus:border-[#7E69AB]/50 rounded-md transition-colors focus:outline-none"
                    value={formJob.experience}
                    onChange={(e) =>
                      setFormJob({ ...formJob, experience: e.target.value })
                    }
                    placeholder="e.g., 3-5 years"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-2">
                    Type *
                  </label>
                  <select
                    required
                    className="w-full px-3 py-2 bg-white text-gray-800 border border-gray-200 hover:border-[#7E69AB]/30 focus:border-[#7E69AB]/50 rounded-md transition-colors focus:outline-none"
                    value={formJob.type}
                    onChange={(e) =>
                      setFormJob({
                        ...formJob,
                        type: e.target.value as IJob['type'],
                      })
                    }
                  >
                    <option value="">Select type</option>
                    {JOB_TYPES.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  Description *
                </label>
                <textarea
                  required
                  className="w-full px-3 py-2 bg-white text-gray-800 border border-gray-200 hover:border-[#7E69AB]/30 focus:border-[#7E69AB]/50 rounded-md transition-colors focus:outline-none min-h-[200px]"
                  value={formJob.description}
                  onChange={(e) =>
                    setFormJob({ ...formJob, description: e.target.value })
                  }
                  style={{ whiteSpace: 'pre-wrap' }}
                  placeholder="Provide a detailed job description including responsibilities and requirements..."
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-[#7E69AB] to-[#33C3F0] hover:from-[#7E69AB]/90 hover:to-[#33C3F0]/90 text-white rounded-full py-3 transition-all duration-300 flex items-center justify-center group"
              >
                {isEditing ? (
                  <>
                    <Edit className="w-5 h-5 mr-2" />
                    Update Job Position
                  </>
                ) : (
                  <>
                    <PlusCircle className="w-5 h-5 mr-2" />
                    Add Job Position
                  </>
                )}
              </Button>
            </form>
          </div>

          {/* Current Jobs List */}
          {jobs.length > 0 && (
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-8 border border-gray-100 hover:border-[#7E69AB]/20 transition-all duration-300 shadow-lg mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Current Job Listings
              </h2>
              <div className="space-y-4">
                {jobs.map((job) => (
                  <div
                    key={job._id as string}
                    className="bg-white rounded-lg p-4 border border-gray-100 hover:border-[#7E69AB]/30 transition-all duration-300"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          {job.title}
                        </h3>
                        <div className="flex flex-wrap gap-3 mt-2 text-sm">
                          <span className="text-gray-600">{job.location}</span>
                          <span className="text-gray-400">•</span>
                          <span className="text-gray-600">
                            {job.experience}
                          </span>
                          <span className="text-gray-400">•</span>
                          <span className="text-gray-600">{job.type}</span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(job)}
                          className="text-[#7E69AB] hover:text-[#9b87f5] p-1 rounded-full hover:bg-[#7E69AB]/10 transition-colors"
                          aria-label="Edit job"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => confirmDelete(job._id as string)}
                          className="text-red-500 hover:text-red-400 p-1 rounded-full hover:bg-red-500/10 transition-colors"
                          aria-label="Delete job"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Confirm Popup */}
          <ConfirmPopup
            isOpen={confirmPopup.isOpen}
            title="Delete Job Position"
            message="Are you sure you want to delete this job position? This action cannot be undone."
            confirmText="Delete Job"
            cancelText="Cancel"
            onConfirm={handleDelete}
            onCancel={cancelDelete}
            variant="danger"
          />

          {toast.show && (
            <Toast
              variant={toast.type}
              className={toast.type === 'default' ? 'border-[#7E69AB]' : ''}
            >
              <div className="flex">
                <div className="flex-1">
                  <ToastTitle>
                    {toast.type === 'default' ? 'Success' : 'Error'}
                  </ToastTitle>
                  <ToastDescription>{toast.message}</ToastDescription>
                </div>
                <ToastClose
                  onClick={() => setToast({ ...toast, show: false })}
                />
              </div>
            </Toast>
          )}
          <ToastViewport />
        </div>
      </main>
    </ToastProvider>
  );
}
