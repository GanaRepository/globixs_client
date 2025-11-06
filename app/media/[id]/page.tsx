// 'use client';

// import { useState, useEffect } from 'react';
// import { useParams, useRouter } from 'next/navigation';
// import Image from 'next/image';
// import {
//   FiCalendar,
//   FiUser,
//   FiArrowLeft,
//   FiEye,
//   FiBookOpen,
//   FiMessageSquare,
//   FiSend,
//   FiArrowRight,
// } from 'react-icons/fi';
// import { Button } from '@/components/ui/button';
// import QuoteSection from '@/components/contact/QuoteSection';
// import { IBlog } from '@/types';
// import { IComment } from '@/models/Comment';
// import { Card, CardContent } from '@/components/ui/card';
// import { Skeleton } from '@/components/ui/skeleton';
// import Toast from '@/components/Toast';

// interface CommentFormData {
//   name: string;
//   email: string;
//   content: string;
// }

// const INITIAL_COMMENT_FORM: CommentFormData = {
//   name: '',
//   email: '',
//   content: '',
// };

// // Category name mapping to avoid category API calls
// const CATEGORY_MAPPING: Record<string, string> = {
//   'industry-trends': 'Industry Trends',
//   'case-studies': 'Case Studies',
//   recruitment: 'Recruitment',
//   leadership: 'Leadership',
// };

// const BlogPost = () => {
//   const params = useParams();
//   const router = useRouter();
//   const id = params.id as string;

//   const [blog, setBlog] = useState<IBlog | null>(null);
//   const [loadingBlog, setLoadingBlog] = useState(true);
//   const [loadingComments, setLoadingComments] = useState(false);
//   const [loadingRelated, setLoadingRelated] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [relatedBlogs, setRelatedBlogs] = useState<IBlog[]>([]);
//   const [comments, setComments] = useState<IComment[]>([]);
//   const [commentForm, setCommentForm] =
//     useState<CommentFormData>(INITIAL_COMMENT_FORM);
//   const [submittingComment, setSubmittingComment] = useState(false);
//   const [toast, setToast] = useState<{
//     message: string;
//     type: 'success' | 'error' | 'warning';
//     isVisible: boolean;
//   } | null>(null);

//   // Fetch blog post
//   useEffect(() => {
//     const fetchBlogPost = async () => {
//       try {
//         setLoadingBlog(true);
//         const response = await fetch(`/api/admin/blogs/${id}`);
//         if (!response.ok) throw new Error('Failed to fetch blog post');

//         const data = await response.json();
//         if (data.success) {
//           setBlog(data.blog);

//           // Increment view count (don't wait for this)
//           fetch(`/api/blogs/view/${id}`, { method: 'POST' }).catch((err) => {
//             console.error('Failed to update view count:', err);
//           });

//           // After blog is loaded, fetch related data
//           if (data.blog) {
//             fetchComments(id);
//             fetchRelatedBlogs(data.blog.category, data.blog._id);
//           }
//         } else {
//           throw new Error(data.message);
//         }
//       } catch (error) {
//         setError(
//           error instanceof Error ? error.message : 'Failed to load blog post'
//         );
//         console.error(error);
//       } finally {
//         setLoadingBlog(false);
//       }
//     };

//     if (id) {
//       fetchBlogPost();
//     }
//   }, [id]);

//   const fetchComments = async (blogId: string) => {
//     try {
//       setLoadingComments(true);
//       const response = await fetch(`/api/blogs/comments/${blogId}`);
//       if (!response.ok) throw new Error('Failed to fetch comments');

//       const data = await response.json();
//       if (data.success) {
//         setComments(data.comments);
//       }
//     } catch (error) {
//       console.error('Error fetching comments:', error);
//     } finally {
//       setLoadingComments(false);
//     }
//   };

//   const fetchRelatedBlogs = async (category: string, currentBlogId: string) => {
//     try {
//       setLoadingRelated(true);
//       const response = await fetch(`/api/blogs/${category}`);
//       if (!response.ok) throw new Error('Failed to fetch related blogs');

//       const data = await response.json();
//       if (data.success) {
//         // Filter out current blog and limit to 3 related blogs
//         const filtered = data.blogs
//           .filter((blog: IBlog) => blog._id !== currentBlogId)
//           .slice(0, 3);
//         setRelatedBlogs(filtered);
//       }
//     } catch (error) {
//       console.error('Error fetching related blogs:', error);
//     } finally {
//       setLoadingRelated(false);
//     }
//   };

//   const handleCommentSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (submittingComment) return;

//     try {
//       setSubmittingComment(true);

