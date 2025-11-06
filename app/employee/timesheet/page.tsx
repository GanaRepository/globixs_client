// 'use client';

// import React, { useState, useEffect, useCallback } from 'react';
// import {
//   format,
//   addDays,
//   parseISO,
//   isValid,
//   isSameDay,
//   startOfMonth,
//   endOfMonth,
//   startOfWeek,
//   endOfWeek,
// } from 'date-fns';
// import {
//   Calendar as CalendarIcon,
//   Clock,
//   FileText,
//   Plus,
//   AlertCircle,
//   Upload,
//   X,
//   Check,
//   Trash,
//   PlusCircle,
//   ChevronLeft,
//   ChevronRight,
// } from 'lucide-react';
// import { useRouter } from 'next/navigation';
// import useSessionStore from '@/stores/useSessionStore';

// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Textarea } from '@/components/ui/textarea';
// import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from '@/components/ui/table';
// import {
//   ToastProvider,
//   ToastViewport,
//   Toast,
//   ToastTitle,
//   ToastDescription,
//   ToastClose,
// } from '@/components/ui/toast';
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from '@/components/ui/popover';
// import { Calendar } from '@/components/ui/calendar';
// import { Badge } from '@/components/ui/badge';
// import { Checkbox } from '@/components/ui/checkbox';

// interface Timesheet {
//   _id: string;
//   date: string;
//   hoursWorked: number;
//   description: string;
//   project?: string;
//   fileId?: string;
//   status: 'pending' | 'approved' | 'rejected';
//   createdAt: string;
// }

// interface DayEntry {
//   date: string; // yyyy-MM-dd format
//   hoursWorked: number;
//   description: string;
//   formattedDate: string; // Formatted for display
//   isDuplicate?: boolean; // Flag for duplicate dates
// }

// interface TimesheetResponse {
//   success: boolean;
//   data: Timesheet[];
//   pagination: {
//     totalPages: number;
//     currentPage: number;
//     totalItems: number;
//   };
//   message?: string;
// }

// const TimesheetPage: React.FC = () => {
//   const router = useRouter();
//   const { session, fetchSession } = useSessionStore();
//   const [timesheets, setTimesheets] = useState<Timesheet[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [submitting, setSubmitting] = useState(false);

//   // Date selection state
//   const [selectedDates, setSelectedDates] = useState<Date[]>([]);
//   const [calendarOpen, setCalendarOpen] = useState(false);

//   // Entries for selected dates
//   const [dayEntries, setDayEntries] = useState<DayEntry[]>([]);

//   // Form fields
//   const [commonProject, setCommonProject] = useState('');
//   const [commonDescription, setCommonDescription] = useState('');
//   const [useCommonDetails, setUseCommonDetails] = useState(true);
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);

//   // Display filters for timesheet history
//   const [filter, setFilter] = useState('week');

//   // Pagination
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [itemsPerPage] = useState(10);

//   // Toast notification
//   const [toastVisible, setToastVisible] = useState(false);
//   const [toastMessage, setToastMessage] = useState('');
//   const [toastType, setToastType] = useState<'default' | 'destructive'>(
//     'default'
//   );

//   // Format a date for display
//   const formatDisplayDate = (date: Date): string => {
//     return format(date, 'EEE, MMM d, yyyy');
//   };

//   // Show toast notification
//   const showToast = useCallback(
//     (message: string, type: 'default' | 'destructive' = 'default') => {
//       setToastMessage(message);
//       setToastType(type);
//       setToastVisible(true);
//       setTimeout(() => setToastVisible(false), 5000);
//     },
//     []
//   );

//   // Update day entries when selected dates change
//   useEffect(() => {
//     if (selectedDates.length > 0) {
//       // Generate entries for selected dates
//       const newEntries = selectedDates.map((date) => ({
//         date: format(date, 'yyyy-MM-dd'),
//         hoursWorked: 0,
//         description: '',
//         formattedDate: formatDisplayDate(date),
//       }));

//       // Sort by date
//       newEntries.sort((a, b) => a.date.localeCompare(b.date));

//       setDayEntries(newEntries);
//     } else {
//       setDayEntries([]);
//     }
//   }, [selectedDates]);

//   // Fetch timesheets with proper dependencies
//   const fetchTimesheets = useCallback(async () => {
//     try {
//       setLoading(true);

//       // Determine date range based on filter
//       let startDate, endDate;
//       const now = new Date();

//       if (filter === 'week') {
//         startDate = startOfWeek(now, { weekStartsOn: 1 });
//         endDate = endOfWeek(now, { weekStartsOn: 1 });
//       } else if (filter === 'month') {
//         startDate = startOfMonth(now);
//         endDate = endOfMonth(now);
//       }

//       // Build query params
//       const params = new URLSearchParams();
//       if (startDate && endDate) {
//         params.append('startDate', startDate.toISOString());
//         params.append('endDate', endDate.toISOString());
//       }

//       // Add pagination
//       params.append('page', currentPage.toString());
//       params.append('limit', itemsPerPage.toString());

//       const response = await fetch(
//         `/api/employee/timesheet?${params.toString()}`
//       );
//       const data: TimesheetResponse = await response.json();

//       if (data.success) {
//         setTimesheets(data.data);
//         setTotalPages(data.pagination.totalPages);
//       } else {
//         showToast(data.message || 'Failed to fetch timesheets', 'destructive');
//       }
//     } catch (error) {
//       console.error('Error fetching timesheets:', error);
//       showToast('An error occurred while fetching timesheets', 'destructive');
//     } finally {
//       setLoading(false);
//     }
//   }, [filter, currentPage, itemsPerPage, showToast]);

//   // Initialize on page load
//   useEffect(() => {
//     const initPage = async () => {
//       await fetchSession();
//       fetchTimesheets();
//     };

//     initPage();
//   }, [fetchSession, fetchTimesheets]);

//   // Check for existing timesheets
//   const checkExistingTimesheets = async () => {
//     if (selectedDates.length === 0) return [];

//     try {
//       // Format dates for the query
//       const dateStrings = selectedDates.map((date) =>
//         format(date, 'yyyy-MM-dd')
//       );

//       // Query to check for existing entries
//       const params = new URLSearchParams();
//       params.append('dates', JSON.stringify(dateStrings));

//       const response = await fetch(
//         `/api/employee/timesheet/check-existing?${params.toString()}`
//       );
//       const data = await response.json();

//       if (data.success) {
//         return data.existingDates || [];
//       }
//       return [];
//     } catch (error) {
//       console.error('Error checking existing timesheets:', error);
//       return [];
//     }
//   };

//   // Handle date selection from calendar
//   const handleDateSelect = (date: Date | undefined) => {
//     if (!date) return;

