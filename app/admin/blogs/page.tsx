// 'use client';

// import { useState, useEffect, useCallback } from 'react';
// import {
//   FileText,
//   Trash2,
//   PlusCircle,
//   ArrowRight,
//   BookOpen,
//   Tag,
//   Calendar,
//   Image as ImageIcon,
//   AlertCircle,
// } from 'lucide-react';
// import { IBlog } from '@/types';
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
// import { Card } from '@/components/ui/card';

// const DEFAULT_CATEGORIES = [
//   { value: 'industry-trends', label: 'Industry Trends' },
//   { value: 'case-studies', label: 'Case Studies' },
//   { value: 'recruitment', label: 'Recruitment' },
//   { value: 'leadership', label: 'Leadership' },
// ];

// type BlogFormData = {
//   title: string;
//   excerpt: string;
//   content: string;
//   author: string;
//   category: IBlog['category'];
//   image: File | null;
//   imagePreview: string;
//   featured: boolean;
// };

// const INITIAL_BLOG: BlogFormData = {
//   title: '',
//   excerpt: '',
//   content: '',
//   author: '',
//   category: 'industry-trends',
//   image: null,
//   imagePreview: '',
//   featured: false,
// };

// type ToastType = 'default' | 'destructive';

// export default function AdminBlogManagement() {
//   const [blogs, setBlogs] = useState<IBlog[]>([]);
//   const [formData, setFormData] = useState<BlogFormData>(INITIAL_BLOG);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isEditing, setIsEditing] = useState(false);
//   const [editingId, setEditingId] = useState<string | null>(null);
//   const [toast, setToast] = useState({
//     show: false,
//     message: '',
//     type: 'default' as ToastType,
//   });

//   // Form validation errors state
//   const [formErrors, setFormErrors] = useState<Record<string, string>>({});

//   // State for the confirm popup
//   const [confirmPopup, setConfirmPopup] = useState({
//     isOpen: false,
//     blogId: '',
//     blogTitle: '',
//   });

//   // State for categories
//   const [categories, setCategories] =
//     useState<{ value: string; label: string }[]>(DEFAULT_CATEGORIES);
//   const [customCategory, setCustomCategory] = useState('');
//   const [showCustomCategory, setShowCustomCategory] = useState(false);

//   const fetchBlogs = useCallback(async () => {
//     try {
//       const res = await fetch('/api/admin/blogs');
//       const data = await res.json();
//       if (data.success) setBlogs(data.blogs);
//     } catch (error) {
//       showToast('Failed to load blogs', 'destructive');
//     } finally {
//       setIsLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchBlogs();
//   }, [fetchBlogs]);

//   useEffect(() => {
//     const savedCategories = localStorage.getItem('blogCategories');
//     if (savedCategories) {
//       try {
//         setCategories(JSON.parse(savedCategories));
//       } catch (error) {
//         console.error('Error loading saved categories:', error);
//       }
//     }
//   }, []);

//   const showToast = (message: string, type: ToastType = 'default') => {
//     setToast({ show: true, message, type });
//     setTimeout(
//       () => setToast({ show: false, message: '', type: 'default' }),
//       3000
//     );
//   };

//   const handleAddCustomCategory = () => {
//     if (!customCategory.trim()) {
//       showToast('Please enter a category name', 'destructive');
//       return;
//     }

//     const categoryValue = customCategory
//       .trim()
//       .toLowerCase()
//       .replace(/\s+/g, '-');

//     if (categories.some((cat) => cat.value === categoryValue)) {
//       showToast('This category already exists', 'destructive');
//       return;
//     }

//     const newCategory = { value: categoryValue, label: customCategory.trim() };
//     setCategories([...categories, newCategory]);
//     setCustomCategory('');
//     setFormData({ ...formData, category: categoryValue });
//     setShowCustomCategory(false);

//     localStorage.setItem(
//       'blogCategories',
//       JSON.stringify([...categories, newCategory])
//     );

//     showToast('New category added successfully');
//   };

//   // Validate form fields
//   const validateForm = (): boolean => {
//     const errors: Record<string, string> = {};

//     if (!formData.title.trim()) {
//       errors.title = 'Blog title is required';
//     }

//     if (!formData.excerpt.trim()) {
//       errors.excerpt = 'Blog excerpt is required';
//     }

//     if (!formData.content.trim()) {
//       errors.content = 'Blog content is required';
//     }

//     if (!formData.author.trim()) {
//       errors.author = 'Author name is required';
//     }

//     if (!formData.category) {
//       errors.category = 'Please select a category';
//     }

//     // Image is optional, so no validation needed

//     setFormErrors(errors);

//     // If any errors exist, show toast with first error
//     if (Object.keys(errors).length > 0) {
//       const firstErrorMessage = Object.values(errors)[0];
//       showToast(firstErrorMessage, 'destructive');
//       return false;
//     }

//     return true;
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     // Validate form before submission
//     if (!validateForm()) {
//       return;
//     }

//     try {
//       const formDataObj = new FormData();

