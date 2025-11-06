'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  format,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  parseISO,
  subDays,
} from 'date-fns';
import {
  Calendar,
  Clock,
  FileText,
  Filter,
  Download,
  Edit,
  Check,
  X,
  User,
  AlertCircle,
  Search,
  ChevronLeft,
  ChevronRight,
  Save,
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

interface Timesheet {
  _id: string;
  userId: string;
  date: string;
  hoursWorked: number;
  description: string;
  project?: string;
  fileId?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt?: string;
  user?: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

interface TimesheetResponse {
  success: boolean;
  timesheets: Timesheet[];
  pagination: {
    total: number;
    pages: number;
    page: number;
    limit: number;
  };
  message?: string;
}

interface EmployeesResponse {
  success: boolean;
  users: User[];
  pagination: any;
  message?: string;
}

const AdminTimesheetPage: React.FC = () => {
  const router = useRouter();
  const { session, fetchSession } = useSessionStore();
  const [timesheets, setTimesheets] = useState<Timesheet[]>([]);
  const [employees, setEmployees] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [filter, setFilter] = useState('week');
  const [selectedEmployee, setSelectedEmployee] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [dateRange, setDateRange] = useState<{
    start: string;
    end: string;
  }>({
    start: format(subDays(new Date(), 7), 'yyyy-MM-dd'),
    end: format(new Date(), 'yyyy-MM-dd'),
  });
  const [searchQuery, setSearchQuery] = useState('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(10);

  // Edit dialog
  const [statusUpdateLoading, setStatusUpdateLoading] = useState(false);
  const [editingTimesheet, setEditingTimesheet] = useState<Timesheet | null>(
    null
  );
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    hoursWorked: 0,
    description: '',
    project: '',
    status: 'pending' as 'pending' | 'approved' | 'rejected',
  });

  // Toast notifications
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'default' | 'destructive'>(
    'default'
  );

  // Ref to track if the component is mounted
  const isMounted = useRef(false);

  // Show toast function
  const showToast = useCallback(
    (message: string, type: 'default' | 'destructive' = 'default') => {
      setToastMessage(message);
      setToastType(type);
      setToastVisible(true);

      // Auto-hide toast after 5 seconds
      setTimeout(() => {
        setToastVisible(false);
      }, 5000);
    },
    []
  );

  // Fetch employees list
  const fetchEmployees = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/employees');
      const data: EmployeesResponse = await response.json();

      if (data.success) {
        setEmployees(data.users);
      } else {
        showToast(data.message || 'Failed to fetch employees', 'destructive');
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
      showToast('An error occurred while fetching employees', 'destructive');
    }
  }, [showToast]);

  // Fetch timesheets with filters
  const fetchTimesheets = useCallback(async () => {
    try {
      setLoading(true);

      // Build query params
      const params = new URLSearchParams();

      // Set date range
      if (filter === 'custom') {
        // Use custom date range
        params.append('startDate', dateRange.start);
        params.append('endDate', dateRange.end);
      } else {
        // Calculate date range based on filter
        const now = new Date();
        let startDate, endDate;

        if (filter === 'week') {
          startDate = startOfWeek(now, { weekStartsOn: 1 });
          endDate = endOfWeek(now, { weekStartsOn: 1 });
        } else if (filter === 'month') {
          startDate = startOfMonth(now);
          endDate = endOfMonth(now);
        } else if (filter === 'today') {
          startDate = now;
          endDate = now;
        } else if (filter === 'yesterday') {
          startDate = subDays(now, 1);
          endDate = subDays(now, 1);
        }

        if (startDate && endDate) {
          params.append('startDate', format(startDate, 'yyyy-MM-dd'));
          params.append('endDate', format(endDate, 'yyyy-MM-dd'));
        }
      }

      // Add employee filter if selected
      if (selectedEmployee !== 'all') {
        params.append('userId', selectedEmployee);
      }

      // Add status filter if selected
      if (selectedStatus !== 'all') {
        params.append('status', selectedStatus);
      }

      // Add search query if present
      if (searchQuery) {
        params.append('search', searchQuery);
      }

      // Add pagination
      params.append('page', currentPage.toString());
      params.append('limit', itemsPerPage.toString());

      const response = await fetch(
        `/api/admin/timesheets?${params.toString()}`
      );
      const data: TimesheetResponse = await response.json();

      if (data.success) {
        setTimesheets(data.timesheets);
        setTotalPages(data.pagination.pages);
      } else {
        showToast(data.message || 'Failed to fetch timesheets', 'destructive');
      }
    } catch (error) {
      console.error('Error fetching timesheets:', error);
      showToast('An error occurred while fetching timesheets', 'destructive');
    } finally {
      setLoading(false);
    }
  }, [
    filter,
    dateRange,
    selectedEmployee,
    selectedStatus,
    searchQuery,
    currentPage,
    itemsPerPage,
    showToast,
  ]);

  // Initialize page
  useEffect(() => {
    // Ensure user session is loaded and is admin
    const initPage = async () => {
      await fetchSession();

      if (session?.user?.role !== 'admin') {
        router.push('/dashboard');
        return;
      }

      await fetchEmployees();
      fetchTimesheets();
    };

    if (!isMounted.current) {
      initPage();
      isMounted.current = true;
    }
  }, [fetchSession, router, session, fetchEmployees, fetchTimesheets]);

  // Update timesheet status
  const updateTimesheetStatus = async (
    id: string,
    status: 'approved' | 'rejected'
  ) => {
    setStatusUpdateLoading(true);
    try {
      const response = await fetch(`/api/admin/timesheets/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      const data = await response.json();

      if (data.success) {
        showToast(`Timesheet ${status} successfully`, 'default');
        fetchTimesheets();
      } else {
        showToast(
          data.message || `Failed to ${status} timesheet`,
          'destructive'
        );
      }
    } catch (error) {
      console.error(`Error ${status} timesheet:`, error);
      showToast(`An error occurred while ${status} timesheet`, 'destructive');
    } finally {
      setStatusUpdateLoading(false);
    }
  };

  // Handle pagination
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  // Open edit dialog
  const openEditDialog = (timesheet: Timesheet) => {
    setEditingTimesheet(timesheet);
    setEditFormData({
      hoursWorked: timesheet.hoursWorked,
      description: timesheet.description,
      project: timesheet.project || '',
      status: timesheet.status,
    });
    setIsEditDialogOpen(true);
  };

  // Handle edit form changes
  const handleEditFormChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: name === 'hoursWorked' ? parseFloat(value) : value,
    }));
  };

  // Update timesheet details
  const handleUpdateTimesheet = async () => {
    if (!editingTimesheet) return;

    try {
      const response = await fetch(
        `/api/admin/timesheets/${editingTimesheet._id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(editFormData),
        }
      );

      const data = await response.json();

      if (data.success) {
        showToast('Timesheet updated successfully', 'default');
        setIsEditDialogOpen(false);
        fetchTimesheets();
      } else {
        showToast(data.message || 'Failed to update timesheet', 'destructive');
      }
    } catch (error) {
      console.error('Error updating timesheet:', error);
      showToast('An error occurred while updating timesheet', 'destructive');
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return format(parseISO(dateString), 'MMM dd, yyyy');
  };

  // Get employee name from timesheet
  const getEmployeeName = (timesheet: Timesheet) => {
    if (timesheet.user) {
      return `${timesheet.user.firstName} ${timesheet.user.lastName}`;
    }

    // Try to find employee name from employees array
    const employee = employees.find((emp) => emp._id === timesheet.userId);
    if (employee) {
      return `${employee.firstName} ${employee.lastName}`;
    }

    return 'Unknown Employee';
  };

  // Calculate total hours
  const totalHours = timesheets.reduce(
    (sum, entry) => sum + entry.hoursWorked,
    0
  );

  // Loading/access check
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

  // Redirect non-admin users
  if (session.user.role !== 'admin') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F6F9FC]">
        <div className="text-center p-8 max-w-md">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Access Denied
          </h1>
          <p className="text-gray-600 mb-6">
            You don&apos;t have permission to access this page.
          </p>
          <Button
            onClick={() => router.push('/')}
            className="bg-[#7E69AB] hover:bg-[#6E59A5]"
          >
            Go to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <ToastProvider>
      <div className="min-h-screen bg-[#F6F9FC] py-8 sm:py-12 px-4">
        <div className="container mx-auto max-w-7xl">
          {/* Header Section */}
          <div className="mb-8">
            {/* <div className="inline-block mb-4">
              <div className="relative inline-flex items-center justify-center">
                <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-[#7E69AB] to-[#33C3F0] opacity-70 blur"></div>
                <div className="relative px-6 py-2 bg-white rounded-full text-sm font-normal text-gray-800">
                  Admin Portal
                </div>
              </div>
            </div> */}
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Timesheet Management
            </h1>
            <p className="text-gray-700">
              Review, approve, or reject employee timesheet submissions.
            </p>
          </div>

          {/* Filters Section */}
          <Card className="mb-8 shadow-md">
            <CardHeader className="bg-gradient-to-r from-[#7E69AB]/10 to-[#33C3F0]/10 pb-6">
              <CardTitle className="flex items-center text-xl">
                <Filter className="mr-2 h-5 w-5 text-[#7E69AB]" />
                Filter Timesheets
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <Label
                  htmlFor="timeframe"
                  className="text-sm text-gray-600 mb-2 block"
                >
                  Time Period
                </Label>
                <Select
                  value={filter}
                  onValueChange={(value) => setFilter(value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select time period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="yesterday">Yesterday</SelectItem>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                    <SelectItem value="custom">Custom Range</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {filter === 'custom' && (
                <>
                  <div>
                    <Label
                      htmlFor="startDate"
                      className="text-sm text-gray-600 mb-2 block"
                    >
                      Start Date
                    </Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={dateRange.start}
                      onChange={(e) =>
                        setDateRange({ ...dateRange, start: e.target.value })
                      }
                      className="w-full"
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="endDate"
                      className="text-sm text-gray-600 mb-2 block"
                    >
                      End Date
                    </Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={dateRange.end}
                      onChange={(e) =>
                        setDateRange({ ...dateRange, end: e.target.value })
                      }
                      className="w-full"
                    />
                  </div>
                </>
              )}

              <div>
                <Label
                  htmlFor="employee"
                  className="text-sm text-gray-600 mb-2 block"
                >
                  Employee
                </Label>
                <Select
                  value={selectedEmployee}
                  onValueChange={(value) => setSelectedEmployee(value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select employee" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Employees</SelectItem>
                    {employees.map((employee) => (
                      <SelectItem key={employee._id} value={employee._id}>
                        {`${employee.firstName} ${employee.lastName}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label
                  htmlFor="status"
                  className="text-sm text-gray-600 mb-2 block"
                >
                  Status
                </Label>
                <Select
                  value={selectedStatus}
                  onValueChange={(value) => setSelectedStatus(value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="md:col-span-2">
                <Label
                  htmlFor="search"
                  className="text-sm text-gray-600 mb-2 block"
                >
                  Search
                </Label>
                <div className="relative">
                  <Input
                    id="search"
                    type="text"
                    placeholder="Search by project, description..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
              </div>

              <div className="md:col-span-2 lg:col-span-4 mt-2">
                <Button
                  onClick={() => {
                    setCurrentPage(1); // Reset to first page when filtering
                    fetchTimesheets();
                  }}
                  className="bg-gradient-to-r from-[#7E69AB] to-[#33C3F0] text-white"
                >
                  Apply Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Timesheets Table Card */}
          <Card className="shadow-md">
            <CardHeader className="bg-gradient-to-r from-[#7E69AB]/10 to-[#33C3F0]/10">
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center text-xl">
                  <FileText className="mr-2 h-5 w-5 text-[#7E69AB]" />
                  Timesheet Entries
                </CardTitle>
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
                  <p>No timesheet entries found for the selected filters.</p>
                  <p className="text-sm">
                    Try adjusting your filters to see more results.
                  </p>
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Employee</TableHead>
                          <TableHead>Project</TableHead>
                          <TableHead>Hours</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Attachment</TableHead>
                          <TableHead>
                            Actions - ( Edit / Approve / Reject )
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {timesheets.map((timesheet) => (
                          <TableRow key={timesheet._id}>
                            <TableCell className="whitespace-nowrap">
                              {formatDate(timesheet.date)}
                            </TableCell>
                            <TableCell>
                              {getEmployeeName(timesheet)}
                              {timesheet.user?.email && (
                                <div className="text-xs text-gray-500">
                                  {timesheet.user.email}
                                </div>
                              )}
                            </TableCell>
                            <TableCell>{timesheet.project || 'N/A'}</TableCell>
                            <TableCell>{timesheet.hoursWorked}</TableCell>
                            <TableCell className="max-w-xs">
                              <div className="line-clamp-2 hover:line-clamp-none break-words">
                                {timesheet.description}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge
                                className={`${
                                  timesheet.status === 'approved'
                                    ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                    : timesheet.status === 'rejected'
                                      ? 'bg-red-100 text-red-800 hover:bg-red-200'
                                      : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                                }`}
                              >
                                {timesheet.status.charAt(0).toUpperCase() +
                                  timesheet.status.slice(1)}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {timesheet.fileId ? (
                                <a
                                  href={`/api/admin/timesheets/download?fileId=${timesheet.fileId}`}
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
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => openEditDialog(timesheet)}
                                  className="text-[#7E69AB] border-[#7E69AB]/30 hover:bg-[#7E69AB]/10 hover:border-[#7E69AB]"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                {timesheet.status === 'pending' && (
                                  <>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() =>
                                        updateTimesheetStatus(
                                          timesheet._id,
                                          'approved'
                                        )
                                      }
                                      disabled={statusUpdateLoading}
                                      className="text-green-600 border-green-600/30 hover:bg-green-600/10 hover:border-green-600"
                                    >
                                      <Check className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() =>
                                        updateTimesheetStatus(
                                          timesheet._id,
                                          'rejected'
                                        )
                                      }
                                      disabled={statusUpdateLoading}
                                      className="text-red-600 border-red-600/30 hover:bg-red-600/10 hover:border-red-600"
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </>
                                )}
                              </div>
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
                        <span className="text-[#7E69AB]">{totalHours}</span>
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

              {/* Edit Timesheet Dialog */}
              <Dialog
                open={isEditDialogOpen}
                onOpenChange={setIsEditDialogOpen}
              >
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-semibold text-gray-900">
                      Edit Timesheet
                    </DialogTitle>
                  </DialogHeader>

                  {editingTimesheet && (
                    <div className="mt-4 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label
                            htmlFor="date"
                            className="text-sm text-gray-600 block mb-1.5"
                          >
                            Date
                          </Label>
                          <div className="text-sm font-medium">
                            {formatDate(editingTimesheet.date)}
                          </div>
                        </div>

                        <div>
                          <Label
                            htmlFor="employee"
                            className="text-sm text-gray-600 block mb-1.5"
                          >
                            Employee
                          </Label>
                          <div className="text-sm font-medium">
                            {getEmployeeName(editingTimesheet)}
                          </div>
                        </div>
                      </div>

                      <div>
                        <Label
                          htmlFor="hoursWorked"
                          className="text-sm text-gray-600 mb-1.5 block"
                        >
                          Hours Worked
                        </Label>
                        <Input
                          id="hoursWorked"
                          name="hoursWorked"
                          type="number"
                          min="0"
                          max="24"
                          step="0.5"
                          value={editFormData.hoursWorked}
                          onChange={handleEditFormChange}
                          className="w-full"
                        />
                      </div>

                      <div>
                        <Label
                          htmlFor="project"
                          className="text-sm text-gray-600 mb-1.5 block"
                        >
                          Project
                        </Label>
                        <Input
                          id="project"
                          name="project"
                          type="text"
                          value={editFormData.project}
                          onChange={handleEditFormChange}
                          className="w-full"
                          placeholder="Project name or ID"
                        />
                      </div>

                      <div>
                        <Label
                          htmlFor="description"
                          className="text-sm text-gray-600 mb-1.5 block"
                        >
                          Description
                        </Label>
                        <Textarea
                          id="description"
                          name="description"
                          value={editFormData.description}
                          onChange={handleEditFormChange}
                          rows={4}
                          className="w-full"
                        />
                      </div>

                      <div>
                        <Label
                          htmlFor="status"
                          className="text-sm text-gray-600 mb-1.5 block"
                        >
                          Status
                        </Label>
                        <Select
                          value={editFormData.status}
                          onValueChange={(
                            value: 'pending' | 'approved' | 'rejected'
                          ) =>
                            setEditFormData((prev) => ({
                              ...prev,
                              status: value,
                            }))
                          }
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="approved">Approved</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}

                  <DialogFooter className="flex space-x-2 mt-6">
                    <DialogClose asChild>
                      <Button variant="outline" className="flex-1">
                        Cancel
                      </Button>
                    </DialogClose>
                    <Button
                      onClick={handleUpdateTimesheet}
                      className="flex-1 bg-gradient-to-r from-[#7E69AB] to-[#33C3F0] text-white"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>

          {/* Dashboard Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <Card className="shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Pending Timesheets</p>
                    <h3 className="text-2xl font-bold mt-1">
                      {timesheets.filter((t) => t.status === 'pending').length}
                    </h3>
                  </div>
                  <div className="bg-yellow-100 p-3 rounded-full">
                    <Clock className="h-6 w-6 text-yellow-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Total Hours Logged</p>
                    <h3 className="text-2xl font-bold mt-1">{totalHours}</h3>
                  </div>
                  <div className="bg-[#7E69AB]/10 p-3 rounded-full">
                    <FileText className="h-6 w-6 text-[#7E69AB]" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Active Employees</p>
                    <h3 className="text-2xl font-bold mt-1">
                      {new Set(timesheets.map((t) => t.userId)).size}
                    </h3>
                  </div>
                  <div className="bg-[#33C3F0]/10 p-3 rounded-full">
                    <User className="h-6 w-6 text-[#33C3F0]" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tips Section */}
          <div className="mt-10">
            <Card className="bg-gradient-to-r from-[#7E69AB]/5 to-[#33C3F0]/5 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-start">
                  <AlertCircle className="h-6 w-6 mr-4 text-[#7E69AB] flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">
                      Admin Tips
                    </h3>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>
                        • Approve or reject timesheets within 48 hours to ensure
                        timely processing
                      </li>
                      <li>
                        • Use the filter options to find specific employee
                        submissions
                      </li>
                      <li>
                        • Check attachments to verify work details when needed
                      </li>
                      <li>
                        • Edit timesheet entries to correct errors before
                        approval
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

export default AdminTimesheetPage;