//     // Check if date is already selected
//     const isSelected = selectedDates.some((d) => isSameDay(d, date));

//     if (isSelected) {
//       // Remove the date if already selected
//       setSelectedDates((prev) => prev.filter((d) => !isSameDay(d, date)));
//     } else {
//       // Add the date if not selected
//       setSelectedDates((prev) => [...prev, date]);
//     }
//   };

//   // Handle clearing all selected dates
//   const handleClearDates = () => {
//     setSelectedDates([]);
//   };

//   // Handle common project change
//   const handleCommonProjectChange = (
//     e: React.ChangeEvent<HTMLInputElement>
//   ) => {
//     setCommonProject(e.target.value);
//   };

//   // Handle common description change
//   const handleCommonDescriptionChange = (
//     e: React.ChangeEvent<HTMLTextAreaElement>
//   ) => {
//     setCommonDescription(e.target.value);
//   };

//   // Update day entry hours
//   const updateDayHours = (index: number, hours: number) => {
//     const updatedEntries = [...dayEntries];
//     updatedEntries[index].hoursWorked = hours;
//     setDayEntries(updatedEntries);
//   };

//   // Update day entry description
//   const updateDayDescription = (index: number, description: string) => {
//     const updatedEntries = [...dayEntries];
//     updatedEntries[index].description = description;
//     setDayEntries(updatedEntries);
//   };

//   // Handle file selection
//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       setSelectedFile(e.target.files[0]);
//     }
//   };

//   // Remove selected file
//   const removeSelectedFile = () => {
//     setSelectedFile(null);
//   };

//   // Remove a day entry
//   const removeDayEntry = (index: number) => {
//     // Remove from day entries
//     const updatedEntries = [...dayEntries];
//     const dateToRemove = parseISO(updatedEntries[index].date);
//     updatedEntries.splice(index, 1);
//     setDayEntries(updatedEntries);

//     // Remove from selected dates
//     setSelectedDates((prev) => prev.filter((d) => !isSameDay(d, dateToRemove)));
//   };

//   // Calculate total hours
//   const calculateTotalHours = () => {
//     return dayEntries.reduce((total, entry) => total + entry.hoursWorked, 0);
//   };

//   // Handle pagination
//   const handlePageChange = (newPage: number) => {
//     setCurrentPage(newPage);
//   };