//       // Append text fields
//       formDataObj.append('title', formData.title);
//       formDataObj.append('excerpt', formData.excerpt);
//       formDataObj.append('content', formData.content);
//       formDataObj.append('author', formData.author);
//       formDataObj.append('category', formData.category);
//       formDataObj.append('featured', formData.featured.toString());

//       // Append file if available
//       if (formData.image) {
//         formDataObj.append('blogImage', formData.image);
//       }

//       const url = isEditing
//         ? `/api/admin/blogs/${editingId}`
//         : '/api/admin/blogs';
//       const method = isEditing ? 'PUT' : 'POST';

//       const res = await fetch(url, {
//         method,
//         body: formDataObj,
//       });

//       const data = await res.json();

//       if (data.success) {
//         showToast(
//           isEditing ? 'Blog updated successfully' : 'Blog added successfully'
//         );
//         setFormData(INITIAL_BLOG);
//         setIsEditing(false);
//         setEditingId(null);
//         fetchBlogs();
//       } else {
//         throw new Error(data.message || 'Failed to save blog');
//       }
//     } catch (error) {
//       showToast(
//         error instanceof Error ? error.message : 'Failed to save blog',
//         'destructive'
//       );
//     }
//   };

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       // Create object URL for preview
//       const imageUrl = URL.createObjectURL(file);
//       setFormData({
//         ...formData,
//         image: file,
//         imagePreview: imageUrl,
//       });
//     }
//   };

//   const handleEdit = (blog: IBlog) => {
//     setIsEditing(true);
//     setEditingId(blog._id || null);
//     setFormData({
//       title: blog.title,
//       excerpt: blog.excerpt,
//       content: blog.content,
//       author: blog.author,
//       category: blog.category,
//       image: null, // Can't restore the file object
//       imagePreview: blog.image || '',
//       featured: blog.featured,
//     });

//     // Clear any previous form errors
//     setFormErrors({});

//     // Scroll to form
//     window.scrollTo({
//       top: 0,
//       behavior: 'smooth',
//     });
//   };

//   const handleCancel = () => {
//     setIsEditing(false);
//     setEditingId(null);
//     setFormData(INITIAL_BLOG);
//     setFormErrors({});
//   };

//   // Open confirm popup instead of directly deleting
//   const confirmDelete = (id: string, title: string) => {
//     setConfirmPopup({
//       isOpen: true,
//       blogId: id,
//       blogTitle: title,
//     });
//   };

//   // Handle actual deletion when confirmed
//   const handleDelete = async () => {
//     const id = confirmPopup.blogId;

//     try {
//       const res = await fetch(`/api/admin/blogs/${id}`, { method: 'DELETE' });
//       const data = await res.json();

//       if (data.success) {
//         showToast(data.message || 'Blog deleted successfully');
//         fetchBlogs();
//       } else {
//         throw new Error(data.message || 'Failed to delete blog');
//       }
//     } catch (error) {
//       showToast(
//         error instanceof Error ? error.message : 'Failed to delete blog',
//         'destructive'
//       );
//     } finally {
//       // Close the confirm popup
//       setConfirmPopup({ isOpen: false, blogId: '', blogTitle: '' });
//     }
//   };

//   // Cancel deletion
//   const cancelDelete = () => {
//     setConfirmPopup({ isOpen: false, blogId: '', blogTitle: '' });
//   };

//   if (isLoading) {
//     return (
//       <div className="flex justify-center items-center min-h-screen bg-[#F6F9FC]">
//         <div className="text-center p-8">
//           <div className="animate-spin h-8 w-8 border-4 border-[#7E69AB] border-t-transparent rounded-full mx-auto mb-4"></div>
//           <p className="text-gray-700">Loading blogs...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <ToastProvider>
//       <main className="min-h-screen bg-[#F6F9FC] py-12 px-4">
//         <div className="max-w-5xl mx-auto">
//           {/* Header */}
//           <div className="mb-8">
//             <div className="inline-flex items-center gap-2 bg-[#7E69AB]/10 rounded-full px-4 py-1.5 mb-4 border border-[#7E69AB]/20">
//               <BookOpen className="w-4 h-4 text-[#7E69AB]" />
//               <span className="text-[#7E69AB] text-sm uppercase tracking-wider font-medium">
//                 Blog Management
//               </span>
//             </div>
//             <div className="flex justify-between items-center">
//               <h1 className="text-3xl font-bold text-gray-900">
//                 {isEditing ? 'Edit Blog Post' : 'Create New Blog Post'}
//               </h1>
//               <a
//                 href="/media"
//                 className="text-[#7E69AB] hover:text-[#9b87f5] flex items-center group transition-colors"
//               >
//                 View Media Page
//                 <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
//               </a>
//             </div>
//           </div>

