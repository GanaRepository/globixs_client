// 'use client';

// import { useState, useEffect, useCallback } from 'react';
// import { IJobApplication } from '@/types';
// import {
//   Download,
//   Trash,
//   ClipboardList,
//   ChevronLeft,
//   ChevronRight,
//   Calendar,
//   User,
//   Mail,
//   Phone,
//   Code,
// } from 'lucide-react';
// import { Card } from '@/components/ui/card';
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from '@/components/ui/table';
// import { Button } from '@/components/ui/button';
// import {
//   ToastProvider,
//   ToastViewport,
//   Toast,
//   ToastTitle,
//   ToastDescription,
//   ToastClose,
// } from '@/components/ui/toast';
// import ConfirmPopup from '@/components/ui/ConfirmPopup';

// // EXACT COLORS FROM SCREENSHOTS
// // Primary Purple: #7E69AB
// // Purple Light: #9b87f5
// // Purple Dark: #6E59A5
// // Primary Teal: #33C3F0
// // Teal Light: #84e6d9
// // Teal Dark: #20a7d3
// // Background: #F6F9FC

// interface ApplicationResponse {
//   success: boolean;
//   applications: IJobApplication[];
//   pagination: {
//     totalPages: number;
//     currentPage: number;
//   };
//   message?: string;
// }

// export default function ApplicationsPage() {
//   const [applications, setApplications] = useState<IJobApplication[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [toast, setToast] = useState<{
//     visible: boolean;
//     message: string;
//     type: 'default' | 'destructive';
//   }>({
//     visible: false,
//     message: '',
//     type: 'default',
//   });

//   // State for confirm popup
//   const [confirmPopup, setConfirmPopup] = useState({
//     isOpen: false,
//     applicationId: '',
//     applicationName: '', // Store name for better UX in confirmation message
//   });

//   const showToast = useCallback(
//     (message: string, type: 'default' | 'destructive') => {
//       setToast({ visible: true, message, type });
//       setTimeout(() => setToast((prev) => ({ ...prev, visible: false })), 3000);
//     },
//     []
//   );

//   const fetchApplications = useCallback(async () => {
//     try {
//       setLoading(true);
//       const queryParams = new URLSearchParams({
//         page: currentPage.toString(),
//         limit: '10',
//       });

//       const response = await fetch(`/api/admin/applications?${queryParams}`);
//       const data: ApplicationResponse = await response.json();

//       if (data.success) {
//         setApplications(data.applications);
//         setTotalPages(data.pagination?.totalPages || 1);
//       } else {
//         throw new Error(data.message || 'Failed to fetch applications');
//       }
//     } catch (error) {
//       showToast('Failed to fetch applications', 'destructive');
//     } finally {
//       setLoading(false);
//     }
//   }, [currentPage, showToast]);

//   useEffect(() => {
//     fetchApplications();
//   }, [fetchApplications]);

//   const handleDownload = async (fileId: string) => {
//     try {
//       const response = await fetch('/api/admin/files', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ fileId }),
//       });

//       if (!response.ok) throw new Error('Download failed');

//       const blob = await response.blob();
//       const url = window.URL.createObjectURL(blob);
//       const a = document.createElement('a');
//       a.href = url;
//       a.download = `resume-${fileId}`;
//       document.body.appendChild(a);
//       a.click();
//       document.body.removeChild(a);
//       window.URL.revokeObjectURL(url);

//       showToast('File downloaded successfully', 'default');
//     } catch (error) {
//       showToast('Failed to download file', 'destructive');
//     }
//   };

//   // Show confirmation popup instead of directly deleting
//   const confirmDelete = (id: string, name: string) => {
//     setConfirmPopup({
//       isOpen: true,
//       applicationId: id,
//       applicationName: name,
//     });
//   };

//   // Handle actual deletion when confirmed
//   const handleDelete = async () => {
//     const id = confirmPopup.applicationId;

//     try {
//       const response = await fetch(`/api/admin/applications`, {
//         method: 'DELETE',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ id }),
//       });

//       const data = await response.json();
//       if (data.success) {
//         showToast('Application deleted successfully', 'default');
//         fetchApplications();
//       }
//     } catch (error) {
//       showToast('Failed to delete application', 'destructive');
//     } finally {
//       // Close the confirm popup
//       setConfirmPopup({
//         isOpen: false,
//         applicationId: '',
//         applicationName: '',
//       });
//     }
//   };

