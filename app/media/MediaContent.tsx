'use client';

import { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  FiCalendar,
  FiUser,
  FiArrowRight,
  FiEye,
  FiBookOpen,
} from 'react-icons/fi';
import { Button } from '@/components/ui/button';
import QuoteSection from '@/components/contact/QuoteSection';
import { Card, CardContent } from '@/components/ui/card';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { IBlog } from '@/types';
import { BookOpen } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

// Number of blogs to display per page
const BLOGS_PER_PAGE = 4;

// Interface for category data
interface CategoryItem {
  id: string;
  name: string;
  count: number;
}

const MediaContent = () => {
  const router = useRouter();

  const { ref: heroRef, inView: heroInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const { ref: blogsRef, inView: blogsInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [blogs, setBlogs] = useState<IBlog[]>([]);
  const [loadingCategories, setLoadingCategories] = useState<boolean>(true);
  const [loadingBlogs, setLoadingBlogs] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [categoryList, setCategoryList] = useState<CategoryItem[]>([]);

  // Fetch all categories and their blog counts
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        // Fetch all categories from API
        const res = await fetch('/api/blogs/categories');
        if (!res.ok) throw new Error('Failed to fetch categories');

        const data = await res.json();
        if (data.success && data.categories) {
          // Create a temporary map to track category blog counts
          const categoryCountMap: Record<string, number> = {};
          const categoryNameMap: Record<string, string> = {};

          // Format category names for display
          const formattedCategories = data.categories.map((cat: string) => {
            const name = cat
              .split('-')
              .map(
                (word: string) => word.charAt(0).toUpperCase() + word.slice(1)
              )
              .join(' ');

            categoryNameMap[cat] = name;
            categoryCountMap[cat] = 0; // Initialize count to 0
            return cat;
          });

          // Fetch blog counts for each category
          const countPromises = formattedCategories.map(
            async (category: string) => {
              try {
                const categoryRes = await fetch(`/api/blogs/${category}`);
                if (!categoryRes.ok) return;

                const categoryData = await categoryRes.json();
                if (categoryData.success) {
                  categoryCountMap[category] = categoryData.blogs.length;
                }
              } catch (error) {
                console.error(
                  `Error fetching blogs for category ${category}:`,
                  error
                );
              }
            }
          );

          // Wait for all category count fetches to complete
          await Promise.all(countPromises);

          // Filter out categories with no blogs and format for display
          const populatedCategories = formattedCategories
            .filter((cat: string) => categoryCountMap[cat] > 0)
            .map((cat: string) => ({
              id: cat,
              name: categoryNameMap[cat],
              count: categoryCountMap[cat],
            }));

          setCategoryList(populatedCategories);

          // Set initial selected category if there are any with blogs
          if (populatedCategories.length > 0) {
            setSelectedCategory(populatedCategories[0].id);
          }
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  // Fetch blogs for the selected category
  useEffect(() => {
    const fetchBlogs = async () => {
      if (!selectedCategory) return;

      try {
        setLoadingBlogs(true);
        const res = await fetch(`/api/blogs/${selectedCategory}`);
        if (!res.ok) throw new Error('Failed to fetch blogs');

        const data = await res.json();
        if (data.success) {
          setBlogs(data.blogs);

          // Calculate total pages based on blogs per page
          const totalBlogPages = Math.ceil(data.blogs.length / BLOGS_PER_PAGE);
          setTotalPages(totalBlogPages > 0 ? totalBlogPages : 1);
        } else {
          throw new Error(data.message || 'Failed to fetch blogs');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error(err);
      } finally {
        setLoadingBlogs(false);
      }
    };

    if (selectedCategory) {
      fetchBlogs();
    }
  }, [selectedCategory]);

  const handleReadArticle = (blogId: string) => {
    router.push(`/media/${blogId}`);
  };

  // Calculate blog slice for current page
  const indexOfLastBlog = currentPage * BLOGS_PER_PAGE;
  const indexOfFirstBlog = indexOfLastBlog - BLOGS_PER_PAGE;
  const currentBlogs = blogs.slice(indexOfFirstBlog, indexOfLastBlog);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    document
      .getElementById('blogs-section')
      ?.scrollIntoView({ behavior: 'smooth' });
  };

  // Render category skeletons while loading
  const renderCategorySkeletons = () => {
    return Array(4)
      .fill(0)
      .map((_, idx) => (
        <Skeleton key={idx} className="h-10 w-32 rounded-full" />
      ));
  };

  // Render blog card skeletons while loading
  const renderBlogSkeletons = () => {
    return Array(4)
      .fill(0)
      .map((_, idx) => (
        <Card key={idx} className="glass overflow-hidden">
          <Skeleton className="h-48 w-full" />
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-3">
              <Skeleton className="h-6 w-24 rounded-full" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-16" />
            </div>
            <Skeleton className="h-7 w-4/5 mb-3" />
            <Skeleton className="h-5 w-full mb-2" />
            <Skeleton className="h-5 w-3/4 mb-4" />
            <div className="flex justify-between items-center border-t border-gray-100 pt-4 mt-4">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-10 w-full mt-4" />
          </CardContent>
        </Card>
      ));
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="fixed top-0 right-0 w-1/3 h-screen bg-gradient-to-b from-globixs-primary/5 to-globixs-secondary/5 -z-10"></div>
      <div className="fixed top-20 left-10 w-64 h-64 bg-globixs-primary/10 rounded-full filter blur-3xl animate-float -z-10"></div>
      <div
        className="fixed bottom-20 right-10 w-64 h-64 bg-globixs-secondary/10 rounded-full filter blur-3xl animate-float -z-10"
        style={{ animationDelay: '2s' }}
      ></div>

      {/* Hero Section - Always show immediately */}
      <div className="relative overflow-hidden pt-20">
        <div className="container mx-auto px-4 py-12 sm:py-16 md:py-24 relative z-10">
          <div
            ref={heroRef}
            className={`max-w-5xl mx-auto text-center transition-all duration-1000 ${
              heroInView
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-12'
            }`}
          >
            <div className="inline-block mb-8">
              <div className="relative inline-flex items-center justify-center">
                <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-globixs-primary to-globixs-secondary opacity-70 blur"></div>
                <div className="relative px-6 py-2 bg-white rounded-full text-sm font-normal text-gray-800">
                  Thought Leadership & Expertise
                </div>
              </div>
            </div>

            <h1 className="text-5xl md:text-7xl font-normal mb-6 gradient-text leading-tight">
              Insights, Ideas & Innovations
            </h1>
            <p className="text-xl text-gray-700 mb-12 max-w-7xl mx-auto">
              At Globixs, we&apos;re passionate about sharing insights, ideas,
              and innovations that drive the future of technology. Our Media and
              Blogs section brings you thought leadership, industry trends,
              success stories, and expert perspectives from across the tech
              landscape. Whether you&apos;re looking for practical advice,
              strategic insights, or a fresh take on emerging technologies,
              you&apos;ll find it here. Explore our latest updates and see how
              we&apos;re helping businesses stay ahead in a rapidly evolving
              world.
            </p>
          </div>
        </div>
      </div>

      {/* Category Section - Show skeletons while loading */}
      <div className="py-8 bg-globixs-bgAccent backdrop-blur-sm">
        <div className="container mx-auto px-4">
          {error ? (
            <div className="text-center p-4">
              <div className="text-red-500 mb-4">{error}</div>
              <Button onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          ) : (
            <div className="flex flex-wrap gap-4 justify-center mb-8">
              {loadingCategories ? (
                renderCategorySkeletons()
              ) : categoryList.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-gray-500">No categories available</p>
                </div>
              ) : (
                categoryList.map((category) => (
                  <Button
                    key={category.id}
                    variant={
                      selectedCategory === category.id ? 'default' : 'outline'
                    }
                    onClick={() => {
                      setSelectedCategory(category.id);
                      setCurrentPage(1);
                    }}
                    className="rounded-full"
                  >
                    {category.name} ({category.count})
                  </Button>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Blog Section - Show skeletons while loading */}
      <div
        id="blogs-section"
        className="py-16 bg-globixs-bgAccent backdrop-blur-sm"
      >
        <div className="container mx-auto px-4">
          <div
            ref={blogsRef}
            className={`max-w-6xl mx-auto transition-all duration-1000 ${
              blogsInView
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-12'
            }`}
          >
            {loadingBlogs ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {renderBlogSkeletons()}
              </div>
            ) : error && !loadingCategories ? (
              <div className="text-center py-16">
                <div className="text-red-500 mb-4">Error: {error}</div>
                <Button onClick={() => window.location.reload()}>
                  Try Again
                </Button>
              </div>
            ) : categoryList.length === 0 && !loadingCategories ? (
              <div className="text-center py-16">
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                  Coming Soon!
                </h2>
                <p className="text-gray-600 mb-8">
                  We&apos;re currently preparing insightful articles on
                  technology trends, digital transformation strategies, and IT
                  talent solutions. Check back soon for valuable resources and
                  expert perspectives.
                </p>
              </div>
            ) : currentBlogs.length === 0 && !loadingBlogs ? (
              <div className="text-center py-16">
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                  No Articles in This Category
                </h2>
                <p className="text-gray-600 mb-8">
                  We&apos;re working on adding more content to this category.
                  Please check other categories or visit again later for
                  updates.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {currentBlogs.map((blog) => (
                  <Card
                    key={blog._id}
                    className="glass overflow-hidden hover:shadow-lg transition-all duration-300 border-0 cursor-pointer"
                    onClick={() => handleReadArticle(blog._id as string)}
                  >
                    <div className="h-48 overflow-hidden relative">
                      {blog.image ? (
                        <div className="relative h-48 w-full">
                          <Image
                            src={blog.image}
                            alt={blog.title}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                            className="object-cover hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      ) : (
                        <div className="w-full h-full bg-gradient-to-r from-globixs-primary/30 to-globixs-secondary/30 flex items-center justify-center">
                          <BookOpen className="h-12 w-12 text-white/70" />
                        </div>
                      )}
                      {blog.featured && (
                        <div className="absolute top-4 left-4">
                          <span className="bg-globixs-primary text-white px-3 py-1 rounded-full text-xs font-medium">
                            Featured
                          </span>
                        </div>
                      )}
                    </div>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4 mb-3">
                        <span className="text-xs font-medium text-globixs-primary px-3 py-1 bg-globixs-primary/10 rounded-full">
                          {categoryList.find((cat) => cat.id === blog.category)
                            ?.name || blog.category}
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
                      <h3 className="text-xl font-medium mb-3">{blog.title}</h3>
                      <p className="text-gray-600 mb-4">{blog.excerpt}</p>
                      <div className="flex justify-between items-center border-t border-gray-100 pt-4 mt-4">
                        <div className="flex items-center text-sm text-gray-500">
                          <FiUser size={14} className="mr-1" />
                          {blog.author}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <FiCalendar size={14} className="mr-1" />
                          {new Date(blog.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        className="w-full mt-4 justify-between group"
                      >
                        Read Full Article
                        <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Pagination */}
            {!loadingBlogs && totalPages > 1 && (
              <div className="mt-12">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage > 1)
                            handlePageChange(currentPage - 1);
                        }}
                        className={
                          currentPage === 1
                            ? 'pointer-events-none opacity-50'
                            : ''
                        }
                      />
                    </PaginationItem>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <PaginationItem key={page}>
                          <PaginationLink
                            href="#"
                            isActive={page === currentPage}
                            onClick={(e) => {
                              e.preventDefault();
                              handlePageChange(page);
                            }}
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      )
                    )}

                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage < totalPages)
                            handlePageChange(currentPage + 1);
                        }}
                        className={
                          currentPage === totalPages
                            ? 'pointer-events-none opacity-50'
                            : ''
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quote Section - Always show */}
      <QuoteSection
        quote="Stay informed with the latest industry insights and technological advancements to make confident decisions for your organization's growth and digital transformation journey."
        bgColor="bg-slate-50"
        textColor="text-gray-800"
        author="Globixs"
        role="Technology & Innovation Team"
      />
    </div>
  );
};

export default MediaContent;