//       const response = await fetch('/api/blogs/comments', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           blogId: id,
//           ...commentForm,
//         }),
//       });

//       if (!response.ok) throw new Error('Failed to submit comment');

//       const data = await response.json();
//       if (data.success) {
//         setToast({
//           message: 'Your comment has been posted successfully!',
//           type: 'success',
//           isVisible: true,
//         });
//         setCommentForm(INITIAL_COMMENT_FORM);
//         // Refresh comments
//         fetchComments(id);
//       } else {
//         throw new Error(data.message);
//       }
//     } catch (error) {
//       setToast({
//         message:
//           error instanceof Error ? error.message : 'Failed to post comment',
//         type: 'error',
//         isVisible: true,
//       });
//     } finally {
//       setSubmittingComment(false);
//     }
//   };

//   // Get category display name using the mapping to avoid API calls
//   const getCategoryName = (category: string) => {
//     return CATEGORY_MAPPING[category] || category;
//   };

//   // Function to render blog content skeletons
//   const renderBlogContentSkeleton = () => {
//     return (
//       <>
//         {/* Hero Section Skeleton */}
//         <div className="container mx-auto px-4 mb-12">
//           <div className="max-w-4xl mx-auto">
//             <div className="flex items-center gap-3 mb-4">
//               <Skeleton className="h-6 w-28 rounded-full" />
//               <Skeleton className="h-5 w-20" />
//               <Skeleton className="h-5 w-24" />
//             </div>
//             <Skeleton className="h-14 w-full mb-4" />
//             <Skeleton className="h-14 w-3/4 mb-6" />
//             <div className="flex items-center justify-between border-b border-gray-200 pb-6 mb-8">
//               <div className="flex items-center">
//                 <Skeleton className="h-10 w-10 rounded-full mr-3" />
//                 <Skeleton className="h-6 w-32" />
//               </div>
//               <Skeleton className="h-5 w-32" />
//             </div>
//           </div>
//         </div>

//         {/* Image Skeleton */}
//         <div className="container mx-auto px-4 mb-12">
//           <div className="max-w-4xl mx-auto">
//             <Skeleton className="w-full h-[400px] rounded-lg" />
//           </div>
//         </div>

//         {/* Content Skeleton */}
//         <div className="container mx-auto px-4 mb-20">
//           <div className="max-w-4xl mx-auto space-y-4">
//             <Skeleton className="h-8 w-full" />
//             <Skeleton className="h-8 w-full" />
//             <Skeleton className="h-8 w-3/4" />
//             <Skeleton className="h-8 w-full" />
//             <Skeleton className="h-8 w-5/6" />
//             <Skeleton className="h-8 w-full" />
//           </div>
//         </div>
//       </>
//     );
//   };

//   // Function to render comment skeletons
//   const renderCommentsSkeleton = () => {
//     return (
//       <div className="space-y-6">
//         {Array(2)
//           .fill(0)
//           .map((_, idx) => (
//             <div key={idx} className="bg-gray-50 p-6 rounded-lg">
//               <div className="flex justify-between items-start mb-3">
//                 <div className="flex items-center">
//                   <Skeleton className="h-10 w-10 rounded-full mr-3" />
//                   <div>
//                     <Skeleton className="h-5 w-32 mb-1" />
//                     <Skeleton className="h-4 w-40" />
//                   </div>
//                 </div>
//               </div>
//               <Skeleton className="h-16 w-full" />
//             </div>
//           ))}
//       </div>
//     );
//   };