//   // Cancel deletion
//   const cancelDelete = () => {
//     setConfirmPopup({ isOpen: false, applicationId: '', applicationName: '' });
//   };

//   if (loading && applications.length === 0) {
//     return (
//       <div className="flex justify-center items-center min-h-screen bg-[#F6F9FC]">
//         <div className="text-center p-8 text-gray-700">
//           <div className="animate-spin h-8 w-8 border-4 border-[#7E69AB] border-t-transparent rounded-full mx-auto mb-4"></div>
//           <p>Loading applications...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <ToastProvider>
//       <div className="min-h-screen bg-[#F6F9FC] py-8 px-8">
//         <div className="max-w-7xl mx-auto">
//           {/* Header */}
//           <div className="mb-6">
//             <div className="inline-flex items-center gap-2 bg-[#7E69AB]/10 rounded-full px-4 py-1.5 mb-3 border border-[#7E69AB]/20">
//               <ClipboardList className="w-4 h-4 text-[#7E69AB]" />
//               <span className="text-[#7E69AB] text-sm uppercase tracking-wider font-medium">
//                 Admin Dashboard
//               </span>
//             </div>
//             <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
//               Job Applications
//             </h1>
//             <p className="text-gray-700 text-sm sm:text-base">
//               Review and manage all job applications submitted through the
//               careers page.
//             </p>
//           </div>

//           {/* Responsive Table Card */}
//           <Card className="bg-white backdrop-blur-sm border border-gray-100 hover:border-[#7E69AB]/20 transition-all duration-300 rounded-xl shadow-lg">
//             {/* Small mobile screens: Card view */}
//             <div className="block sm:hidden">
//               {applications.length === 0 ? (
//                 <div className="p-6 text-center">
//                   <div className="flex flex-col items-center text-gray-400">
//                     <ClipboardList className="h-8 w-8 mb-2 opacity-50" />
//                     <p>No applications found</p>
//                   </div>
//                 </div>
//               ) : (
//                 <div className="divide-y divide-gray-200">
//                   {applications.map((application) => (
//                     <div key={application._id} className="p-4">
//                       <div className="flex justify-between items-center mb-2">
//                         <h3 className="text-gray-900 font-medium">
//                           {application.fullName}
//                         </h3>
//                         <span className="text-xs text-gray-500 flex items-center">
//                           <Calendar className="h-3 w-3 mr-1" />
//                           {new Date(application.createdAt).toLocaleDateString()}
//                         </span>
//                       </div>

//                       <div className="space-y-2 mb-3">
//                         <div className="flex items-center text-gray-700">
//                           <Mail className="h-4 w-4 mr-2 text-[#7E69AB]" />
//                           <span className="text-sm truncate">
//                             {application.email}
//                           </span>
//                         </div>

//                         <div className="flex items-center text-gray-700">
//                           <Phone className="h-4 w-4 mr-2 text-[#7E69AB]" />
//                           <span className="text-sm">
//                             {application.phoneNumber}
//                           </span>
//                         </div>

//                         <div className="flex items-start text-gray-700">
//                           <Code className="h-4 w-4 mr-2 mt-0.5 text-[#7E69AB]" />
//                           <span className="text-sm truncate">
//                             {application.skills}
//                           </span>
//                         </div>
//                       </div>

//                       <div className="flex space-x-2 pt-2">
//                         <Button
//                           size="sm"
//                           variant="outline"
//                           onClick={() => handleDownload(application.fileId)}
//                           className="text-[#7E69AB] border-[#7E69AB]/50 hover:bg-[#7E69AB]/10 hover:border-[#7E69AB] transition-colors flex-1"
//                         >
//                           <Download className="h-4 w-4 mr-2" />
//                           Resume
//                         </Button>
//                         <Button
//                           size="sm"
//                           variant="outline"
//                           className="text-red-500 border-red-500/50 hover:bg-red-500/10 hover:border-red-500 transition-colors"
//                           onClick={() =>
//                             confirmDelete(application._id, application.fullName)
//                           }
//                         >
//                           <Trash className="h-4 w-4" />
//                         </Button>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>