//   // Submit timesheets
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (dayEntries.length === 0) {
//       showToast('Please select at least one date', 'destructive');
//       return;
//     }

//     const entriesToSubmit = dayEntries.filter((entry) => entry.hoursWorked > 0);

//     if (entriesToSubmit.length === 0) {
//       showToast('Please enter hours for at least one day', 'destructive');
//       return;
//     }

//     // Check for existing timesheets
//     const existingDates = await checkExistingTimesheets();

//     if (existingDates.length > 0) {
//       // Format dates for display
//       const formattedDates = existingDates
//         .map((date) => format(parseISO(date), 'MMM d, yyyy'))
//         .join(', ');

//       showToast(
//         `You already have timesheet entries for: ${formattedDates}. Please remove these dates and try again.`,
//         'destructive'
//       );

//       // Highlight the duplicate dates in the UI
//       setDayEntries((prevEntries) =>
//         prevEntries.map((entry) => {
//           if (existingDates.includes(entry.date)) {
//             return { ...entry, isDuplicate: true };
//           }
//           return entry;
//         })
//       );

//       return;
//     }

//     setSubmitting(true);

//     try {
//       // Create FormData for file upload
//       const formData = new FormData();

//       // Add timesheet entries
//       formData.append(
//         'entries',
//         JSON.stringify(
//           entriesToSubmit.map((entry) => ({
//             date: entry.date,
//             hoursWorked: entry.hoursWorked,
//             description: useCommonDetails
//               ? commonDescription
//               : entry.description,
//             project: commonProject,
//           }))
//         )
//       );

//       // Add file if selected
//       if (selectedFile) {
//         formData.append('attachment', selectedFile);
//       }

//       // Submit to API
//       const response = await fetch('/api/employee/timesheet/batch', {
//         method: 'POST',
//         body: formData,
//       });

//       const data = await response.json();

//       if (data.success) {
//         showToast('Timesheets submitted successfully', 'default');
//         // Reset form
//         setSelectedDates([]);
//         setDayEntries([]);
//         setCommonProject('');
//         setCommonDescription('');
//         setSelectedFile(null);
//         // Refresh timesheets
//         fetchTimesheets();
//       } else {
//         showToast(data.message || 'Failed to submit timesheets', 'destructive');
//       }
//     } catch (error) {
//       console.error('Error submitting timesheets:', error);
//       showToast('An error occurred while submitting timesheets', 'destructive');
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   // Format date for display in timesheet history
//   const formatDate = (dateString: string) => {
//     return format(parseISO(dateString), 'MMM dd, yyyy');
//   };

//   // Calculate total hours for history display
//   const totalHistoryHours = timesheets.reduce(
//     (sum, entry) => sum + entry.hoursWorked,
//     0
//   );

//   // Loading state
//   if (!session) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-[#F6F9FC]">
//         <div className="text-center">
//           <div className="animate-spin h-8 w-8 border-4 border-[#7E69AB] border-t-transparent rounded-full mx-auto mb-4"></div>
//           <p className="text-gray-700">Loading...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <ToastProvider>
//       <div className="min-h-screen bg-[#F6F9FC] py-8 sm:py-12 px-4">
//         <div className="container mx-auto max-w-6xl">
//           {/* Header Section */}
//           <div className="mb-8">
//             <div className="inline-block mb-4">
//               <div className="relative inline-flex items-center justify-center">
//                 <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-[#7E69AB] to-[#33C3F0] opacity-70 blur"></div>
//                 <div className="relative px-6 py-2 bg-white rounded-full text-sm font-normal text-gray-800">
//                   Employee Portal
//                 </div>
//               </div>
//             </div>
//             <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
//               Timesheet Management
//             </h1>
//             <p className="text-gray-700">
//               Track and submit your work hours and manage your timesheet
//               entries.
//             </p>
//           </div>

//           {/* Main Content */}
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//             {/* Timesheet Form Card */}
//             <div className="lg:col-span-1">
//               <Card className="h-full shadow-md">
//                 <CardHeader className="bg-gradient-to-r from-[#7E69AB]/10 to-[#33C3F0]/10">
//                   <CardTitle className="flex items-center text-xl">
//                     <Plus className="mr-2 h-5 w-5 text-[#7E69AB]" />
//                     Submit Timesheet
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent className="p-6">
//                   <form onSubmit={handleSubmit} className="space-y-4">
//                     {/* Date Selection */}
//                     <div className="space-y-2">
//                       <Label
//                         htmlFor="dateSelection"
//                         className="flex items-center"
//                       >
//                         <CalendarIcon className="mr-2 h-4 w-4 text-[#7E69AB]" />
//                         Select Date(s)
//                       </Label>
//                       <div className="relative">
//                         <Popover
//                           open={calendarOpen}
//                           onOpenChange={setCalendarOpen}
//                         >
//                           <PopoverTrigger asChild>
//                             <Button
//                               variant="outline"
//                               className="w-full justify-start text-left font-normal border border-gray-200 hover:border-[#7E69AB]/30 focus:border-[#7E69AB]/50"
//                             >
//                               <CalendarIcon className="mr-2 h-4 w-4" />
//                               {selectedDates.length > 0
//                                 ? `${selectedDates.length} date${selectedDates.length > 1 ? 's' : ''} selected`
//                                 : 'Select date(s)'}
//                             </Button>
//                           </PopoverTrigger>
//                           <PopoverContent className="w-auto p-0" align="start">
//                             <Calendar
//                               mode="multiple"
//                               selected={selectedDates}
//                               onSelect={(value) =>
//                                 handleDateSelect(value as Date)
//                               }
//                               initialFocus
//                             />
//                             <div className="p-3 border-t border-gray-200">
//                               <Button
//                                 type="button"
//                                 variant="outline"
//                                 size="sm"
//                                 className="w-full"
//                                 onClick={handleClearDates}
//                               >
//                                 Clear Selection
//                               </Button>
//                             </div>
//                           </PopoverContent>
//                         </Popover>
//                       </div>

//                       {selectedDates.length > 0 && (
//                         <div className="mt-2 space-y-1">
//                           <div className="flex justify-between items-center">
//                             <Label className="text-sm font-medium">
//                               Selected Dates:
//                             </Label>
//                             <span className="text-xs text-[#7E69AB]">
//                               {selectedDates.length} date(s)
//                             </span>
//                           </div>
//                           <div className="flex flex-wrap gap-2">
//                             {selectedDates
//                               .sort((a, b) => a.getTime() - b.getTime())
//                               .map((date, index) => (
//                                 <Badge
//                                   key={index}
//                                   className="bg-[#7E69AB]/10 text-[#7E69AB] hover:bg-[#7E69AB]/20 border border-[#7E69AB]/20"
//                                 >
//                                   {format(date, 'MMM d, yyyy')}
//                                 </Badge>
//                               ))}
//                           </div>
//                         </div>
//                       )}
//                     </div>

//                     {/* Project Field */}
//                     <div className="space-y-2">
//                       <Label htmlFor="project" className="flex items-center">
//                         <FileText className="mr-2 h-4 w-4 text-[#7E69AB]" />
//                         Project (Optional)
//                       </Label>
//                       <Input
//                         id="project"
//                         name="project"
//                         type="text"
//                         placeholder="Project name or ID"
//                         value={commonProject}
//                         onChange={handleCommonProjectChange}
//                         className="focus:ring-[#7E69AB] focus:border-[#7E69AB]"
//                       />
//                     </div>

//                     {/* Common Description Option */}
//                     <div className="flex items-center space-x-2">
//                       <Checkbox
//                         id="useCommonDetails"
//                         checked={useCommonDetails}
//                         onCheckedChange={(checked) =>
//                           setUseCommonDetails(checked as boolean)
//                         }
//                       />
//                       <Label htmlFor="useCommonDetails" className="text-sm">
//                         Use same description for all days
//                       </Label>
//                     </div>

//                     {/* Common Description */}
//                     {useCommonDetails && (
//                       <div className="space-y-2">
//                         <Label
//                           htmlFor="description"
//                           className="flex items-center"
//                         >
//                           <FileText className="mr-2 h-4 w-4 text-[#7E69AB]" />
//                           Work Description
//                         </Label>
//                         <Textarea
//                           id="description"
//                           name="description"
//                           placeholder="Describe the work performed"
//                           value={commonDescription}
//                           onChange={handleCommonDescriptionChange}
//                           rows={4}
//                           required={useCommonDetails}
//                           className="focus:ring-[#7E69AB] focus:border-[#7E69AB]"
//                         />
//                       </div>
//                     )}

//                     {/* Daily Hours */}
//                     {selectedDates.length > 0 && (
//                       <div className="space-y-3 border rounded-md p-3 bg-gray-50">
//                         <div className="flex justify-between items-center">
//                           <Label className="font-medium">Daily Hours</Label>
//                           <span className="text-sm text-gray-500">
//                             Total: {calculateTotalHours()} hrs
//                           </span>
//                         </div>

//                         <div className="space-y-3 max-h-72 overflow-y-auto pr-2">
//                           {dayEntries.map((entry, index) => (
//                             <div
//                               key={entry.date}
//                               className={`flex items-start space-x-3 pb-3 border-b border-gray-200 last:border-0 last:pb-0 ${
//                                 entry.isDuplicate
//                                   ? 'bg-red-50 rounded-md p-2 border border-red-200'
//                                   : ''
//                               }`}
//                             >
//                               <div className="w-20">
//                                 <Input
//                                   type="number"
//                                   min="0"
//                                   max="24"
//                                   step="0.5"
//                                   value={entry.hoursWorked}
//                                   onChange={(e) =>
//                                     updateDayHours(
//                                       index,
//                                       parseFloat(e.target.value) || 0
//                                     )
//                                   }
//                                   className={`focus:ring-[#7E69AB] focus:border-[#7E69AB] ${
//                                     entry.isDuplicate ? 'border-red-300' : ''
//                                   }`}
//                                   aria-label={`Hours for ${entry.formattedDate}`}
//                                 />
//                               </div>

//                               <div className="flex-1">
//                                 <div className="flex justify-between items-start">
//                                   <span
//                                     className={`text-sm font-medium ${entry.isDuplicate ? 'text-red-600' : ''}`}
//                                   >
//                                     {entry.formattedDate}
//                                     {entry.isDuplicate && (
//                                       <span className="ml-2 text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded">
//                                         Duplicate
//                                       </span>
//                                     )}
//                                   </span>
//                                   <Button
//                                     type="button"
//                                     variant="ghost"
//                                     size="sm"
//                                     className="h-6 w-6 p-0 text-gray-400 hover:text-red-500"
//                                     onClick={() => removeDayEntry(index)}
//                                   >
//                                     <X className="h-4 w-4" />
//                                   </Button>
//                                 </div>

//                                 {entry.isDuplicate && (
//                                   <p className="text-xs text-red-600 mt-1">
//                                     You already have a timesheet for this date
//                                   </p>
//                                 )}

//                                 {!useCommonDetails && (
//                                   <Textarea
//                                     placeholder="Description for this day"
//                                     value={entry.description}
//                                     onChange={(e) =>
//                                       updateDayDescription(
//                                         index,
//                                         e.target.value
//                                       )
//                                     }
//                                     rows={2}
//                                     className={`mt-2 text-sm focus:ring-[#7E69AB] focus:border-[#7E69AB] ${
//                                       entry.isDuplicate ? 'border-red-300' : ''
//                                     }`}
//                                   />
//                                 )}
//                               </div>
//                             </div>
//                           ))}
//                         </div>
//                       </div>
//                     )}

//                     {/* File Upload */}
//                     <div className="space-y-2">
//                       <Label htmlFor="attachment" className="flex items-center">
//                         <Upload className="mr-2 h-4 w-4 text-[#7E69AB]" />
//                         Attachment (Optional)
//                       </Label>

//                       {!selectedFile ? (
//                         <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center hover:bg-gray-50 transition-colors">
//                           <Input
//                             id="attachment"
//                             name="attachment"
//                             type="file"
//                             onChange={handleFileChange}
//                             className="hidden"
//                           />
//                           <label
//                             htmlFor="attachment"
//                             className="cursor-pointer flex flex-col items-center"
//                           >
//                             <Upload className="h-6 w-6 text-gray-400 mb-2" />
//                             <span className="text-sm text-gray-500">
//                               Click to upload a file
//                             </span>
//                             <span className="text-xs text-gray-400 mt-1">
//                               (PDF, DOC, XLS, etc.)
//                             </span>
//                           </label>
//                         </div>
//                       ) : (
//                         <div className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
//                           <div className="flex items-center space-x-2 overflow-hidden">
//                             <FileText className="h-5 w-5 text-[#7E69AB] flex-shrink-0" />
//                             <span className="text-sm truncate">
//                               {selectedFile.name}
//                             </span>
//                           </div>
//                           <Button
//                             type="button"
//                             variant="ghost"
//                             size="sm"
//                             onClick={removeSelectedFile}
//                             className="text-gray-400 hover:text-red-500"
//                           >
//                             <X className="h-4 w-4" />
//                           </Button>
//                         </div>
//                       )}
//                     </div>

//                     {/* Submit Button */}
//                     <Button
//                       type="submit"
//                       className="w-full bg-gradient-to-r from-[#7E69AB] to-[#33C3F0] text-white"
//                       disabled={submitting || dayEntries.length === 0}
//                     >
//                       {submitting ? (
//                         <span className="flex items-center justify-center">
//                           <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
//                           Submitting...
//                         </span>
//                       ) : (
//                         'Submit Timesheet'
//                       )}
//                     </Button>
//                   </form>
//                 </CardContent>
//               </Card>
//             </div>

//             {/* Timesheet History Card */}
//             <div className="lg:col-span-2">
//               <Card className="h-full shadow-md">
//                 <CardHeader className="bg-gradient-to-r from-[#7E69AB]/10 to-[#33C3F0]/10">
//                   <div className="flex justify-between items-center">
//                     <CardTitle className="flex items-center text-xl">
//                       <FileText className="mr-2 h-5 w-5 text-[#7E69AB]" />
//                       Timesheet History
//                     </CardTitle>
//                     <div>
//                       <Tabs defaultValue={filter}>
//                         <TabsList>
//                           <TabsTrigger
//                             value="week"
//                             onClick={() => setFilter('week')}
//                             className={
//                               filter === 'week' ? 'bg-[#7E69AB] text-white' : ''
//                             }
//                           >
//                             This Week
//                           </TabsTrigger>
//                           <TabsTrigger
//                             value="month"
//                             onClick={() => setFilter('month')}
//                             className={
//                               filter === 'month'
//                                 ? 'bg-[#7E69AB] text-white'
//                                 : ''
//                             }
//                           >
//                             This Month
//                           </TabsTrigger>
//                           <TabsTrigger
//                             value="all"
//                             onClick={() => setFilter('all')}
//                             className={
//                               filter === 'all' ? 'bg-[#7E69AB] text-white' : ''
//                             }
//                           >
//                             All Time
//                           </TabsTrigger>
//                         </TabsList>
//                       </Tabs>
//                     </div>
//                   </div>
//                 </CardHeader>
//                 <CardContent className="p-6">
//                   {loading ? (
//                     <div className="flex items-center justify-center py-8">
//                       <div className="animate-spin h-8 w-8 border-4 border-[#7E69AB] border-t-transparent rounded-full"></div>
//                     </div>
//                   ) : timesheets.length === 0 ? (
//                     <div className="text-center py-8 text-gray-500">
//                       <FileText className="h-12 w-12 mx-auto mb-3 text-gray-300" />
//                       <p>No timesheet entries found for the selected period.</p>
//                       <p className="text-sm">
//                         Submit your first entry to get started.
//                       </p>
//                     </div>
//                   ) : (
//                     <>
//                       <div className="overflow-x-auto">
//                         <Table>
//                           <TableHeader>
//                             <TableRow>
//                               <TableHead>Date</TableHead>
//                               <TableHead>Project</TableHead>
//                               <TableHead>Hours</TableHead>
//                               <TableHead>Description</TableHead>
//                               <TableHead>Status</TableHead>
//                               <TableHead>Attachment</TableHead>
//                             </TableRow>
//                           </TableHeader>
//                           <TableBody>
//                             {timesheets.map((entry) => (
//                               <TableRow key={entry._id}>
//                                 <TableCell>{formatDate(entry.date)}</TableCell>
//                                 <TableCell>{entry.project || 'N/A'}</TableCell>
//                                 <TableCell>{entry.hoursWorked}</TableCell>
//                                 <TableCell className="max-w-xs">
//                                   <div className="line-clamp-2 hover:line-clamp-none break-words">
//                                     {entry.description}
//                                   </div>
//                                 </TableCell>
//                                 <TableCell>
//                                   <span
//                                     className={`px-2 py-1 rounded-full text-xs font-medium ${
//                                       entry.status === 'approved'
//                                         ? 'bg-green-100 text-green-800'
//                                         : entry.status === 'rejected'
//                                           ? 'bg-red-100 text-red-800'
//                                           : 'bg-yellow-100 text-yellow-800'
//                                     }`}
//                                   >
//                                     {entry.status.charAt(0).toUpperCase() +
//                                       entry.status.slice(1)}
//                                   </span>
//                                 </TableCell>
//                                 <TableCell>
//                                   {entry.fileId ? (
//                                     <a
//                                       href={`/api/employee/timesheet/download?fileId=${entry.fileId}`}
//                                       className="text-[#7E69AB] hover:underline flex items-center"
//                                       target="_blank"
//                                       rel="noopener noreferrer"
//                                     >
//                                       <FileText className="h-4 w-4 mr-1" />
//                                       <span>View</span>
//                                     </a>
//                                   ) : (
//                                     <span className="text-gray-400 text-sm">
//                                       None
//                                     </span>
//                                   )}
//                                 </TableCell>
//                               </TableRow>
//                             ))}
//                           </TableBody>
//                         </Table>
//                       </div>

//                       {/* Pagination */}
//                       <div className="mt-4 flex justify-between items-center border-t pt-4">
//                         <div className="text-sm text-gray-500">
//                           Showing {timesheets.length} entries
//                         </div>
//                         <div className="flex items-center space-x-4">
//                           <div className="font-medium mr-4">
//                             Total Hours:{' '}
//                             <span className="text-[#7E69AB]">
//                               {totalHistoryHours}
//                             </span>
//                           </div>

//                           {/* Pagination Controls */}
//                           <div className="flex items-center space-x-2">
//                             <Button
//                               variant="outline"
//                               size="sm"
//                               onClick={() =>
//                                 handlePageChange(Math.max(1, currentPage - 1))
//                               }
//                               disabled={currentPage === 1 || loading}
//                               className="text-gray-500 border-gray-200 hover:bg-[#7E69AB]/10"
//                             >
//                               <ChevronLeft className="h-4 w-4" />
//                             </Button>

//                             <span className="text-sm text-gray-700">
//                               Page {currentPage} of {totalPages}
//                             </span>

//                             <Button
//                               variant="outline"
//                               size="sm"
//                               onClick={() =>
//                                 handlePageChange(
//                                   Math.min(totalPages, currentPage + 1)
//                                 )
//                               }
//                               disabled={currentPage === totalPages || loading}
//                               className="text-gray-500 border-gray-200 hover:bg-[#7E69AB]/10"
//                             >
//                               <ChevronRight className="h-4 w-4" />
//                             </Button>
//                           </div>
//                         </div>
//                       </div>
//                     </>
//                   )}
//                 </CardContent>
//               </Card>
//             </div>
//           </div>

//           {/* Tips Section */}
//           <div className="mt-10">
//             <Card className="bg-gradient-to-r from-[#7E69AB]/5 to-[#33C3F0]/5 shadow-sm">
//               <CardContent className="p-6">
//                 <div className="flex items-start">
//                   <AlertCircle className="h-6 w-6 mr-4 text-[#7E69AB] flex-shrink-0" />
//                   <div>
//                     <h3 className="font-medium text-gray-900 mb-1">
//                       Timesheet Tips
//                     </h3>
//                     <ul className="text-sm text-gray-600 space-y-1">
//                       <li>
//                         • You can select any number of dates for your timesheet
//                       </li>
//                       <li>
//                         • Include specific project details to help with billing
//                       </li>
//                       <li>• Submit timesheets by Friday 5 PM each week</li>
//                       <li>• Attach supporting documents when necessary</li>
//                       <li>
//                         • Contact HR for any questions about your timesheet
//                         submissions
//                       </li>
//                     </ul>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//         </div>

//         {/* Toast Notification */}
//         {toastVisible && (
//           <Toast
//             variant={toastType}
//             className={`fixed top-4 right-4 z-50 w-auto max-w-md ${
//               toastType === 'default'
//                 ? 'bg-[#7E69AB]/10 border-[#7E69AB]'
//                 : 'bg-red-950 border-red-500'
//             }`}
//           >
//             <div className="flex">
//               <div className="flex-1">
//                 <ToastTitle
//                   className={
//                     toastType === 'default' ? 'text-[#7E69AB]' : 'text-red-300'
//                   }
//                 >
//                   {toastType === 'default' ? 'Success' : 'Error'}
//                 </ToastTitle>
//                 <ToastDescription className="text-gray-700 dark:text-white">
//                   {toastMessage}
//                 </ToastDescription>
//               </div>
//               <ToastClose
//                 onClick={() => setToastVisible(false)}
//                 className="opacity-100 text-gray-700 dark:text-white hover:text-gray-500"
//               />
//             </div>
//           </Toast>
//         )}
//         <ToastViewport />
//       </div>
//     </ToastProvider>
//   );
// };

// export default TimesheetPage;

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  format,
  parseISO,
  isSameDay,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
} from 'date-fns';
import {
  Calendar as CalendarIcon,
  FileText,
  Plus,
  AlertCircle,
  Upload,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import useSessionStore from '@/stores/useSessionStore';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
} from '@/components/ui/toast';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';