//           {/* Blog Form */}
//           <Card className="bg-white/90 backdrop-blur-sm rounded-xl p-8 border border-gray-100 hover:border-[#7E69AB]/20 transition-all duration-300 shadow-lg mb-12">
//             <form onSubmit={handleSubmit} className="space-y-6">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div className="md:col-span-2">
//                   <label className="block text-sm text-gray-600 mb-2">
//                     Blog Title *
//                   </label>
//                   <input
//                     required
//                     className={`w-full px-3 py-2 bg-white text-gray-800 border ${
//                       formErrors.title
//                         ? 'border-red-500'
//                         : 'border-gray-200 hover:border-[#7E69AB]/30 focus:border-[#7E69AB]/50'
//                     } rounded-md transition-colors focus:outline-none`}
//                     value={formData.title}
//                     onChange={(e) => {
//                       setFormData({ ...formData, title: e.target.value });
//                       if (formErrors.title) {
//                         const newErrors = { ...formErrors };
//                         delete newErrors.title;
//                         setFormErrors(newErrors);
//                       }
//                     }}
//                     placeholder="e.g., 5 Trends Reshaping IT Staffing in 2025"
//                   />
//                   {formErrors.title && (
//                     <p className="mt-1 text-xs text-red-500">
//                       {formErrors.title}
//                     </p>
//                   )}
//                 </div>

//                 <div className="md:col-span-2">
//                   <label className="block text-sm text-gray-600 mb-2">
//                     Short Excerpt *
//                   </label>
//                   <textarea
//                     required
//                     className={`w-full px-3 py-2 bg-white text-gray-800 border ${
//                       formErrors.excerpt
//                         ? 'border-red-500'
//                         : 'border-gray-200 hover:border-[#7E69AB]/30 focus:border-[#7E69AB]/50'
//                     } rounded-md transition-colors focus:outline-none h-24`}
//                     value={formData.excerpt}
//                     onChange={(e) => {
//                       setFormData({ ...formData, excerpt: e.target.value });
//                       if (formErrors.excerpt) {
//                         const newErrors = { ...formErrors };
//                         delete newErrors.excerpt;
//                         setFormErrors(newErrors);
//                       }
//                     }}
//                     placeholder="Write a brief 1-2 sentence summary of the blog post (will be displayed in blog cards)"
//                   />
//                   {formErrors.excerpt && (
//                     <p className="mt-1 text-xs text-red-500">
//                       {formErrors.excerpt}
//                     </p>
//                   )}
//                 </div>

//                 <div>
//                   <label className="block text-sm text-gray-600 mb-2">
//                     Author *
//                   </label>
//                   <input
//                     required
//                     className={`w-full px-3 py-2 bg-white text-gray-800 border ${
//                       formErrors.author
//                         ? 'border-red-500'
//                         : 'border-gray-200 hover:border-[#7E69AB]/30 focus:border-[#7E69AB]/50'
//                     } rounded-md transition-colors focus:outline-none`}
//                     value={formData.author}
//                     onChange={(e) => {
//                       setFormData({ ...formData, author: e.target.value });
//                       if (formErrors.author) {
//                         const newErrors = { ...formErrors };
//                         delete newErrors.author;
//                         setFormErrors(newErrors);
//                       }
//                     }}
//                     placeholder="e.g., Sarah Johnson"
//                   />
//                   {formErrors.author && (
//                     <p className="mt-1 text-xs text-red-500">
//                       {formErrors.author}
//                     </p>
//                   )}
//                 </div>

//                 <div>
//                   <label className="block text-sm text-gray-600 mb-2">
//                     Category *
//                   </label>
//                   {showCustomCategory ? (
//                     <div className="flex items-center space-x-2">
//                       <input
//                         type="text"
//                         className="flex-1 px-3 py-2 bg-white text-gray-800 border border-gray-200 hover:border-[#7E69AB]/30 focus:border-[#7E69AB]/50 rounded-md transition-colors focus:outline-none"
//                         value={customCategory}
//                         onChange={(e) => setCustomCategory(e.target.value)}
//                         placeholder="Enter new category name"
//                       />
//                       <Button
//                         type="button"
//                         onClick={handleAddCustomCategory}
//                         className="bg-[#7E69AB] hover:bg-[#7E69AB]/90 text-white"
//                       >
//                         Add
//                       </Button>
//                       <Button
//                         type="button"
//                         variant="outline"
//                         onClick={() => setShowCustomCategory(false)}
//                       >
//                         Cancel
//                       </Button>
//                     </div>
//                   ) : (
//                     <div className="flex items-center space-x-2">
//                       <select
//                         required
//                         className={`flex-1 px-3 py-2 bg-white text-gray-800 border ${
//                           formErrors.category
//                             ? 'border-red-500'
//                             : 'border-gray-200 hover:border-[#7E69AB]/30 focus:border-[#7E69AB]/50'
//                         } rounded-md transition-colors focus:outline-none`}
//                         value={formData.category}
//                         onChange={(e) => {
//                           setFormData({
//                             ...formData,
//                             category: e.target.value,
//                           });
//                           if (formErrors.category) {
//                             const newErrors = { ...formErrors };
//                             delete newErrors.category;
//                             setFormErrors(newErrors);
//                           }
//                         }}
//                       >
//                         <option value="">Select category</option>
//                         {categories.map((category) => (
//                           <option key={category.value} value={category.value}>
//                             {category.label}
//                           </option>
//                         ))}
//                       </select>
//                       <Button
//                         type="button"
//                         variant="outline"
//                         onClick={() => setShowCustomCategory(true)}
//                         className="whitespace-nowrap"
//                       >
//                         + Custom
//                       </Button>
//                     </div>
//                   )}
//                   {formErrors.category && (
//                     <p className="mt-1 text-xs text-red-500">
//                       {formErrors.category}
//                     </p>
//                   )}
//                 </div>