//             {/* Tablet view: Simplified table */}
//             <div className="hidden sm:block lg:hidden">
//               <div className="overflow-x-auto">
//                 <Table>
//                   <TableHeader>
//                     <TableRow className="border-b border-gray-200">
//                       <TableHead className="text-gray-600 whitespace-nowrap">
//                         Applicant
//                       </TableHead>
//                       <TableHead className="text-gray-600 whitespace-nowrap">
//                         Contact
//                       </TableHead>
//                       <TableHead className="text-gray-600 whitespace-nowrap">
//                         Actions
//                       </TableHead>
//                     </TableRow>
//                   </TableHeader>
//                   <TableBody>
//                     {applications.length === 0 ? (
//                       <TableRow>
//                         <TableCell colSpan={3} className="text-center py-8">
//                           <div className="flex flex-col items-center text-gray-400">
//                             <ClipboardList className="h-8 w-8 mb-2 opacity-50" />
//                             <p>No applications found</p>
//                           </div>
//                         </TableCell>
//                       </TableRow>
//                     ) : (
//                       applications.map((application) => (
//                         <TableRow
//                           key={application._id}
//                           className="border-b border-gray-200 hover:bg-[#7E69AB]/5 transition-colors"
//                         >
//                           <TableCell>
//                             <div className="flex flex-col">
//                               <div className="font-medium text-gray-900">
//                                 {application.fullName}
//                               </div>
//                               <div className="text-xs text-gray-500 mt-1">
//                                 {new Date(
//                                   application.createdAt
//                                 ).toLocaleDateString()}
//                               </div>
//                             </div>
//                           </TableCell>
//                           <TableCell>
//                             <div className="flex flex-col gap-1">
//                               <div className="flex items-center text-gray-700">
//                                 <Mail className="h-4 w-4 mr-2 text-[#7E69AB]" />
//                                 <span className="text-sm truncate max-w-[200px]">
//                                   {application.email}
//                                 </span>
//                               </div>
//                               <div className="flex items-center text-gray-700">
//                                 <Phone className="h-4 w-4 mr-2 text-[#7E69AB]" />
//                                 <span className="text-sm">
//                                   {application.phoneNumber}
//                                 </span>
//                               </div>
//                             </div>
//                           </TableCell>
//                           <TableCell>
//                             <div className="flex space-x-2">
//                               <Button
//                                 size="sm"
//                                 variant="outline"
//                                 onClick={() =>
//                                   handleDownload(application.fileId)
//                                 }
//                                 className="text-gray-700 border-[#7E69AB]/50 hover:bg-[#7E69AB]/10 hover:border-[#7E69AB] transition-colors"
//                               >
//                                 <Download className="h-4 w-4 mr-1" />
//                                 Resume
//                               </Button>
//                               <Button
//                                 size="sm"
//                                 variant="outline"
//                                 className="text-red-500 border-red-500/50 hover:bg-red-500/10 hover:border-red-500 transition-colors"
//                                 onClick={() =>
//                                   confirmDelete(
//                                     application._id,
//                                     application.fullName
//                                   )
//                                 }
//                               >
//                                 <Trash className="h-4 w-4" />
//                               </Button>
//                             </div>
//                           </TableCell>
//                         </TableRow>
//                       ))
//                     )}
//                   </TableBody>
//                 </Table>
//               </div>
//             </div>