//   // Function to render related blogs skeleton
//   const renderRelatedBlogsSkeleton = () => {
//     return (
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         {Array(3)
//           .fill(0)
//           .map((_, idx) => (
//             <div
//               key={idx}
//               className="bg-white rounded-lg shadow-md overflow-hidden"
//             >
//               <Skeleton className="h-48 w-full" />
//               <div className="p-5">
//                 <Skeleton className="h-6 w-3/4 mb-2" />
//                 <Skeleton className="h-4 w-full mb-4" />
//                 <Skeleton className="h-10 w-full" />
//               </div>
//             </div>
//           ))}
//       </div>
//     );
//   };

//   if (error) {
//     return (
//       <div className="min-h-screen pattern-bg flex flex-col items-center justify-center py-20">
//         <div className="text-center">
//           <h1 className="text-2xl font-bold mb-4 text-red-500">
//             {error || 'Blog post not found'}
//           </h1>
//           <Button onClick={() => router.push('/media')}>
//             <FiArrowLeft className="mr-2" size={16} />
//             Back to Media
//           </Button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen pattern-bg">
//       {/* Background elements - Always visible */}
//       <div className="fixed top-0 right-0 w-1/3 h-screen bg-gradient-to-b from-contact-purple/5 to-contact-teal/5 -z-10"></div>
//       <div className="fixed top-20 left-10 w-64 h-64 bg-contact-purple/10 rounded-full filter blur-3xl animate-float -z-10"></div>
//       <div
//         className="fixed bottom-20 right-10 w-64 h-64 bg-contact-teal/10 rounded-full filter blur-3xl animate-float -z-10"
//         style={{ animationDelay: '2s' }}
//       ></div>

//       {/* Back button - Always visible */}
//       <div className="container mx-auto px-4 pt-20 pb-8">
//         <Button
//           variant="ghost"
//           className="mb-6 hover:bg-gray-100"
//           onClick={() => router.push('/media')}
//         >
//           <FiArrowLeft className="mr-2" size={16} />
//           Back to Media
//         </Button>
//       </div>

//       {/* Blog Content Section */}
//       {loadingBlog ? (
//         renderBlogContentSkeleton()
//       ) : blog ? (
//         <>
//           {/* Hero Section */}
//           <div className="container mx-auto px-4 mb-12">
//             <div className="max-w-4xl mx-auto">
//               <div className="flex items-center gap-3 mb-4">
//                 <span className="bg-contact-purple/10 text-contact-purple px-3 py-1 rounded-full text-sm font-medium">
//                   {getCategoryName(blog.category)}
//                 </span>
//                 <div className="flex items-center text-sm text-gray-500">
//                   <FiEye size={14} className="mr-1" />
//                   {blog.views} views
//                 </div>
//                 <div className="flex items-center text-sm text-gray-500">
//                   <FiBookOpen size={14} className="mr-1" />
//                   {blog.readTime}
//                 </div>
//               </div>

//               <h1 className="text-3xl md:text-5xl font-semibold mb-6 leading-tight">
//                 {blog.title}
//               </h1>

//               <div className="flex items-center justify-between border-b border-gray-200 pb-6 mb-8">
//                 <div className="flex items-center">
//                   <div className="bg-gray-200 rounded-full w-10 h-10 flex items-center justify-center mr-3">
//                     <FiUser size={18} />
//                   </div>
//                   <div>
//                     <p className="font-medium">{blog.author}</p>
//                   </div>
//                 </div>
//                 <div className="flex items-center text-gray-500 text-sm">
//                   <FiCalendar size={14} className="mr-2" />
//                   {new Date(blog.createdAt).toLocaleDateString()}
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Featured Image */}
//           <div className="container mx-auto px-4 mb-12">
//             <div className="max-w-4xl mx-auto">
//               {blog.image ? (
//                 <div className="rounded-lg overflow-hidden aspect-[16/9] mb-8 relative w-full h-[400px]">
//                   <Image
//                     src={blog.image}
//                     alt={blog.title}
//                     fill
//                     sizes="(max-width: 768px) 100vw, (max-width: 1200px) 800px, 1200px"
//                     className="object-cover"
//                   />
//                 </div>
//               ) : (
//                 <div className="rounded-lg overflow-hidden aspect-[16/9] mb-8 relative w-full h-[400px] bg-gradient-to-r from-contact-purple/30 to-contact-teal/30 flex items-center justify-center">
//                   <FiBookOpen size={64} className="text-white/70" />
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Article Content */}
//           <div className="container mx-auto px-4 mb-20">
//             <article className="max-w-4xl mx-auto prose prose-lg prose-gray lg:prose-xl prose-headings:font-semibold prose-headings:my-6 prose-p:my-4 prose-ul:my-4 prose-li:my-1 prose-li:ml-1">
//               <div
//                 dangerouslySetInnerHTML={{ __html: blog.content }}
//                 className="blog-content"
//               />
//             </article>
//           </div>
//         </>
//       ) : null}

//       {/* Comments Section */}
//       <div className="bg-white/90 backdrop-blur-sm py-16">
//         <div className="container mx-auto px-4">
//           <div className="max-w-4xl mx-auto">
//             <h2 className="text-3xl font-semibold mb-8 flex items-center">
//               <FiMessageSquare className="mr-3 text-contact-purple" />
//               Comments
//               {!loadingComments && comments.length > 0 && (
//                 <span className="ml-2 text-lg text-gray-500">
//                   ({comments.length})
//                 </span>
//               )}
//             </h2>