//                 <div className="md:col-span-2">
//                   <label className="block text-sm text-gray-600 mb-2">
//                     Featured Image
//                   </label>
//                   <div className="flex items-start space-x-4">
//                     <div className="flex-1">
//                       <div className="flex items-center justify-center w-full">
//                         <label
//                           htmlFor="dropzone-file"
//                           className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
//                         >
//                           <div className="flex flex-col items-center justify-center pt-5 pb-6">
//                             <ImageIcon className="w-8 h-8 mb-3 text-gray-400" />
//                             <p className="mb-2 text-sm text-gray-500">
//                               <span className="font-semibold">
//                                 Click to upload
//                               </span>{' '}
//                               or drag and drop
//                             </p>
//                             <p className="text-xs text-gray-500">
//                               SVG, PNG, JPG or GIF (MAX. 2MB)
//                             </p>
//                           </div>
//                           <input
//                             id="dropzone-file"
//                             type="file"
//                             className="hidden"
//                             onChange={handleImageChange}
//                             accept="image/*"
//                           />
//                         </label>
//                       </div>
//                     </div>
//                     {formData.imagePreview && (
//                       <div className="w-32 h-32 relative border rounded-lg overflow-hidden">
//                         <img
//                           src={formData.imagePreview}
//                           alt="Preview"
//                           className="w-full h-full object-cover"
//                         />
//                         <button
//                           type="button"
//                           className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
//                           onClick={() =>
//                             setFormData({
//                               ...formData,
//                               image: null,
//                               imagePreview: '',
//                             })
//                           }
//                         >
//                           <Trash2 className="w-4 h-4" />
//                         </button>
//                       </div>
//                     )}
//                   </div>
//                 </div>

//                 <div className="md:col-span-2 flex items-center space-x-2">
//                   <input
//                     type="checkbox"
//                     id="featured"
//                     checked={formData.featured}
//                     onChange={(e) =>
//                       setFormData({ ...formData, featured: e.target.checked })
//                     }
//                     className="w-4 h-4 text-[#7E69AB] rounded border-gray-300 focus:ring-[#7E69AB]"
//                   />
//                   <label htmlFor="featured" className="text-sm text-gray-700">
//                     Feature this blog post (will be highlighted on Media page)
//                   </label>
//                 </div>

//                 <div className="md:col-span-2">
//                   <label className="block text-sm text-gray-600 mb-2">
//                     Content *
//                   </label>
//                   <textarea
//                     required
//                     className={`w-full px-3 py-2 bg-white text-gray-800 border ${
//                       formErrors.content
//                         ? 'border-red-500'
//                         : 'border-gray-200 hover:border-[#7E69AB]/30 focus:border-[#7E69AB]/50'
//                     } rounded-md transition-colors focus:outline-none min-h-[400px]`}
//                     value={formData.content}
//                     onChange={(e) => {
//                       setFormData({ ...formData, content: e.target.value });
//                       if (formErrors.content) {
//                         const newErrors = { ...formErrors };
//                         delete newErrors.content;
//                         setFormErrors(newErrors);
//                       }
//                     }}
//                     placeholder="Write your blog content here... HTML formatting is supported for styling."
//                     style={{ whiteSpace: 'pre-wrap' }}
//                   />
//                   {formErrors.content && (
//                     <p className="mt-1 text-xs text-red-500">
//                       {formErrors.content}
//                     </p>
//                   )}
//                   <p className="mt-2 text-xs text-gray-500">
//                     Tip: You can use HTML tags like &lt;h2&gt;, &lt;p&gt;,
//                     &lt;ul&gt;, &lt;li&gt;, &lt;blockquote&gt;, etc. for
//                     formatting.
//                   </p>
//                 </div>
//               </div>

//               <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
//                 {isEditing && (
//                   <Button
//                     type="button"
//                     variant="outline"
//                     onClick={handleCancel}
//                     className="border-gray-300"
//                   >
//                     Cancel
//                   </Button>
//                 )}
//                 <Button
//                   type="submit"
//                   className="bg-gradient-to-r from-[#7E69AB] to-[#33C3F0] hover:from-[#7E69AB]/90 hover:to-[#33C3F0]/90 text-white rounded-full py-2 px-6 transition-all duration-300 flex items-center justify-center"
//                 >
//                   {isEditing ? 'Update Blog Post' : 'Publish Blog Post'}
//                 </Button>
//               </div>
//             </form>
//           </Card>

