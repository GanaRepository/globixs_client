// app/admin/manage-employees/page.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Users,
  UserPlus,
  Search,
  ChevronLeft,
  ChevronRight,
  Mail,
  Phone,
  Trash2,
  Eye,
  EyeOff,
  KeyRound,
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import {
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
} from '@/components/ui/toast';
import ConfirmPopup from '@/components/ui/ConfirmPopup';

// User interface extending from your existing model
interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

export default function ManageEmployeesPage() {
  // State Management
  const [employees, setEmployees] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  // Form state for new employee
  const [newEmployee, setNewEmployee] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Confirmation dialog for deletion
  const [confirmPopup, setConfirmPopup] = useState({
    isOpen: false,
    employeeId: '',
    employeeName: '',
  });

  // Toast notification state
  const [toast, setToast] = useState({
    visible: false,
    message: '',
    type: 'default' as 'default' | 'destructive',
  });

  // Show toast notification
  const showToast = useCallback(
    (message: string, type: 'default' | 'destructive' = 'default') => {
      setToast({ visible: true, message, type });
      setTimeout(() => setToast((prev) => ({ ...prev, visible: false })), 3000);
    },
    []
  );

  // Fetch employees from the API
  const fetchEmployees = useCallback(async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
        search: searchQuery,
      });

      const response = await fetch(`/api/admin/employees?${queryParams}`, {
        credentials: 'include',
      });
      const data = await response.json();

      if (data.success) {
        setEmployees(data.users);
        setTotalPages(data.pagination.totalPages || 1);
      } else {
        throw new Error(data.message || 'Failed to fetch employees');
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
      showToast('Failed to fetch employees', 'destructive');
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchQuery, showToast]);

  // Initial fetch
  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewEmployee((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (
      !newEmployee.firstName ||
      !newEmployee.lastName ||
      !newEmployee.email ||
      !newEmployee.password
    ) {
      showToast('All fields are required', 'destructive');
      return;
    }

    // app/admin/manage-employees/page.tsx (continued)
    if (newEmployee.password !== confirmPassword) {
      showToast('Passwords do not match', 'destructive');
      return;
    }

    // Password validation
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(newEmployee.password)) {
      showToast(
        'Password must be at least 8 characters and include uppercase, lowercase, number, and special character',
        'destructive'
      );
      return;
    }

    try {
      const response = await fetch('/api/admin/employees', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newEmployee,
          role: 'employee', // Set role to employee
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        showToast('Employee created successfully', 'default');
        setDialogOpen(false);
        setNewEmployee({
          firstName: '',
          lastName: '',
          email: '',
          password: '',
        });
        setConfirmPassword('');
        fetchEmployees();
      } else {
        throw new Error(data.message || 'Failed to create employee');
      }
    } catch (error) {
      console.error('Error creating employee:', error);
      showToast(
        error instanceof Error ? error.message : 'Failed to create employee',
        'destructive'
      );
    }
  };

  // Handle employee deletion
  const confirmDelete = (id: string, name: string) => {
    setConfirmPopup({
      isOpen: true,
      employeeId: id,
      employeeName: name,
    });
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(
        `/api/admin/employees/${confirmPopup.employeeId}`,
        {
          method: 'DELETE',
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        showToast('Employee deleted successfully', 'default');
        fetchEmployees();
      } else {
        throw new Error(data.message || 'Failed to delete employee');
      }
    } catch (error) {
      console.error('Error deleting employee:', error);
      showToast(
        error instanceof Error ? error.message : 'Failed to delete employee',
        'destructive'
      );
    } finally {
      setConfirmPopup({
        isOpen: false,
        employeeId: '',
        employeeName: '',
      });
    }
  };

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page on new search
    fetchEmployees();
  };

  if (loading && employees.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#F6F9FC]">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-[#7E69AB] border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="mt-4 text-gray-700">Loading employees...</p>
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
              <Users className="w-4 h-4 text-[#7E69AB]" />
              <span className="text-[#7E69AB] text-sm uppercase tracking-wider font-medium">
                Admin Can Create and Manage Emloyees here
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Manage Employees
            </h1>
            <p className="text-gray-700 text-sm sm:text-base">
              Create and manage employee accounts with access to internal
              systems
            </p>
          </div>

          {/* Action Bar with Search and Create */}
          <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
            <form onSubmit={handleSearch} className="flex w-full sm:w-auto">
              <div className="relative flex-grow sm:max-w-md">
                <Input
                  placeholder="Search by name or email"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-10"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#7E69AB]"
                >
                  <Search className="h-4 w-4" />
                </button>
              </div>
            </form>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-contact-purple to-contact-teal text-white flex items-center">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add New Employee
                </Button>
              </DialogTrigger>

              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Create Employee Account</DialogTitle>
                  <DialogDescription>
                    Create a new employee account with access to internal
                    systems.
                  </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={newEmployee.firstName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={newEmployee.lastName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={newEmployee.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="password"
                      className="flex items-center gap-2"
                    >
                      <KeyRound className="h-4 w-4 text-contact-purple" />
                      Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        value={newEmployee.password}
                        onChange={handleInputChange}
                        required
                        className="pr-10"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-contact-purple transition-colors"
                        onClick={togglePasswordVisibility}
                        tabIndex={-1}
                      >
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500">
                      Password must be at least 8 characters and include
                      uppercase, lowercase, number, and special character.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>

                  <DialogFooter className="pt-4">
                    <DialogClose asChild>
                      <Button type="button" variant="outline">
                        Cancel
                      </Button>
                    </DialogClose>
                    <Button
                      type="submit"
                      className="bg-gradient-to-r from-contact-purple to-contact-teal text-white"
                    >
                      Create Employee
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Employee Table */}
          <Card className="bg-white backdrop-blur-sm border border-gray-100 hover:border-[#7E69AB]/20 transition-all duration-300 rounded-xl shadow-lg">
            {/* Mobile View: Card layout */}
            <div className="block sm:hidden">
              {employees.length === 0 ? (
                <div className="p-6 text-center">
                  <div className="flex flex-col items-center text-gray-400">
                    <Users className="h-8 w-8 mb-2 opacity-50" />
                    <p>No employees found</p>
                  </div>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {employees.map((employee) => (
                    <div key={employee._id} className="p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-gray-900 font-medium">
                          {employee.firstName} {employee.lastName}
                        </h3>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            employee.isActive
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {employee.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>

                      <div className="space-y-2 mb-3">
                        <div className="flex items-center text-gray-700">
                          <Mail className="h-4 w-4 mr-2 text-[#7E69AB]" />
                          <span className="text-sm truncate">
                            {employee.email}
                          </span>
                        </div>
                        <div className="flex items-center text-gray-700">
                          <Users className="h-4 w-4 mr-2 text-[#7E69AB]" />
                          <span className="text-sm capitalize">Employee</span>
                        </div>
                      </div>

                      <div className="flex justify-end pt-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-500 border-red-500/50 hover:bg-red-500/10 hover:border-red-500 transition-colors"
                          onClick={() =>
                            confirmDelete(
                              employee._id,
                              `${employee.firstName} ${employee.lastName}`
                            )
                          }
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Desktop View: Table layout */}
            <div className="hidden sm:block">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-gray-200">
                      <TableHead className="text-gray-600">Name</TableHead>
                      <TableHead className="text-gray-600">Email</TableHead>
                      <TableHead className="text-gray-600">Role</TableHead>
                      <TableHead className="text-gray-600">Status</TableHead>
                      <TableHead className="text-gray-600">Created</TableHead>
                      <TableHead className="text-gray-600">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {employees.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          <div className="flex flex-col items-center text-gray-400">
                            <Users className="h-8 w-8 mb-2 opacity-50" />
                            <p>No employees found</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      employees.map((employee) => (
                        <TableRow
                          key={employee._id}
                          className="border-b border-gray-200 hover:bg-[#7E69AB]/5 transition-colors"
                        >
                          <TableCell className="font-medium text-gray-900">
                            {employee.firstName} {employee.lastName}
                          </TableCell>
                          <TableCell>{employee.email}</TableCell>
                          <TableCell className="capitalize">
                            {employee.role}
                          </TableCell>
                          <TableCell>
                            <span
                              className={`px-2 py-1 text-xs rounded-full ${
                                employee.isActive
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {employee.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </TableCell>
                          <TableCell>
                            {new Date(employee.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-500 border-red-500/50 hover:bg-red-500/10 hover:border-red-500 transition-colors"
                              onClick={() =>
                                confirmDelete(
                                  employee._id,
                                  `${employee.firstName} ${employee.lastName}`
                                )
                              }
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Pagination */}
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

          {/* Confirm Popup */}
          <ConfirmPopup
            isOpen={confirmPopup.isOpen}
            title="Delete Employee"
            message={`Are you sure you want to delete ${confirmPopup.employeeName}'s account? This action cannot be undone.`}
            confirmText="Delete Employee"
            cancelText="Cancel"
            onConfirm={handleDelete}
            onCancel={() =>
              setConfirmPopup({
                isOpen: false,
                employeeId: '',
                employeeName: '',
              })
            }
            variant="danger"
          />

          {/* Toast Notification */}
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