//             {/* Comment Form - Always show regardless of loading state */}
//             <Card className="mb-12 border-0 shadow-md">
//               <CardContent className="p-6">
//                 <h3 className="text-xl font-medium mb-4">Leave a Comment</h3>
//                 <form onSubmit={handleCommentSubmit} className="space-y-4">
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div>
//                       <label
//                         htmlFor="name"
//                         className="block text-sm text-gray-600 mb-2"
//                       >
//                         Name *
//                       </label>
//                       <input
//                         id="name"
//                         type="text"
//                         required
//                         className="w-full px-3 py-2 bg-white text-gray-800 border border-gray-200 hover:border-contact-purple/30 focus:border-contact-purple/50 rounded-md transition-colors focus:outline-none"
//                         value={commentForm.name}
//                         onChange={(e) =>
//                           setCommentForm({
//                             ...commentForm,
//                             name: e.target.value,
//                           })
//                         }
//                         placeholder="Your name"
//                         disabled={loadingBlog}
//                       />
//                     </div>
//                     <div>
//                       <label
//                         htmlFor="email"
//                         className="block text-sm text-gray-600 mb-2"
//                       >
//                         Email (will not be published)
//                       </label>
//                       <input
//                         id="email"
//                         type="email"
//                         className="w-full px-3 py-2 bg-white text-gray-800 border border-gray-200 hover:border-contact-purple/30 focus:border-contact-purple/50 rounded-md transition-colors focus:outline-none"
//                         value={commentForm.email}
//                         onChange={(e) =>
//                           setCommentForm({
//                             ...commentForm,
//                             email: e.target.value,
//                           })
//                         }
//                         placeholder="Your email"
//                         disabled={loadingBlog}
//                       />
//                     </div>
//                   </div>
//                   <div>
//                     <label
//                       htmlFor="comment"
//                       className="block text-sm text-gray-600 mb-2"
//                     >
//                       Comment *
//                     </label>
//                     <textarea
//                       id="comment"
//                       required
//                       className="w-full px-3 py-2 bg-white text-gray-800 border border-gray-200 hover:border-contact-purple/30 focus:border-contact-purple/50 rounded-md transition-colors focus:outline-none min-h-[120px]"
//                       value={commentForm.content}
//                       onChange={(e) =>
//                         setCommentForm({
//                           ...commentForm,
//                           content: e.target.value,
//                         })
//                       }
//                       placeholder="Your comment"
//                       disabled={loadingBlog}
//                     ></textarea>
//                   </div>
//                   <div className="flex justify-end">
//                     <Button
//                       type="submit"
//                       disabled={submittingComment || loadingBlog}
//                       className="bg-gradient-to-r from-contact-purple to-contact-teal hover:from-contact-purple/90 hover:to-contact-teal/90 text-white rounded-full py-2 px-6 transition-all duration-300 flex items-center"
//                     >
//                       {submittingComment ? 'Submitting...' : 'Post Comment'}
//                       <FiSend className="ml-2" />
//                     </Button>
//                   </div>
//                 </form>
//               </CardContent>
//             </Card>

//             {/* Comment List */}
//             <div className="space-y-6">
//               {loadingComments ? (
//                 renderCommentsSkeleton()
//               ) : comments.length === 0 ? (
//                 <div className="text-center py-8 bg-gray-50 rounded-lg">
//                   <FiMessageSquare
//                     size={36}
//                     className="mx-auto mb-4 text-gray-300"
//                   />
//                   <p className="text-gray-500">
//                     Be the first to share your thoughts!
//                   </p>
//                 </div>
//               ) : (
//                 comments.map((comment) => (
//                   <div key={comment._id} className="bg-gray-50 p-6 rounded-lg">
//                     <div className="flex justify-between items-start mb-3">
//                       <div className="flex items-center">
//                         <div className="bg-contact-purple/20 rounded-full w-10 h-10 flex items-center justify-center mr-3">
//                           <FiUser size={18} className="text-contact-purple" />
//                         </div>
//                         <div>
//                           <p className="font-medium">{comment.name}</p>
//                           <p className="text-xs text-gray-500">
//                             {new Date(comment.createdAt).toLocaleDateString()}{' '}
//                             at{' '}
//                             {new Date(comment.createdAt).toLocaleTimeString(
//                               [],
//                               {
//                                 hour: '2-digit',
//                                 minute: '2-digit',
//                               }
//                             )}
//                           </p>
//                         </div>
//                       </div>
//                     </div>
//                     <p className="text-gray-700">{comment.content}</p>
//                   </div>
//                 ))
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Related Articles Section */}
//       {/* Only show if we have blog data and either while loading related blogs or when there are related blogs */}
//       {blog && (loadingRelated || relatedBlogs.length > 0) && (
//         <div className="bg-white/90 backdrop-blur-sm py-16">
//           <div className="container mx-auto px-4">
//             <div className="max-w-5xl mx-auto">
//               <h2 className="text-3xl font-semibold mb-8 text-center">
//                 Related Articles
//               </h2>