interface Timesheet {
  _id: string;
  date: string;
  hoursWorked: number;
  description: string;
  project?: string;
  fileId?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

interface DayEntry {
  date: string; // yyyy-MM-dd format
  hoursWorked: number;
  description: string;
  formattedDate: string; // Formatted for display
  isDuplicate?: boolean; // Flag for duplicate dates
}

interface TimesheetResponse {
  success: boolean;
  data: Timesheet[];
  pagination: {
    totalPages: number;
    currentPage: number;
    totalItems: number;
  };
  message?: string;
}

const TimesheetPage: React.FC = () => {
  const router = useRouter();
  const { session, fetchSession } = useSessionStore();
  const [timesheets, setTimesheets] = useState<Timesheet[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Date selection state
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [calendarOpen, setCalendarOpen] = useState(false);

  // Entries for selected dates
  const [dayEntries, setDayEntries] = useState<DayEntry[]>([]);

  // Form fields
  const [commonProject, setCommonProject] = useState('');
  const [commonDescription, setCommonDescription] = useState('');
  const [useCommonDetails, setUseCommonDetails] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Display filters for timesheet history
  const [filter, setFilter] = useState('week');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(10);

  // Toast notification
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'default' | 'destructive'>(
    'default'
  );

  // Format a date for display
  const formatDisplayDate = (date: Date): string => {
    return format(date, 'EEE, MMM d, yyyy');
  };

  // Show toast notification
  const showToast = useCallback(
    (message: string, type: 'default' | 'destructive' = 'default') => {
      setToastMessage(message);
      setToastType(type);
      setToastVisible(true);
      setTimeout(() => setToastVisible(false), 5000);
    },
    []
  );

  // Update day entries when selected dates change
  useEffect(() => {
    if (selectedDates.length > 0) {
      // Generate entries for selected dates
      const newEntries = selectedDates.map((date) => ({
        date: format(date, 'yyyy-MM-dd'),
        hoursWorked: 0,
        description: '',
        formattedDate: formatDisplayDate(date),
      }));

      // Sort by date
      newEntries.sort((a, b) => a.date.localeCompare(b.date));

      setDayEntries(newEntries);
    } else {
      setDayEntries([]);
    }
  }, [selectedDates]);

  // Fetch timesheets with proper dependencies
  const fetchTimesheets = useCallback(async () => {
    try {
      setLoading(true);

      // Determine date range based on filter
      let startDate, endDate;
      const now = new Date();

      if (filter === 'week') {
        startDate = startOfWeek(now, { weekStartsOn: 1 });
        endDate = endOfWeek(now, { weekStartsOn: 1 });
      } else if (filter === 'month') {
        startDate = startOfMonth(now);
        endDate = endOfMonth(now);
      }

      // Build query params
      const params = new URLSearchParams();
      if (startDate && endDate) {
        params.append('startDate', startDate.toISOString());
        params.append('endDate', endDate.toISOString());
      }

      // Add pagination
      params.append('page', currentPage.toString());
      params.append('limit', itemsPerPage.toString());

      const response = await fetch(
        `/api/employee/timesheet?${params.toString()}`
      );
      const data: TimesheetResponse = await response.json();

      if (data.success) {
        setTimesheets(data.data);
        setTotalPages(data.pagination.totalPages);
      } else {
        showToast(data.message || 'Failed to fetch timesheets', 'destructive');
      }
    } catch (error) {
      console.error('Error fetching timesheets:', error);
      showToast('An error occurred while fetching timesheets', 'destructive');
    } finally {
      setLoading(false);
    }
  }, [filter, currentPage, itemsPerPage, showToast]);

  // Initialize on page load
  useEffect(() => {
    const initPage = async () => {
      await fetchSession();
      fetchTimesheets();
    };

    initPage();
  }, [fetchSession, fetchTimesheets]);

  // Check for existing timesheets
  const checkExistingTimesheets = async () => {
    if (selectedDates.length === 0) return [];

    try {
      // Format dates for the query
      const dateStrings = selectedDates.map((date) =>
        format(date, 'yyyy-MM-dd')
      );

      // Query to check for existing entries
      const params = new URLSearchParams();
      params.append('dates', JSON.stringify(dateStrings));

      const response = await fetch(
        `/api/employee/timesheet/check-existing?${params.toString()}`
      );
      const data = await response.json();

      if (data.success) {
        return data.existingDates || [];
      }
      return [];
    } catch (error) {
      console.error('Error checking existing timesheets:', error);
      return [];
    }
  };

  // Handle date selection from calendar
  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;

    // Check if date is already selected
    const isSelected = selectedDates.some((d) => isSameDay(d, date));

    if (isSelected) {
      // Remove the date if already selected
      setSelectedDates((prev) => prev.filter((d) => !isSameDay(d, date)));
    } else {
      // Add the date if not selected
      setSelectedDates((prev) => [...prev, date]);
    }
  };

  // Handle clearing all selected dates
  const handleClearDates = () => {
    setSelectedDates([]);
  };

  // Handle common project change
  const handleCommonProjectChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCommonProject(e.target.value);
  };