//           {/* Current Blogs List */}
//           {blogs.length > 0 && (
//             <div className="bg-white/90 backdrop-blur-sm rounded-xl p-8 border border-gray-100 hover:border-[#7E69AB]/20 transition-all duration-300 shadow-lg mb-8">
//               <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
//                 <FileText className="w-5 h-5 mr-2 text-[#7E69AB]" />
//                 Published Blog Posts
//               </h2>
//               <div className="space-y-4">
//                 {blogs.map((blog) => (
//                   <div
//                     key={blog._id as string}
//                     className="bg-white rounded-lg p-4 border border-gray-100 hover:border-[#7E69AB]/30 transition-all duration-300"
//                   >
//                     <div className="flex flex-col sm:flex-row sm:items-center justify-between">
//                       <div className="flex-1 mb-3 sm:mb-0">
//                         <div className="flex items-center mb-2">
//                           <span className="text-xs text-white px-2 py-1 rounded-full bg-[#7E69AB] mr-2">
//                             {categories.find((c) => c.value === blog.category)
//                               ?.label || blog.category}
//                           </span>
//                           {blog.featured && (
//                             <span className="text-xs text-white px-2 py-1 rounded-full bg-[#33C3F0]">
//                               Featured
//                             </span>
//                           )}
//                         </div>
//                         <h3 className="text-lg font-medium text-gray-900">
//                           {blog.title}
//                         </h3>
//                         <div className="flex flex-wrap gap-3 mt-2 text-sm">
//                           <span className="text-gray-600 flex items-center">
//                             <Calendar className="w-4 h-4 mr-1 text-[#7E69AB]" />
//                             {new Date(blog.createdAt).toLocaleDateString()}
//                           </span>
//                           <span className="text-gray-400">•</span>
//                           <span className="text-gray-600">{blog.author}</span>
//                         </div>
//                       </div>
//                       <div className="flex space-x-2">
//                         <Button
//                           size="sm"
//                           variant="outline"
//                           onClick={() => handleEdit(blog)}
//                           className="text-[#7E69AB] border-[#7E69AB]/30 hover:bg-[#7E69AB]/10 hover:border-[#7E69AB] transition-colors"
//                         >
//                           Edit
//                         </Button>
//                         <Button
//                           size="sm"
//                           variant="outline"
//                           className="text-red-500 border-red-500/30 hover:bg-red-500/10 hover:border-red-500 transition-colors"
//                           onClick={() =>
//                             confirmDelete(blog._id as string, blog.title)
//                           }
//                         >
//                           <Trash2 className="h-4 w-4" />
//                         </Button>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* Confirm Popup */}
//           <ConfirmPopup
//             isOpen={confirmPopup.isOpen}
//             title="Delete Blog Post"
//             message={`Are you sure you want to delete "${confirmPopup.blogTitle}"? This action cannot be undone.`}
//             confirmText="Delete Blog"
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
import Image from 'next/image';
import {
  FileText,
  Trash2,
  PlusCircle,
  ArrowRight,
  BookOpen,
  Tag,
  Calendar,
  Image as ImageIcon,
  AlertCircle,
} from 'lucide-react';
import { IBlog } from '@/types';
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
import { Card } from '@/components/ui/card';

const DEFAULT_CATEGORIES = [
  { value: 'industry-trends', label: 'Industry Trends' },
  { value: 'case-studies', label: 'Case Studies' },
  { value: 'recruitment', label: 'Recruitment' },
  { value: 'leadership', label: 'Leadership' },
];

type BlogFormData = {
  title: string;
  excerpt: string;
  content: string;
  author: string;
  category: IBlog['category'];
  image: File | null;
  imagePreview: string;
  featured: boolean;
};

const INITIAL_BLOG: BlogFormData = {
  title: '',
  excerpt: '',
  content: '',
  author: '',
  category: 'industry-trends',
  image: null,
  imagePreview: '',
  featured: false,
};

type ToastType = 'default' | 'destructive';