//               {loadingRelated ? (
//                 renderRelatedBlogsSkeleton()
//               ) : (
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                   {relatedBlogs.map((post) => (
//                     <div
//                       key={post._id}
//                       className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
//                       onClick={() => router.push(`/media/${post._id}`)}
//                     >
//                       <div className="h-48 overflow-hidden relative">
//                         {post.image ? (
//                           <Image
//                             src={post.image}
//                             alt={post.title}
//                             fill
//                             sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
//                             className="object-cover hover:scale-105 transition-transform duration-500"
//                           />
//                         ) : (
//                           <div className="w-full h-full bg-gradient-to-r from-contact-purple/30 to-contact-teal/30 flex items-center justify-center">
//                             <FiBookOpen size={32} className="text-white/70" />
//                           </div>
//                         )}
//                       </div>
//                       <div className="p-5">
//                         <h3 className="font-medium text-lg mb-2 line-clamp-2">
//                           {post.title}
//                         </h3>
//                         <p className="text-gray-600 text-sm mb-4 line-clamp-2">
//                           {post.excerpt}
//                         </p>
//                         <Button
//                           variant="ghost"
//                           className="w-full justify-between group"
//                         >
//                           Read Article
//                           <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
//                         </Button>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Quote Section - Always show */}
//       <QuoteSection
//         quote="Knowledge is power. By staying informed on industry trends and best practices, you can make more strategic decisions for your organization."
//         bgColor="bg-gradient-to-br from-contact-purple/10 to-contact-teal/10"
//         textColor="text-gray-800"
//         author="Globixs"
//         role="Research & Insights Team"
//       />

//       {/* Toast Notification */}
//       {toast && (
//         <Toast
//           message={toast.message}
//           type={toast.type}
//           isVisible={toast.isVisible}
//           onClose={() => setToast(null)}
//         />
//       )}
//     </div>
//   );
// };

// export default BlogPost;

'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  FiCalendar,
  FiUser,
  FiArrowLeft,
  FiEye,
  FiBookOpen,
  FiMessageSquare,
  FiSend,
  FiArrowRight,
} from 'react-icons/fi';
import { Button } from '@/components/ui/button';
import QuoteSection from '@/components/contact/QuoteSection';
import { IBlog } from '@/types';
import { IComment } from '@/models/Comment';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import Toast from '@/components/Toast';
import useSessionStore from '@/stores/useSessionStore';

interface CommentFormData {
  name: string;
  email: string;
  content: string;
}

const INITIAL_COMMENT_FORM: CommentFormData = {
  name: '',
  email: '',
  content: '',
};

// Category name mapping to avoid category API calls
const CATEGORY_MAPPING: Record<string, string> = {
  'industry-trends': 'Industry Trends',
  'case-studies': 'Case Studies',
  recruitment: 'Recruitment',
  leadership: 'Leadership',
};

const BlogPost = () => {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  // Get session data from store
  const { session } = useSessionStore();

  const [blog, setBlog] = useState<IBlog | null>(null);
  const [loadingBlog, setLoadingBlog] = useState(true);
  const [loadingComments, setLoadingComments] = useState(false);
  const [loadingRelated, setLoadingRelated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [relatedBlogs, setRelatedBlogs] = useState<IBlog[]>([]);
  const [comments, setComments] = useState<IComment[]>([]);
  const [commentForm, setCommentForm] =
    useState<CommentFormData>(INITIAL_COMMENT_FORM);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error' | 'warning';
    isVisible: boolean;
  } | null>(null);

  // Auto-fill form with user data if authenticated
  useEffect(() => {
    if (session?.user) {
      // Initialize the form based on user role
      const formData: CommentFormData = {
        ...INITIAL_COMMENT_FORM,
        email: session.user.email || '',
      };

      // Handle different user roles
      if (session.user.role === 'business' && session.user.companyName) {
        // Business users - use company name
        formData.name = session.user.companyName;
      } else if (
        (session.user.role === 'candidate' ||
          session.user.role === 'employee' ||
          session.user.role === 'admin') &&
        session.user.firstName &&
        session.user.lastName
      ) {
        // Individual users - concatenate first and last name
        formData.name = `${session.user.firstName} ${session.user.lastName}`;
      }

      setCommentForm(formData);
    }
  }, [session]);

  // Fetch blog post
  useEffect(() => {
    const fetchBlogPost = async () => {
      try {
        setLoadingBlog(true);
        const response = await fetch(`/api/admin/blogs/${id}`);
        if (!response.ok) throw new Error('Failed to fetch blog post');

        const data = await response.json();
        if (data.success) {
          setBlog(data.blog);

          // Increment view count (don't wait for this)
          fetch(`/api/blogs/view/${id}`, { method: 'POST' }).catch((err) => {
            console.error('Failed to update view count:', err);
          });
          // After blog is loaded, fetch related data
          if (data.blog) {
            fetchComments(id);
            fetchRelatedBlogs(data.blog.category, data.blog._id);
          }
        } else {
          throw new Error(data.message);
        }
      } catch (error) {
        setError(
          error instanceof Error ? error.message : 'Failed to load blog post'
        );
        console.error(error);
      } finally {
        setLoadingBlog(false);
      }
    };

    if (id) {
      fetchBlogPost();
    }
  }, [id]);

  const fetchComments = async (blogId: string) => {
    try {
      setLoadingComments(true);
      const response = await fetch(`/api/blogs/comments/${blogId}`);
      if (!response.ok) throw new Error('Failed to fetch comments');

      const data = await response.json();
      if (data.success) {
        setComments(data.comments);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoadingComments(false);
    }
  };

  const fetchRelatedBlogs = async (category: string, currentBlogId: string) => {
    try {
      setLoadingRelated(true);
      const response = await fetch(`/api/blogs/${category}`);
      if (!response.ok) throw new Error('Failed to fetch related blogs');

      const data = await response.json();
      if (data.success) {
        // Filter out current blog and limit to 3 related blogs
        const filtered = data.blogs
          .filter((blog: IBlog) => blog._id !== currentBlogId)
          .slice(0, 3);
        setRelatedBlogs(filtered);
      }
    } catch (error) {
      console.error('Error fetching related blogs:', error);
    } finally {
      setLoadingRelated(false);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submittingComment) return;

    try {
      setSubmittingComment(true);

      const response = await fetch('/api/blogs/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          blogId: id,
          ...commentForm,
        }),
      });

      if (!response.ok) throw new Error('Failed to submit comment');

      const data = await response.json();
      if (data.success) {
        setToast({
          message: 'Your comment has been posted successfully!',
          type: 'success',
          isVisible: true,
        });

        // Reset only the content field, keep user's name and email
        setCommentForm((prevForm) => ({
          ...prevForm,
          content: '',
        }));

        // Refresh comments
        fetchComments(id);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      setToast({
        message:
          error instanceof Error ? error.message : 'Failed to post comment',
        type: 'error',
        isVisible: true,
      });
    } finally {
      setSubmittingComment(false);
    }
  };

  // Get category display name using the mapping to avoid API calls
  const getCategoryName = (category: string) => {
    return CATEGORY_MAPPING[category] || category;
  };

  // Function to render blog content skeletons
  const renderBlogContentSkeleton = () => {
    return (
      <>
        {/* Hero Section Skeleton */}
        <div className="container mx-auto px-4 mb-12">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-4">
              <Skeleton className="h-6 w-28 rounded-full" />
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-5 w-24" />
            </div>
            <Skeleton className="h-14 w-full mb-4" />
            <Skeleton className="h-14 w-3/4 mb-6" />
            <div className="flex items-center justify-between border-b border-gray-200 pb-6 mb-8">
              <div className="flex items-center">
                <Skeleton className="h-10 w-10 rounded-full mr-3" />
                <Skeleton className="h-6 w-32" />
              </div>
              <Skeleton className="h-5 w-32" />
            </div>
          </div>
        </div>

        {/* Image Skeleton */}
        <div className="container mx-auto px-4 mb-12">
          <div className="max-w-4xl mx-auto">
            <Skeleton className="w-full h-[400px] rounded-lg" />
          </div>
        </div>

        {/* Content Skeleton */}
        <div className="container mx-auto px-4 mb-20">
          <div className="max-w-4xl mx-auto space-y-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-5/6" />
            <Skeleton className="h-8 w-full" />
          </div>
        </div>
      </>
    );
  };

  // Function to render comment skeletons
  const renderCommentsSkeleton = () => {
    return (
      <div className="space-y-6">
        {Array(2)
          .fill(0)
          .map((_, idx) => (
            <div key={idx} className="bg-gray-50 p-6 rounded-lg">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center">
                  <Skeleton className="h-10 w-10 rounded-full mr-3" />
                  <div>
                    <Skeleton className="h-5 w-32 mb-1" />
                    <Skeleton className="h-4 w-40" />
                  </div>
                </div>
              </div>
              <Skeleton className="h-16 w-full" />
            </div>
          ))}
      </div>
    );
  };

  // Function to render related blogs skeleton
  const renderRelatedBlogsSkeleton = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array(3)
          .fill(0)
          .map((_, idx) => (
            <div
              key={idx}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <Skeleton className="h-48 w-full" />
              <div className="p-5">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-4" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          ))}
      </div>
    );
  };

  if (error) {
    return (
      <div className="min-h-screen pattern-bg flex flex-col items-center justify-center py-20">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-red-500">
            {error || 'Blog post not found'}
          </h1>
          <Button onClick={() => router.push('/media')}>
            <FiArrowLeft className="mr-2" size={16} />
            Back to Media
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pattern-bg">
      {/* Background elements - Always visible */}
      <div className="fixed top-0 right-0 w-1/3 h-screen bg-gradient-to-b from-contact-purple/5 to-contact-teal/5 -z-10"></div>
      <div className="fixed top-20 left-10 w-64 h-64 bg-contact-purple/10 rounded-full filter blur-3xl animate-float -z-10"></div>
      <div
        className="fixed bottom-20 right-10 w-64 h-64 bg-contact-teal/10 rounded-full filter blur-3xl animate-float -z-10"
        style={{ animationDelay: '2s' }}
      ></div>

      {/* Back button - Always visible */}
      <div className="container mx-auto px-4 pt-20 pb-8">
        <Button
          variant="ghost"
          className="mb-6 hover:bg-gray-100"
          onClick={() => router.push('/media')}
        >
          <FiArrowLeft className="mr-2" size={16} />
          Back to Media
        </Button>
      </div>

      {/* Blog Content Section */}
      {loadingBlog ? (
        renderBlogContentSkeleton()
      ) : blog ? (
        <>
          {/* Hero Section */}
          <div className="container mx-auto px-4 mb-12">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-contact-purple/10 text-contact-purple px-3 py-1 rounded-full text-sm font-medium">
                  {getCategoryName(blog.category)}
                </span>
                <div className="flex items-center text-sm text-gray-500">
                  <FiEye size={14} className="mr-1" />
                  {blog.views} views
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <FiBookOpen size={14} className="mr-1" />
                  {blog.readTime}
                </div>
              </div>

              <h1 className="text-3xl md:text-5xl font-semibold mb-6 leading-tight">
                {blog.title}
              </h1>

              <div className="flex items-center justify-between border-b border-gray-200 pb-6 mb-8">
                <div className="flex items-center">
                  <div className="bg-gray-200 rounded-full w-10 h-10 flex items-center justify-center mr-3">
                    <FiUser size={18} />
                  </div>
                  <div>
                    <p className="font-medium">{blog.author}</p>
                  </div>
                </div>
                <div className="flex items-center text-gray-500 text-sm">
                  <FiCalendar size={14} className="mr-2" />
                  {new Date(blog.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>

          {/* Featured Image */}
          <div className="container mx-auto px-4 mb-12">
            <div className="max-w-4xl mx-auto">
              {blog.image ? (
                <div className="rounded-lg overflow-hidden aspect-[16/9] mb-8 relative w-full h-[400px]">
                  <Image
                    src={blog.image}
                    alt={blog.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 800px, 1200px"
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="rounded-lg overflow-hidden aspect-[16/9] mb-8 relative w-full h-[400px] bg-gradient-to-r from-contact-purple/30 to-contact-teal/30 flex items-center justify-center">
                  <FiBookOpen size={64} className="text-white/70" />
                </div>
              )}
            </div>
          </div>

          {/* Article Content */}
          <div className="container mx-auto px-4 mb-20">
            <article className="max-w-4xl mx-auto prose prose-lg prose-gray lg:prose-xl prose-headings:font-semibold prose-headings:my-6 prose-p:my-4 prose-ul:my-4 prose-li:my-1 prose-li:ml-1">
              <div
                dangerouslySetInnerHTML={{ __html: blog.content }}
                className="blog-content"
              />
            </article>
          </div>
        </>
      ) : null}

      {/* Comments Section */}
      <div className="bg-white/90 backdrop-blur-sm py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-semibold mb-8 flex items-center">
              <FiMessageSquare className="mr-3 text-contact-purple" />
              Comments
              {!loadingComments && comments.length > 0 && (
                <span className="ml-2 text-lg text-gray-500">
                  ({comments.length})
                </span>
              )}
            </h2>

            {/* Comment Form - Always show regardless of loading state */}
            <Card className="mb-12 border-0 shadow-md">
              <CardContent className="p-6">
                <h3 className="text-xl font-medium mb-4">Leave a Comment</h3>
                <form onSubmit={handleCommentSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm text-gray-600 mb-2"
                      >
                        Name *
                      </label>
                      <input
                        id="name"
                        type="text"
                        required
                        className="w-full px-3 py-2 bg-white text-gray-800 border border-gray-200 hover:border-contact-purple/30 focus:border-contact-purple/50 rounded-md transition-colors focus:outline-none"
                        value={commentForm.name}
                        onChange={(e) =>
                          setCommentForm({
                            ...commentForm,
                            name: e.target.value,
                          })
                        }
                        placeholder="Your name"
                        disabled={loadingBlog}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm text-gray-600 mb-2"
                      >
                        Email (will not be published)
                      </label>
                      <input
                        id="email"
                        type="email"
                        className="w-full px-3 py-2 bg-white text-gray-800 border border-gray-200 hover:border-contact-purple/30 focus:border-contact-purple/50 rounded-md transition-colors focus:outline-none"
                        value={commentForm.email}
                        onChange={(e) =>
                          setCommentForm({
                            ...commentForm,
                            email: e.target.value,
                          })
                        }
                        placeholder="Your email"
                        disabled={loadingBlog}
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="comment"
                      className="block text-sm text-gray-600 mb-2"
                    >
                      Comment *
                    </label>
                    <textarea
                      id="comment"
                      required
                      className="w-full px-3 py-2 bg-white text-gray-800 border border-gray-200 hover:border-contact-purple/30 focus:border-contact-purple/50 rounded-md transition-colors focus:outline-none min-h-[120px]"
                      value={commentForm.content}
                      onChange={(e) =>
                        setCommentForm({
                          ...commentForm,
                          content: e.target.value,
                        })
                      }
                      placeholder="Your comment"
                      disabled={loadingBlog}
                    ></textarea>
                  </div>
                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      disabled={submittingComment || loadingBlog}
                      className="bg-gradient-to-r from-contact-purple to-contact-teal hover:from-contact-purple/90 hover:to-contact-teal/90 text-white rounded-full py-2 px-6 transition-all duration-300 flex items-center"
                    >
                      {submittingComment ? 'Submitting...' : 'Post Comment'}
                      <FiSend className="ml-2" />
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Comment List */}
            <div className="space-y-6">
              {loadingComments ? (
                renderCommentsSkeleton()
              ) : comments.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <FiMessageSquare
                    size={36}
                    className="mx-auto mb-4 text-gray-300"
                  />
                  <p className="text-gray-500">
                    Be the first to share your thoughts!
                  </p>
                </div>
              ) : (
                comments.map((comment) => (
                  <div key={comment._id} className="bg-gray-50 p-6 rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center">
                        <div className="bg-contact-purple/20 rounded-full w-10 h-10 flex items-center justify-center mr-3">
                          <FiUser size={18} className="text-contact-purple" />
                        </div>
                        <div>
                          <p className="font-medium">{comment.name}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(comment.createdAt).toLocaleDateString()}{' '}
                            at{' '}
                            {new Date(comment.createdAt).toLocaleTimeString(
                              [],
                              {
                                hour: '2-digit',
                                minute: '2-digit',
                              }
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-700">{comment.content}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Related Articles Section */}
      {/* Only show if we have blog data and either while loading related blogs or when there are related blogs */}
      {blog && (loadingRelated || relatedBlogs.length > 0) && (
        <div className="bg-white/90 backdrop-blur-sm py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl font-semibold mb-8 text-center">
                Related Articles
              </h2>

              {loadingRelated ? (
                renderRelatedBlogsSkeleton()
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {relatedBlogs.map((post) => (
                    <div
                      key={post._id}
                      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                      onClick={() => router.push(`/media/${post._id}`)}
                    >
                      <div className="h-48 overflow-hidden relative">
                        {post.image ? (
                          <Image
                            src={post.image}
                            alt={post.title}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
                            className="object-cover hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-r from-contact-purple/30 to-contact-teal/30 flex items-center justify-center">
                            <FiBookOpen size={32} className="text-white/70" />
                          </div>
                        )}
                      </div>
                      <div className="p-5">
                        <h3 className="font-medium text-lg mb-2 line-clamp-2">
                          {post.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {post.excerpt}
                        </p>
                        <Button
                          variant="ghost"
                          className="w-full justify-between group"
                        >
                          Read Article
                          <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Quote Section - Always show */}
      <QuoteSection
        quote="Knowledge is power. By staying informed on industry trends and best practices, you can make more strategic decisions for your organization."
        bgColor="bg-gradient-to-br from-contact-purple/10 to-contact-teal/10"
        textColor="text-gray-800"
        author="Globixs"
        role="Research & Insights Team"
      />

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
};

export default BlogPost;