//             {/* Desktop view: Full table */}
//             <div className="hidden lg:block">
//               <div className="overflow-x-auto">
//                 <Table>
//                   <TableHeader>
//                     <TableRow className="border-b border-gray-200">
//                       <TableHead className="text-gray-600">Date</TableHead>
//                       <TableHead className="text-gray-600">Full Name</TableHead>
//                       <TableHead className="text-gray-600">Email</TableHead>
//                       <TableHead className="text-gray-600">Phone</TableHead>
//                       <TableHead className="text-gray-600">Skills</TableHead>
//                       <TableHead className="text-gray-600">Actions</TableHead>
//                     </TableRow>
//                   </TableHeader>
//                   <TableBody>
//                     {applications.length === 0 ? (
//                       <TableRow>
//                         <TableCell colSpan={6} className="text-center py-8">
//                           <div className="flex flex-col items-center text-gray-400">
//                             <ClipboardList className="h-8 w-8 mb-2 opacity-50" />
//                             <p>No applications found</p>
//                           </div>
//                         </TableCell>
//                       </TableRow>
//                     ) : (
//                       applications.map((application) => (
//                         <TableRow
//                           key={application._id}
//                           className="border-b border-gray-200 hover:bg-[#7E69AB]/5 transition-colors"
//                         >
//                           <TableCell className="text-gray-700">
//                             {new Date(
//                               application.createdAt
//                             ).toLocaleDateString()}
//                           </TableCell>
//                           <TableCell className="text-gray-900 font-medium">
//                             {application.fullName}
//                           </TableCell>
//                           <TableCell className="text-gray-700">
//                             {application.email}
//                           </TableCell>
//                           <TableCell className="text-gray-700">
//                             {application.phoneNumber}
//                           </TableCell>
//                           <TableCell className="text-gray-700 max-w-xs truncate">
//                             {application.skills}
//                           </TableCell>
//                           <TableCell>
//                             <div className="flex space-x-2">
//                               <Button
//                                 size="sm"
//                                 variant="outline"
//                                 onClick={() =>
//                                   handleDownload(application.fileId)
//                                 }
//                                 className="text-gray-700 border-[#7E69AB]/50 hover:bg-[#7E69AB]/10 hover:border-[#7E69AB] transition-colors"
//                               >
//                                 <Download className="h-4 w-4 mr-1" />
//                                 <span>Resume</span>
//                               </Button>
//                               <Button
//                                 size="sm"
//                                 variant="outline"
//                                 className="text-red-500 border-red-500/50 hover:bg-red-500/10 hover:border-red-500 transition-colors"
//                                 onClick={() =>
//                                   confirmDelete(
//                                     application._id,
//                                     application.fullName
//                                   )
//                                 }
//                               >
//                                 <Trash className="h-4 w-4" />
//                               </Button>
//                             </div>
//                           </TableCell>
//                         </TableRow>
//                       ))
//                     )}
//                   </TableBody>
//                 </Table>
//               </div>
//             </div>