export default function AdminBlogManagement() {
  const [blogs, setBlogs] = useState<IBlog[]>([]);
  const [formData, setFormData] = useState<BlogFormData>(INITIAL_BLOG);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [toast, setToast] = useState({
    show: false,
    message: '',
    type: 'default' as ToastType,
  });

  // Form validation errors state
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // State for the confirm popup
  const [confirmPopup, setConfirmPopup] = useState({
    isOpen: false,
    blogId: '',
    blogTitle: '',
  });

  // State for categories
  const [categories, setCategories] =
    useState<{ value: string; label: string }[]>(DEFAULT_CATEGORIES);
  const [customCategory, setCustomCategory] = useState('');
  const [showCustomCategory, setShowCustomCategory] = useState(false);

  const fetchBlogs = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/blogs');
      const data = await res.json();
      if (data.success) setBlogs(data.blogs);
    } catch (error) {
      showToast('Failed to load blogs', 'destructive');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  useEffect(() => {
    const savedCategories = localStorage.getItem('blogCategories');
    if (savedCategories) {
      try {
        setCategories(JSON.parse(savedCategories));
      } catch (error) {
        console.error('Error loading saved categories:', error);
      }
    }
  }, []);

  const showToast = (message: string, type: ToastType = 'default') => {
    setToast({ show: true, message, type });
    setTimeout(
      () => setToast({ show: false, message: '', type: 'default' }),
      3000
    );
  };

  const handleAddCustomCategory = () => {
    if (!customCategory.trim()) {
      showToast('Please enter a category name', 'destructive');
      return;
    }

    const categoryValue = customCategory
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-');

    if (categories.some((cat) => cat.value === categoryValue)) {
      showToast('This category already exists', 'destructive');
      return;
    }

    const newCategory = { value: categoryValue, label: customCategory.trim() };
    setCategories([...categories, newCategory]);
    setCustomCategory('');
    setFormData({ ...formData, category: categoryValue });
    setShowCustomCategory(false);

    localStorage.setItem(
      'blogCategories',
      JSON.stringify([...categories, newCategory])
    );

    showToast('New category added successfully');
  };

  // Validate form fields
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.title.trim()) {
      errors.title = 'Blog title is required';
    }

    if (!formData.excerpt.trim()) {
      errors.excerpt = 'Blog excerpt is required';
    }

    if (!formData.content.trim()) {
      errors.content = 'Blog content is required';
    }

    if (!formData.author.trim()) {
      errors.author = 'Author name is required';
    }

    if (!formData.category) {
      errors.category = 'Please select a category';
    }

    // Image is optional, so no validation needed

    setFormErrors(errors);

    // If any errors exist, show toast with first error
    if (Object.keys(errors).length > 0) {
      const firstErrorMessage = Object.values(errors)[0];
      showToast(firstErrorMessage, 'destructive');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    try {
      const formDataObj = new FormData();

      // Append text fields
      formDataObj.append('title', formData.title);
      formDataObj.append('excerpt', formData.excerpt);
      formDataObj.append('content', formData.content);
      formDataObj.append('author', formData.author);
      formDataObj.append('category', formData.category);
      formDataObj.append('featured', formData.featured.toString());

      // Append file if available
      if (formData.image) {
        formDataObj.append('blogImage', formData.image);
      }

      const url = isEditing
        ? `/api/admin/blogs/${editingId}`
        : '/api/admin/blogs';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        body: formDataObj,
      });

      const data = await res.json();

      if (data.success) {
        showToast(
          isEditing ? 'Blog updated successfully' : 'Blog added successfully'
        );
        setFormData(INITIAL_BLOG);
        setIsEditing(false);
        setEditingId(null);
        fetchBlogs();
      } else {
        throw new Error(data.message || 'Failed to save blog');
      }
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : 'Failed to save blog',
        'destructive'
      );
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create object URL for preview
      const imageUrl = URL.createObjectURL(file);
      setFormData({
        ...formData,
        image: file,
        imagePreview: imageUrl,
      });
    }
  };

  const handleEdit = (blog: IBlog) => {
    setIsEditing(true);
    setEditingId(blog._id || null);
    setFormData({
      title: blog.title,
      excerpt: blog.excerpt,
      content: blog.content,
      author: blog.author,
      category: blog.category,
      image: null, // Can't restore the file object
      imagePreview: blog.image || '',
      featured: blog.featured,
    });

    // Clear any previous form errors
    setFormErrors({});

    // Scroll to form
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingId(null);
    setFormData(INITIAL_BLOG);
    setFormErrors({});
  };

  // Open confirm popup instead of directly deleting
  const confirmDelete = (id: string, title: string) => {
    setConfirmPopup({
      isOpen: true,
      blogId: id,
      blogTitle: title,
    });
  };

  // Handle actual deletion when confirmed
  const handleDelete = async () => {
    const id = confirmPopup.blogId;

    try {
      const res = await fetch(`/api/admin/blogs/${id}`, { method: 'DELETE' });
      const data = await res.json();

      if (data.success) {
        showToast(data.message || 'Blog deleted successfully');
        fetchBlogs();
      } else {
        throw new Error(data.message || 'Failed to delete blog');
      }
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : 'Failed to delete blog',
        'destructive'
      );
    } finally {
      // Close the confirm popup
      setConfirmPopup({ isOpen: false, blogId: '', blogTitle: '' });
    }
  };

  // Cancel deletion
  const cancelDelete = () => {
    setConfirmPopup({ isOpen: false, blogId: '', blogTitle: '' });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#F6F9FC]">
        <div className="text-center p-8">
          <div className="animate-spin h-8 w-8 border-4 border-[#7E69AB] border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-700">Loading blogs...</p>
        </div>
      </div>
    );
  }

  return (
    <ToastProvider>
      <main className="min-h-screen bg-[#F6F9FC] py-12 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 bg-[#7E69AB]/10 rounded-full px-4 py-1.5 mb-4 border border-[#7E69AB]/20">
              <BookOpen className="w-4 h-4 text-[#7E69AB]" />
              <span className="text-[#7E69AB] text-sm uppercase tracking-wider font-medium">
                Admin can Posts blogs from here
              </span>
            </div>
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-gray-900">
                {isEditing ? 'Edit Blog Post' : 'Create New Blog Post'}
              </h1>
              <a
                href="/media"
                className="text-[#7E69AB] hover:text-[#9b87f5] flex items-center group transition-colors"
              >
                View Media Page
                <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>

          {/* Blog Form */}
          <Card className="bg-white/90 backdrop-blur-sm rounded-xl p-8 border border-gray-100 hover:border-[#7E69AB]/20 transition-all duration-300 shadow-lg mb-12">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-600 mb-2">
                    Blog Title *
                  </label>
                  <input
                    required
                    className={`w-full px-3 py-2 bg-white text-gray-800 border ${
                      formErrors.title
                        ? 'border-red-500'
                        : 'border-gray-200 hover:border-[#7E69AB]/30 focus:border-[#7E69AB]/50'
                    } rounded-md transition-colors focus:outline-none`}
                    value={formData.title}
                    onChange={(e) => {
                      setFormData({ ...formData, title: e.target.value });
                      if (formErrors.title) {
                        const newErrors = { ...formErrors };
                        delete newErrors.title;
                        setFormErrors(newErrors);
                      }
                    }}
                    placeholder="e.g., 5 Trends Reshaping IT Staffing in 2025"
                  />
                  {formErrors.title && (
                    <p className="mt-1 text-xs text-red-500">
                      {formErrors.title}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-600 mb-2">
                    Short Excerpt *
                  </label>
                  <textarea
                    required
                    className={`w-full px-3 py-2 bg-white text-gray-800 border ${
                      formErrors.excerpt
                        ? 'border-red-500'
                        : 'border-gray-200 hover:border-[#7E69AB]/30 focus:border-[#7E69AB]/50'
                    } rounded-md transition-colors focus:outline-none h-24`}
                    value={formData.excerpt}
                    onChange={(e) => {
                      setFormData({ ...formData, excerpt: e.target.value });
                      if (formErrors.excerpt) {
                        const newErrors = { ...formErrors };
                        delete newErrors.excerpt;
                        setFormErrors(newErrors);
                      }
                    }}
                    placeholder="Write a brief 1-2 sentence summary of the blog post (will be displayed in blog cards)"
                  />
                  {formErrors.excerpt && (
                    <p className="mt-1 text-xs text-red-500">
                      {formErrors.excerpt}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-2">
                    Author *
                  </label>
                  <input
                    required
                    className={`w-full px-3 py-2 bg-white text-gray-800 border ${
                      formErrors.author
                        ? 'border-red-500'
                        : 'border-gray-200 hover:border-[#7E69AB]/30 focus:border-[#7E69AB]/50'
                    } rounded-md transition-colors focus:outline-none`}
                    value={formData.author}
                    onChange={(e) => {
                      setFormData({ ...formData, author: e.target.value });
                      if (formErrors.author) {
                        const newErrors = { ...formErrors };
                        delete newErrors.author;
                        setFormErrors(newErrors);
                      }
                    }}
                    placeholder="e.g., Sarah Johnson"
                  />
                  {formErrors.author && (
                    <p className="mt-1 text-xs text-red-500">
                      {formErrors.author}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-2">
                    Category *
                  </label>
                  {showCustomCategory ? (
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        className="flex-1 px-3 py-2 bg-white text-gray-800 border border-gray-200 hover:border-[#7E69AB]/30 focus:border-[#7E69AB]/50 rounded-md transition-colors focus:outline-none"
                        value={customCategory}
                        onChange={(e) => setCustomCategory(e.target.value)}
                        placeholder="Enter new category name"
                      />
                      <Button
                        type="button"
                        onClick={handleAddCustomCategory}
                        className="bg-[#7E69AB] hover:bg-[#7E69AB]/90 text-white"
                      >
                        Add
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowCustomCategory(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <select
                        required
                        className={`flex-1 px-3 py-2 bg-white text-gray-800 border ${
                          formErrors.category
                            ? 'border-red-500'
                            : 'border-gray-200 hover:border-[#7E69AB]/30 focus:border-[#7E69AB]/50'
                        } rounded-md transition-colors focus:outline-none`}
                        value={formData.category}
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            category: e.target.value,
                          });
                          if (formErrors.category) {
                            const newErrors = { ...formErrors };
                            delete newErrors.category;
                            setFormErrors(newErrors);
                          }
                        }}
                      >
                        <option value="">Select category</option>
                        {categories.map((category) => (
                          <option key={category.value} value={category.value}>
                            {category.label}
                          </option>
                        ))}
                      </select>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowCustomCategory(true)}
                        className="whitespace-nowrap"
                      >
                        + Custom
                      </Button>
                    </div>
                  )}
                  {formErrors.category && (
                    <p className="mt-1 text-xs text-red-500">
                      {formErrors.category}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-600 mb-2">
                    Featured Image
                  </label>
                  <div className="flex items-start space-x-4">
                    <div className="flex-1">
                      <div className="flex items-center justify-center w-full">
                        <label
                          htmlFor="dropzone-file"
                          className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                        >
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <ImageIcon className="w-8 h-8 mb-3 text-gray-400" />
                            <p className="mb-2 text-sm text-gray-500">
                              <span className="font-semibold">
                                Click to upload
                              </span>{' '}
                              or drag and drop
                            </p>
                            <p className="text-xs text-gray-500">
                              SVG, PNG, JPG or GIF (MAX. 2MB)
                            </p>
                          </div>
                          <input
                            id="dropzone-file"
                            type="file"
                            className="hidden"
                            onChange={handleImageChange}
                            accept="image/*"
                          />
                        </label>
                      </div>
                    </div>
                    {formData.imagePreview && (
                      <div className="w-32 h-32 relative border rounded-lg overflow-hidden">
                        {/* Replace standard img with Next.js Image component */}
                        <div className="relative w-full h-full">
                          <Image
                            src={formData.imagePreview}
                            alt="Preview"
                            fill
                            style={{ objectFit: 'cover' }}
                            sizes="(max-width: 768px) 100vw, 128px"
                          />
                        </div>
                        <button
                          type="button"
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                          onClick={() =>
                            setFormData({
                              ...formData,
                              image: null,
                              imagePreview: '',
                            })
                          }
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="md:col-span-2 flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={formData.featured}
                    onChange={(e) =>
                      setFormData({ ...formData, featured: e.target.checked })
                    }
                    className="w-4 h-4 text-[#7E69AB] rounded border-gray-300 focus:ring-[#7E69AB]"
                  />
                  <label htmlFor="featured" className="text-sm text-gray-700">
                    Feature this blog post (will be highlighted on Media page)
                  </label>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-600 mb-2">
                    Content *
                  </label>
                  <textarea
                    required
                    className={`w-full px-3 py-2 bg-white text-gray-800 border ${
                      formErrors.content
                        ? 'border-red-500'
                        : 'border-gray-200 hover:border-[#7E69AB]/30 focus:border-[#7E69AB]/50'
                    } rounded-md transition-colors focus:outline-none min-h-[400px]`}
                    value={formData.content}
                    onChange={(e) => {
                      setFormData({ ...formData, content: e.target.value });
                      if (formErrors.content) {
                        const newErrors = { ...formErrors };
                        delete newErrors.content;
                        setFormErrors(newErrors);
                      }
                    }}
                    placeholder="Write your blog content here... HTML formatting is supported for styling."
                    style={{ whiteSpace: 'pre-wrap' }}
                  />
                  {formErrors.content && (
                    <p className="mt-1 text-xs text-red-500">
                      {formErrors.content}
                    </p>
                  )}
                  <p className="mt-2 text-xs text-gray-500">
                    Tip: You can use HTML tags like &lt;h2&gt;, &lt;p&gt;,
                    &lt;ul&gt;, &lt;li&gt;, &lt;blockquote&gt;, etc. for
                    formatting.
                  </p>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
                {isEditing && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    className="border-gray-300"
                  >
                    Cancel
                  </Button>
                )}
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-[#7E69AB] to-[#33C3F0] hover:from-[#7E69AB]/90 hover:to-[#33C3F0]/90 text-white rounded-full py-2 px-6 transition-all duration-300 flex items-center justify-center"
                >
                  {isEditing ? 'Update Blog Post' : 'Publish Blog Post'}
                </Button>
              </div>
            </form>
          </Card>

          {/* Current Blogs List */}
          {blogs.length > 0 && (
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-8 border border-gray-100 hover:border-[#7E69AB]/20 transition-all duration-300 shadow-lg mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-[#7E69AB]" />
                Published Blog Posts
              </h2>
              <div className="space-y-4">
                {blogs.map((blog) => (
                  <div
                    key={blog._id as string}
                    className="bg-white rounded-lg p-4 border border-gray-100 hover:border-[#7E69AB]/30 transition-all duration-300"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                      <div className="flex-1 mb-3 sm:mb-0">
                        <div className="flex items-center mb-2">
                          <span className="text-xs text-white px-2 py-1 rounded-full bg-[#7E69AB] mr-2">
                            {categories.find((c) => c.value === blog.category)
                              ?.label || blog.category}
                          </span>
                          {blog.featured && (
                            <span className="text-xs text-white px-2 py-1 rounded-full bg-[#33C3F0]">
                              Featured
                            </span>
                          )}
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">
                          {blog.title}
                        </h3>
                        <div className="flex flex-wrap gap-3 mt-2 text-sm">
                          <span className="text-gray-600 flex items-center">
                            <Calendar className="w-4 h-4 mr-1 text-[#7E69AB]" />
                            {new Date(blog.createdAt).toLocaleDateString()}
                          </span>
                          <span className="text-gray-400">•</span>
                          <span className="text-gray-600">{blog.author}</span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(blog)}
                          className="text-[#7E69AB] border-[#7E69AB]/30 hover:bg-[#7E69AB]/10 hover:border-[#7E69AB] transition-colors"
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-500 border-red-500/30 hover:bg-red-500/10 hover:border-red-500 transition-colors"
                          onClick={() =>
                            confirmDelete(blog._id as string, blog.title)
                          }
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
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
            title="Delete Blog Post"
            message={`Are you sure you want to delete "${confirmPopup.blogTitle}"? This action cannot be undone.`}
            confirmText="Delete Blog"
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