  // Handle common description change
  const handleCommonDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setCommonDescription(e.target.value);
  };

  // Update day entry hours
  const updateDayHours = (index: number, hours: number) => {
    const updatedEntries = [...dayEntries];
    updatedEntries[index].hoursWorked = hours;
    setDayEntries(updatedEntries);
  };

  // Update day entry description
  const updateDayDescription = (index: number, description: string) => {
    const updatedEntries = [...dayEntries];
    updatedEntries[index].description = description;
    setDayEntries(updatedEntries);
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  // Remove selected file
  const removeSelectedFile = () => {
    setSelectedFile(null);
  };

  // Remove a day entry
  const removeDayEntry = (index: number) => {
    // Remove from day entries
    const updatedEntries = [...dayEntries];
    const dateToRemove = parseISO(updatedEntries[index].date);
    updatedEntries.splice(index, 1);
    setDayEntries(updatedEntries);

    // Remove from selected dates
    setSelectedDates((prev) => prev.filter((d) => !isSameDay(d, dateToRemove)));
  };

  // Calculate total hours
  const calculateTotalHours = () => {
    return dayEntries.reduce((total, entry) => total + entry.hoursWorked, 0);
  };

  // Handle pagination
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  // Submit timesheets
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (dayEntries.length === 0) {
      showToast('Please select at least one date', 'destructive');
      return;
    }

    const entriesToSubmit = dayEntries.filter((entry) => entry.hoursWorked > 0);

    if (entriesToSubmit.length === 0) {
      showToast('Please enter hours for at least one day', 'destructive');
      return;
    }

    // Check for existing timesheets
    const existingDates = await checkExistingTimesheets();

    if (existingDates.length > 0) {
      // Format dates for display
      const formattedDates = existingDates
        .map((date: string) => format(parseISO(date), 'MMM d, yyyy'))
        .join(', ');

      showToast(
        `You already have timesheet entries for: ${formattedDates}. Please remove these dates and try again.`,
        'destructive'
      );

      // Highlight the duplicate dates in the UI
      setDayEntries((prevEntries) =>
        prevEntries.map((entry) => {
          if (existingDates.includes(entry.date)) {
            return { ...entry, isDuplicate: true };
          }
          return entry;
        })
      );

      return;
    }

    setSubmitting(true);

    try {
      // Create FormData for file upload
      const formData = new FormData();

      // Add timesheet entries
      formData.append(
        'entries',
        JSON.stringify(
          entriesToSubmit.map((entry) => ({
            date: entry.date,
            hoursWorked: entry.hoursWorked,
            description: useCommonDetails
              ? commonDescription
              : entry.description,
            project: commonProject,
          }))
        )
      );

      // Add file if selected
      if (selectedFile) {
        formData.append('attachment', selectedFile);
      }

      // Submit to API
      const response = await fetch('/api/employee/timesheet/batch', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        showToast('Timesheets submitted successfully', 'default');
        // Reset form
        setSelectedDates([]);
        setDayEntries([]);
        setCommonProject('');
        setCommonDescription('');
        setSelectedFile(null);
        // Refresh timesheets
        fetchTimesheets();
      } else {
        showToast(data.message || 'Failed to submit timesheets', 'destructive');
      }
    } catch (error) {
      console.error('Error submitting timesheets:', error);
      showToast('An error occurred while submitting timesheets', 'destructive');
    } finally {
      setSubmitting(false);
    }
  };

  // Format date for display in timesheet history
  const formatDate = (dateString: string) => {
    return format(parseISO(dateString), 'MMM dd, yyyy');
  };

  // Calculate total hours for history display
  const totalHistoryHours = timesheets.reduce(
    (sum, entry) => sum + entry.hoursWorked,
    0
  );

  // Loading state
  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F6F9FC]">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-[#7E69AB] border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-700">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <ToastProvider>
      <div className="min-h-screen bg-[#F6F9FC] py-8 sm:py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Header Section */}
          <div className="mb-8">
            <div className="inline-block mb-4">
              {/* <div className="relative inline-flex items-center justify-center">
                <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-[#7E69AB] to-[#33C3F0] opacity-70 blur"></div>
                <div className="relative px-6 py-2 bg-white rounded-full text-sm font-normal text-gray-800">
                  Employee Portal
                </div>
              </div> */}
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Timesheet Management
            </h1>
            <p className="text-gray-700">
              Track and submit your work hours and manage your timesheet
              entries.
            </p>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Timesheet Form Card */}
            <div className="lg:col-span-1">
              <Card className="h-full shadow-md">
                <CardHeader className="bg-gradient-to-r from-[#7E69AB]/10 to-[#33C3F0]/10">
                  <CardTitle className="flex items-center text-xl">
                    <Plus className="mr-2 h-5 w-5 text-[#7E69AB]" />
                    Submit Timesheet
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Date Selection */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="dateSelection"
                        className="flex items-center"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4 text-[#7E69AB]" />
                        Select Date(s)
                      </Label>
                      <div className="relative">
                        <Popover
                          open={calendarOpen}
                          onOpenChange={setCalendarOpen}
                        >
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-start text-left font-normal border border-gray-200 hover:border-[#7E69AB]/30 focus:border-[#7E69AB]/50"
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {selectedDates.length > 0
                                ? `${selectedDates.length} date${selectedDates.length > 1 ? 's' : ''} selected`
                                : 'Select date(s)'}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="multiple"
                              selected={selectedDates}
                              onSelect={(value) => {
                                // When mode="multiple", value is an array of dates
                                setSelectedDates(value || []);
                              }}
                              initialFocus
                            />
                            <div className="p-3 border-t border-gray-200">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="w-full"
                                onClick={handleClearDates}
                              >
                                Clear Selection
                              </Button>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>

                      {selectedDates.length > 0 && (
                        <div className="mt-2 space-y-1">
                          <div className="flex justify-between items-center">
                            <Label className="text-sm font-medium">
                              Selected Dates:
                            </Label>
                            <span className="text-xs text-[#7E69AB]">
                              {selectedDates.length} date(s)
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {selectedDates
                              .sort((a, b) => a.getTime() - b.getTime())
                              .map((date, index) => (
                                <Badge
                                  key={index}
                                  className="bg-[#7E69AB]/10 text-[#7E69AB] hover:bg-[#7E69AB]/20 border border-[#7E69AB]/20"
                                >
                                  {format(date, 'MMM d, yyyy')}
                                </Badge>
                              ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Project Field */}
                    <div className="space-y-2">
                      <Label htmlFor="project" className="flex items-center">
                        <FileText className="mr-2 h-4 w-4 text-[#7E69AB]" />
                        Project (Optional)
                      </Label>
                      <Input
                        id="project"
                        name="project"
                        type="text"
                        placeholder="Project name or ID"
                        value={commonProject}
                        onChange={handleCommonProjectChange}
                        className="focus:ring-[#7E69AB] focus:border-[#7E69AB]"
                      />
                    </div>

                    {/* Common Description Option */}
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="useCommonDetails"
                        checked={useCommonDetails}
                        onCheckedChange={(checked) =>
                          setUseCommonDetails(checked as boolean)
                        }
                      />
                      <Label htmlFor="useCommonDetails" className="text-sm">
                        Use same description for all days
                      </Label>
                    </div>

                    {/* Common Description */}
                    {useCommonDetails && (
                      <div className="space-y-2">
                        <Label
                          htmlFor="description"
                          className="flex items-center"
                        >
                          <FileText className="mr-2 h-4 w-4 text-[#7E69AB]" />
                          Work Description
                        </Label>
                        <Textarea
                          id="description"
                          name="description"
                          placeholder="Describe the work performed"
                          value={commonDescription}
                          onChange={handleCommonDescriptionChange}
                          rows={4}
                          required={useCommonDetails}
                          className="focus:ring-[#7E69AB] focus:border-[#7E69AB]"
                        />
                      </div>
                    )}

                    {/* Daily Hours */}
                    {selectedDates.length > 0 && (
                      <div className="space-y-3 border rounded-md p-3 bg-gray-50">
                        <div className="flex justify-between items-center">
                          <Label className="font-medium">Daily Hours</Label>
                          <span className="text-sm text-gray-500">
                            Total: {calculateTotalHours()} hrs
                          </span>
                        </div>

                        <div className="space-y-3 max-h-72 overflow-y-auto pr-2">
                          {dayEntries.map((entry, index) => (
                            <div
                              key={entry.date}
                              className={`flex items-start space-x-3 pb-3 border-b border-gray-200 last:border-0 last:pb-0 ${
                                entry.isDuplicate
                                  ? 'bg-red-50 rounded-md p-2 border border-red-200'
                                  : ''
                              }`}
                            >
                              <div className="w-20">
                                <Input
                                  type="number"
                                  min="0"
                                  max="24"
                                  step="0.5"
                                  value={entry.hoursWorked}
                                  onChange={(e) =>
                                    updateDayHours(
                                      index,
                                      parseFloat(e.target.value) || 0
                                    )
                                  }
                                  className={`focus:ring-[#7E69AB] focus:border-[#7E69AB] ${
                                    entry.isDuplicate ? 'border-red-300' : ''
                                  }`}
                                  aria-label={`Hours for ${entry.formattedDate}`}
                                />
                              </div>

                              <div className="flex-1">
                                <div className="flex justify-between items-start">
                                  <span
                                    className={`text-sm font-medium ${entry.isDuplicate ? 'text-red-600' : ''}`}
                                  >
                                    {entry.formattedDate}
                                    {entry.isDuplicate && (
                                      <span className="ml-2 text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded">
                                        Duplicate
                                      </span>
                                    )}
                                  </span>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0 text-gray-400 hover:text-red-500"
                                    onClick={() => removeDayEntry(index)}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>

                                {entry.isDuplicate && (
                                  <p className="text-xs text-red-600 mt-1">
                                    You already have a timesheet for this date
                                  </p>
                                )}

                                {!useCommonDetails && (
                                  <Textarea
                                    placeholder="Description for this day"
                                    value={entry.description}
                                    onChange={(e) =>
                                      updateDayDescription(
                                        index,
                                        e.target.value
                                      )
                                    }
                                    rows={2}
                                    className={`mt-2 text-sm focus:ring-[#7E69AB] focus:border-[#7E69AB] ${
                                      entry.isDuplicate ? 'border-red-300' : ''
                                    }`}
                                  />
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* File Upload */}
                    <div className="space-y-2">
                      <Label htmlFor="attachment" className="flex items-center">
                        <Upload className="mr-2 h-4 w-4 text-[#7E69AB]" />
                        Attachment (Optional)
                      </Label>

                      {!selectedFile ? (
                        <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center hover:bg-gray-50 transition-colors">
                          <Input
                            id="attachment"
                            name="attachment"
                            type="file"
                            onChange={handleFileChange}
                            className="hidden"
                          />
                          <label
                            htmlFor="attachment"
                            className="cursor-pointer flex flex-col items-center"
                          >
                            <Upload className="h-6 w-6 text-gray-400 mb-2" />
                            <span className="text-sm text-gray-500">
                              Click to upload a file
                            </span>
                            <span className="text-xs text-gray-400 mt-1">
                              (PDF, DOC, XLS, etc.)
                            </span>
                          </label>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                          <div className="flex items-center space-x-2 overflow-hidden">
                            <FileText className="h-5 w-5 text-[#7E69AB] flex-shrink-0" />
                            <span className="text-sm truncate">
                              {selectedFile.name}
                            </span>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={removeSelectedFile}
                            className="text-gray-400 hover:text-red-500"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-[#7E69AB] to-[#33C3F0] text-white"
                      disabled={submitting || dayEntries.length === 0}
                    >
                      {submitting ? (
                        <span className="flex items-center justify-center">
                          <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                          Submitting...
                        </span>
                      ) : (
                        'Submit Timesheet'
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Timesheet History Card */}
            <div className="lg:col-span-2">
              <Card className="h-full shadow-md">
                <CardHeader className="bg-gradient-to-r from-[#7E69AB]/10 to-[#33C3F0]/10">
                  <div className="flex justify-between items-center">
                    <CardTitle className="flex items-center text-xl">
                      <FileText className="mr-2 h-5 w-5 text-[#7E69AB]" />
                      Timesheet History
                    </CardTitle>
                    <div>
                      <Tabs defaultValue={filter}>
                        <TabsList>
                          <TabsTrigger
                            value="week"
                            onClick={() => setFilter('week')}
                            className={
                              filter === 'week' ? 'bg-[#7E69AB] text-white' : ''
                            }
                          >
                            This Week
                          </TabsTrigger>
                          <TabsTrigger
                            value="month"
                            onClick={() => setFilter('month')}
                            className={
                              filter === 'month'
                                ? 'bg-[#7E69AB] text-white'
                                : ''
                            }
                          >
                            This Month
                          </TabsTrigger>
                          <TabsTrigger
                            value="all"
                            onClick={() => setFilter('all')}
                            className={
                              filter === 'all' ? 'bg-[#7E69AB] text-white' : ''
                            }
                          >
                            All Time
                          </TabsTrigger>
                        </TabsList>
                      </Tabs>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  {loading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin h-8 w-8 border-4 border-[#7E69AB] border-t-transparent rounded-full"></div>
                    </div>
                  ) : timesheets.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <FileText className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                      <p>No timesheet entries found for the selected period.</p>
                      <p className="text-sm">
                        Submit your first entry to get started.
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Date</TableHead>
                              <TableHead>Project</TableHead>
                              <TableHead>Hours</TableHead>
                              <TableHead>Description</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Attachment</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {timesheets.map((entry) => (
                              <TableRow key={entry._id}>
                                <TableCell>{formatDate(entry.date)}</TableCell>
                                <TableCell>{entry.project || 'N/A'}</TableCell>
                                <TableCell>{entry.hoursWorked}</TableCell>
                                <TableCell className="max-w-xs">
                                  <div className="line-clamp-2 hover:line-clamp-none break-words">
                                    {entry.description}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <span
                                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                                      entry.status === 'approved'
                                        ? 'bg-green-100 text-green-800'
                                        : entry.status === 'rejected'
                                          ? 'bg-red-100 text-red-800'
                                          : 'bg-yellow-100 text-yellow-800'
                                    }`}
                                  >
                                    {entry.status.charAt(0).toUpperCase() +
                                      entry.status.slice(1)}
                                  </span>
                                </TableCell>
                                <TableCell>
                                  {entry.fileId ? (
                                    <a
                                      href={`/api/employee/timesheet/download?fileId=${entry.fileId}`}
                                      className="text-[#7E69AB] hover:underline flex items-center"
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      <FileText className="h-4 w-4 mr-1" />
                                      <span>View</span>
                                    </a>
                                  ) : (
                                    <span className="text-gray-400 text-sm">
                                      None
                                    </span>
                                  )}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>

                      {/* Pagination */}
                      <div className="mt-4 flex justify-between items-center border-t pt-4">
                        <div className="text-sm text-gray-500">
                          Showing {timesheets.length} entries
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="font-medium mr-4">
                            Total Hours:{' '}
                            <span className="text-[#7E69AB]">
                              {totalHistoryHours}
                            </span>
                          </div>

                          {/* Pagination Controls */}
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handlePageChange(Math.max(1, currentPage - 1))
                              }
                              disabled={currentPage === 1 || loading}
                              className="text-gray-500 border-gray-200 hover:bg-[#7E69AB]/10"
                            >
                              <ChevronLeft className="h-4 w-4" />
                            </Button>

                            <span className="text-sm text-gray-700">
                              Page {currentPage} of {totalPages}
                            </span>

                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handlePageChange(
                                  Math.min(totalPages, currentPage + 1)
                                )
                              }
                              disabled={currentPage === totalPages || loading}
                              className="text-gray-500 border-gray-200 hover:bg-[#7E69AB]/10"
                            >
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Tips Section */}
          <div className="mt-10">
            <Card className="bg-gradient-to-r from-[#7E69AB]/5 to-[#33C3F0]/5 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-start">
                  <AlertCircle className="h-6 w-6 mr-4 text-[#7E69AB] flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">
                      Timesheet Tips
                    </h3>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>
                        • You can select any number of dates for your timesheet
                      </li>
                      <li>
                        • Include specific project details to help with billing
                      </li>
                      <li>• Submit timesheets by Friday 5 PM each week</li>
                      <li>• Attach supporting documents when necessary</li>
                      <li>
                        • Contact HR for any questions about your timesheet
                        submissions
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Toast Notification */}
        {toastVisible && (
          <Toast
            variant={toastType}
            className={`fixed top-4 right-4 z-50 w-auto max-w-md ${
              toastType === 'default'
                ? 'bg-[#7E69AB]/10 border-[#7E69AB]'
                : 'bg-red-950 border-red-500'
            }`}
          >
            <div className="flex">
              <div className="flex-1">
                <ToastTitle
                  className={
                    toastType === 'default' ? 'text-[#7E69AB]' : 'text-red-300'
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
      </div>
    </ToastProvider>
  );
};

export default TimesheetPage;