//             {/* Pagination - same for all screen sizes */}
//             <div className="flex items-center justify-between border-t border-gray-200 bg-gray-50/40 px-4 sm:px-6 py-4">
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
//                 disabled={currentPage === 1 || loading}
//                 className="flex items-center gap-1 text-gray-700 border-gray-200 hover:bg-[#7E69AB]/10 hover:border-[#7E69AB]/50 disabled:opacity-50"
//               >
//                 <ChevronLeft className="h-4 w-4" />
//                 <span className="hidden sm:inline">Previous</span>
//               </Button>
//               <span className="text-sm text-gray-600">
//                 Page{' '}
//                 <span className="font-medium text-gray-900">{currentPage}</span>{' '}
//                 of{' '}
//                 <span className="font-medium text-gray-900">{totalPages}</span>
//               </span>
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={() =>
//                   setCurrentPage((prev) => Math.min(prev + 1, totalPages))
//                 }
//                 disabled={currentPage === totalPages || loading}
//                 className="flex items-center gap-1 text-gray-700 border-gray-200 hover:bg-[#7E69AB]/10 hover:border-[#7E69AB]/50 disabled:opacity-50"
//               >
//                 <span className="hidden sm:inline">Next</span>
//                 <ChevronRight className="h-4 w-4" />
//               </Button>
//             </div>
//           </Card>

//           {/* Confirm Popup */}
//           <ConfirmPopup
//             isOpen={confirmPopup.isOpen}
//             title="Delete Application"
//             message={`Are you sure you want to delete the application from ${confirmPopup.applicationName}? This action cannot be undone.`}
//             confirmText="Delete Application"
//             cancelText="Cancel"
//             onConfirm={handleDelete}
//             onCancel={cancelDelete}
//             variant="danger"
//           />

//           {/* Toast */}
//           {toast.visible && (
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
//                   onClick={() =>
//                     setToast((prev) => ({ ...prev, visible: false }))
//                   }
//                 />
//               </div>
//             </Toast>
//           )}
//           <ToastViewport />
//         </div>
//       </div>
//     </ToastProvider>
//   );
// }

'use client';

import { useState, useEffect, useCallback } from 'react';
import { IJobApplication } from '@/types';
import {
  Download,
  Trash,
  ClipboardList,
  ChevronLeft,
  ChevronRight,
  Calendar,
  User,
  Mail,
  Phone,
  Code,
  Edit,
  X,
  Save,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
} from '@/components/ui/toast';
import ConfirmPopup from '@/components/ui/ConfirmPopup';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';

interface ApplicationResponse {
  success: boolean;
  applications: IJobApplication[];
  pagination: {
    totalPages: number;
    currentPage: number;
  };
  message?: string;
}

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<IJobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [toast, setToast] = useState<{
    visible: boolean;
    message: string;
    type: 'default' | 'destructive';
  }>({
    visible: false,
    message: '',
    type: 'default',
  });

  // State for the edit dialog
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingApplication, setEditingApplication] =
    useState<IJobApplication | null>(null);

  // State for updated application data
  const [updatedApplication, setUpdatedApplication] = useState<{
    fullName: string;
    email: string;
    phoneNumber: string;
    skills: string;
  }>({
    fullName: '',
    email: '',
    phoneNumber: '',
    skills: '',
  });

  // State for confirm popup
  const [confirmPopup, setConfirmPopup] = useState({
    isOpen: false,
    applicationId: '',
    applicationName: '',
  });

  const showToast = useCallback(
    (message: string, type: 'default' | 'destructive') => {
      setToast({ visible: true, message, type });
      setTimeout(() => setToast((prev) => ({ ...prev, visible: false })), 3000);
    },
    []
  );

  const fetchApplications = useCallback(async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
      });

      const response = await fetch(`/api/admin/applications?${queryParams}`);
      const data: ApplicationResponse = await response.json();

      if (data.success) {
        setApplications(data.applications);
        setTotalPages(data.pagination?.totalPages || 1);
      } else {
        throw new Error(data.message || 'Failed to fetch applications');
      }
    } catch (error) {
      showToast('Failed to fetch applications', 'destructive');
    } finally {
      setLoading(false);
    }
  }, [currentPage, showToast]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const handleDownload = async (fileId: string) => {
    try {
      const response = await fetch('/api/admin/files', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fileId }),
      });

      if (!response.ok) throw new Error('Download failed');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `resume-${fileId}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      showToast('File downloaded successfully', 'default');
    } catch (error) {
      showToast('Failed to download file', 'destructive');
    }
  };

  // Open edit dialog
  const handleEdit = (application: IJobApplication) => {
    setEditingApplication(application);
    setUpdatedApplication({
      fullName: application.fullName,
      email: application.email,
      phoneNumber: application.phoneNumber,
      skills: application.skills,
    });
    setEditDialogOpen(true);
  };

  // Submit updated application data
  const handleUpdateApplication = async () => {
    if (!editingApplication) return;

    try {
      const response = await fetch(
        `/api/admin/applications/${editingApplication._id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedApplication),
        }
      );

      const data = await response.json();

      if (data.success) {
        showToast('Application updated successfully', 'default');
        setEditDialogOpen(false);
        fetchApplications();
      } else {
        throw new Error(data.message || 'Failed to update application');
      }
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : 'Failed to update application',
        'destructive'
      );
    }
  };

  // Show confirmation popup instead of directly deleting
  const confirmDelete = (id: string, name: string) => {
    setConfirmPopup({
      isOpen: true,
      applicationId: id,
      applicationName: name,
    });
  };

  // Handle actual deletion when confirmed
  const handleDelete = async () => {
    const id = confirmPopup.applicationId;

    try {
      const response = await fetch(`/api/admin/applications`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });

      const data = await response.json();
      if (data.success) {
        showToast('Application deleted successfully', 'default');
        fetchApplications();
      }
    } catch (error) {
      showToast('Failed to delete application', 'destructive');
    } finally {
      // Close the confirm popup
      setConfirmPopup({
        isOpen: false,
        applicationId: '',
        applicationName: '',
      });
    }
  };

  // Cancel deletion
  const cancelDelete = () => {
    setConfirmPopup({ isOpen: false, applicationId: '', applicationName: '' });
  };

  if (loading && applications.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#F6F9FC]">
        <div className="text-center p-8 text-gray-700">
          <div className="animate-spin h-8 w-8 border-4 border-[#7E69AB] border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading applications...</p>
        </div>
      </div>
    );
  }

  return (
    <ToastProvider>
      <div className="min-h-screen bg-[#F6F9FC] py-8 px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 bg-[#7E69AB]/10 rounded-full px-4 py-1.5 mb-3 border border-[#7E69AB]/20">
              <ClipboardList className="w-4 h-4 text-[#7E69AB]" />
              <span className="text-[#7E69AB] text-sm uppercase tracking-wider font-medium">
                Applications Recieved For Each Job Opening
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Job Applications
            </h1>
            <p className="text-gray-700 text-sm sm:text-base">
              Review and manage all job applications submitted through the
              careers page.
            </p>
          </div>

          {/* Responsive Table Card */}
          <Card className="bg-white backdrop-blur-sm border border-gray-100 hover:border-[#7E69AB]/20 transition-all duration-300 rounded-xl shadow-lg">
            {/* Small mobile screens: Card view */}
            <div className="block sm:hidden">
              {applications.length === 0 ? (
                <div className="p-6 text-center">
                  <div className="flex flex-col items-center text-gray-400">
                    <ClipboardList className="h-8 w-8 mb-2 opacity-50" />
                    <p>No applications found</p>
                  </div>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {applications.map((application) => (
                    <div key={application._id} className="p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-gray-900 font-medium">
                          {application.fullName}
                        </h3>
                        <span className="text-xs text-gray-500 flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(application.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="space-y-2 mb-3">
                        <div className="flex items-center text-gray-700">
                          <Mail className="h-4 w-4 mr-2 text-[#7E69AB]" />
                          <span className="text-sm">{application.email}</span>
                        </div>

                        <div className="flex items-center text-gray-700">
                          <Phone className="h-4 w-4 mr-2 text-[#7E69AB]" />
                          <span className="text-sm">
                            {application.phoneNumber}
                          </span>
                        </div>

                        <div className="flex items-start text-gray-700">
                          <Code className="h-4 w-4 mr-2 mt-0.5 text-[#7E69AB]" />
                          <div className="text-sm break-words w-full">
                            {application.skills}
                          </div>
                        </div>
                      </div>

                      <div className="flex space-x-2 pt-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(application)}
                          className="text-[#7E69AB] border-[#7E69AB]/50 hover:bg-[#7E69AB]/10 hover:border-[#7E69AB] transition-colors"
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDownload(application.fileId)}
                          className="text-[#7E69AB] border-[#7E69AB]/50 hover:bg-[#7E69AB]/10 hover:border-[#7E69AB] transition-colors"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-500 border-red-500/50 hover:bg-red-500/10 hover:border-red-500 transition-colors"
                          onClick={() =>
                            confirmDelete(application._id, application.fullName)
                          }
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Tablet view: Table with full skills */}
            <div className="hidden sm:block">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-gray-200">
                      <TableHead className="text-gray-600 w-24">Date</TableHead>
                      <TableHead className="text-gray-600 w-40">
                        Full Name
                      </TableHead>
                      <TableHead className="text-gray-600 w-56">
                        Email
                      </TableHead>
                      <TableHead className="text-gray-600 w-36">
                        Phone
                      </TableHead>
                      <TableHead className="text-gray-600">Skills</TableHead>
                      <TableHead className="text-gray-600 w-48">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {applications.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          <div className="flex flex-col items-center text-gray-400">
                            <ClipboardList className="h-8 w-8 mb-2 opacity-50" />
                            <p>No applications found</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      applications.map((application) => (
                        <TableRow
                          key={application._id}
                          className="border-b border-gray-200 hover:bg-[#7E69AB]/5 transition-colors"
                        >
                          <TableCell className="text-gray-700 whitespace-nowrap">
                            {new Date(
                              application.createdAt
                            ).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-gray-900 font-medium">
                            {application.fullName}
                          </TableCell>
                          <TableCell className="text-gray-700">
                            {application.email}
                          </TableCell>
                          <TableCell className="text-gray-700 whitespace-nowrap">
                            {application.phoneNumber}
                          </TableCell>
                          <TableCell className="text-gray-700 break-words max-w-md">
                            {application.skills}
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEdit(application)}
                                className="text-[#7E69AB] border-[#7E69AB]/50 hover:bg-[#7E69AB]/10 hover:border-[#7E69AB] transition-colors"
                              >
                                <Edit className="h-4 w-4 mr-1" />
                                {/* <span>Edit</span> */}
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  handleDownload(application.fileId)
                                }
                                className="text-gray-700 border-[#7E69AB]/50 hover:bg-[#7E69AB]/10 hover:border-[#7E69AB] transition-colors"
                              >
                                <Download className="h-4 w-4 mr-1" />
                                <span>Resume</span>
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-red-500 border-red-500/50 hover:bg-red-500/10 hover:border-red-500 transition-colors"
                                onClick={() =>
                                  confirmDelete(
                                    application._id,
                                    application.fullName
                                  )
                                }
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Pagination - same for all screen sizes */}
            <div className="flex items-center justify-between border-t border-gray-200 bg-gray-50/40 px-4 sm:px-6 py-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1 || loading}
                className="flex items-center gap-1 text-gray-700 border-gray-200 hover:bg-[#7E69AB]/10 hover:border-[#7E69AB]/50 disabled:opacity-50"
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Previous</span>
              </Button>
              <span className="text-sm text-gray-600">
                Page{' '}
                <span className="font-medium text-gray-900">{currentPage}</span>{' '}
                of{' '}
                <span className="font-medium text-gray-900">{totalPages}</span>
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages || loading}
                className="flex items-center gap-1 text-gray-700 border-gray-200 hover:bg-[#7E69AB]/10 hover:border-[#7E69AB]/50 disabled:opacity-50"
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </Card>

          {/* Edit Application Dialog */}
          <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold text-gray-900">
                  Edit Application
                </DialogTitle>
              </DialogHeader>

              <div className="mt-4 space-y-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={updatedApplication.fullName}
                    onChange={(e) =>
                      setUpdatedApplication({
                        ...updatedApplication,
                        fullName: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 bg-white text-gray-800 border border-gray-200 hover:border-[#7E69AB]/30 focus:border-[#7E69AB]/50 rounded-md transition-colors focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1.5">
                    Email
                  </label>
                  <input
                    type="email"
                    value={updatedApplication.email}
                    onChange={(e) =>
                      setUpdatedApplication({
                        ...updatedApplication,
                        email: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 bg-white text-gray-800 border border-gray-200 hover:border-[#7E69AB]/30 focus:border-[#7E69AB]/50 rounded-md transition-colors focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1.5">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={updatedApplication.phoneNumber}
                    onChange={(e) =>
                      setUpdatedApplication({
                        ...updatedApplication,
                        phoneNumber: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 bg-white text-gray-800 border border-gray-200 hover:border-[#7E69AB]/30 focus:border-[#7E69AB]/50 rounded-md transition-colors focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1.5">
                    Skills
                  </label>
                  <textarea
                    value={updatedApplication.skills}
                    onChange={(e) =>
                      setUpdatedApplication({
                        ...updatedApplication,
                        skills: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 bg-white text-gray-800 border border-gray-200 hover:border-[#7E69AB]/30 focus:border-[#7E69AB]/50 rounded-md transition-colors focus:outline-none min-h-[100px]"
                  />
                </div>
              </div>

              <DialogFooter className="flex justify-end gap-2 mt-6">
                <DialogClose asChild>
                  <Button
                    variant="outline"
                    className="text-gray-600 border-gray-300 hover:bg-gray-100"
                  >
                    Cancel
                  </Button>
                </DialogClose>
                <Button
                  onClick={handleUpdateApplication}
                  className="bg-gradient-to-r from-[#7E69AB] to-[#33C3F0] hover:from-[#7E69AB]/90 hover:to-[#33C3F0]/90 text-white transition-all duration-300"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Confirm Popup */}
          <ConfirmPopup
            isOpen={confirmPopup.isOpen}
            title="Delete Application"
            message={`Are you sure you want to delete the application from ${confirmPopup.applicationName}? This action cannot be undone.`}
            confirmText="Delete Application"
            cancelText="Cancel"
            onConfirm={handleDelete}
            onCancel={cancelDelete}
            variant="danger"
          />

          {/* Toast */}
          {toast.visible && (
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
                  onClick={() =>
                    setToast((prev) => ({ ...prev, visible: false }))
                  }
                />
              </div>
            </Toast>
          )}
          <ToastViewport />
        </div>
      </div>
    </ToastProvider>
  );
}
