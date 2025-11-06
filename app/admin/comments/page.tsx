// app/admin/comments/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
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
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  FileText,
  Trash2,
  MessageSquare,
  ExternalLink,
  BookOpen,
} from 'lucide-react';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import Toast from '@/components/Toast';

interface Comment {
  _id: string;
  blogId: string;
  blogTitle: string;
  name: string;
  email: string;
  content: string;
  createdAt: string;
}

interface PaginationData {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export default function CommentsPage() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    page: 1,
    limit: 10,
    pages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [commentToDelete, setCommentToDelete] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error' | 'warning';
    isVisible: boolean;
  } | null>(null);

  // Fetch comments with pagination
  const fetchComments = async (page = 1, limit = 10) => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/admin/comments?page=${page}&limit=${limit}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch comments');
      }

      const data = await response.json();

      if (data.success) {
        setComments(data.comments);
        setPagination(data.pagination);
      } else {
        throw new Error(data.message || 'Failed to fetch comments');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchComments();
  }, []);

  // Handle page change
  const handlePageChange = (newPage: number) => {
    fetchComments(newPage, pagination.limit);
  };

  // Handle comment deletion
  const deleteComment = async () => {
    if (!commentToDelete) return;

    try {
      const response = await fetch('/api/admin/comments', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ commentId: commentToDelete }),
      });

      const data = await response.json();

      if (data.success) {
        setToast({
          message: 'Comment deleted successfully',
          type: 'success',
          isVisible: true,
        });

        // Refresh comments list
        fetchComments(pagination.page, pagination.limit);
      } else {
        throw new Error(data.message || 'Failed to delete comment');
      }
    } catch (error) {
      setToast({
        message:
          error instanceof Error ? error.message : 'Failed to delete comment',
        type: 'error',
        isVisible: true,
      });
    } finally {
      setCommentToDelete(null);
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };

  return (
    <div className="space-y-6 p-12">
      <div className="inline-flex items-center gap-2 bg-[#7E69AB]/10 rounded-full px-4 py-1.5 mb-4 border border-[#7E69AB]/20">
        <BookOpen className="w-4 h-4 text-[#7E69AB]" />
        <span className="text-[#7E69AB] text-sm uppercase tracking-wider font-medium">
          Admin can See the comments posted by users
        </span>
      </div>
      <Card>
        <CardHeader className="p-4 m-8">
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-bold flex items-center">
              <MessageSquare className="mr-2 h-6 w-6 text-contact-purple" />
              Blog Comments
            </CardTitle>
            <div className="text-sm text-gray-500">
              Total: {pagination.total} comments
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="text-center py-8">
              <div className="text-red-500 mb-4">{error}</div>
              <Button onClick={() => fetchComments()}>Try Again</Button>
            </div>
          ) : loading ? (
            // Loading state with skeletons
            <div className="space-y-3">
              {Array(5)
                .fill(0)
                .map((_, idx) => (
                  <div key={idx} className="flex items-center space-x-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[250px]" />
                      <Skeleton className="h-4 w-[200px]" />
                    </div>
                  </div>
                ))}
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="mx-auto h-12 w-12 text-gray-300 mb-3" />
              <p className="text-gray-500">No comments found</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Comment</TableHead>
                    <TableHead>Blog Post</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {comments.map((comment) => (
                    <TableRow key={comment._id}>
                      <TableCell className="font-medium">
                        <div>
                          {comment.name}
                          {comment.email && (
                            <div className="text-xs text-gray-500">
                              {comment.email}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap max-w-xs">
                          {comment.content}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Link
                          href={`/media/${comment.blogId}`}
                          className="flex items-center text-contact-purple hover:underline"
                          target="_blank"
                        >
                          <FileText className="h-4 w-4 mr-1" />
                          {comment.blogTitle}
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </Link>
                      </TableCell>
                      <TableCell>{formatDate(comment.createdAt)}</TableCell>
                      <TableCell className="text-right">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                              onClick={() => setCommentToDelete(comment._id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Delete Comment
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this comment?
                                This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel
                                onClick={() => setCommentToDelete(null)}
                              >
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={deleteComment}
                                className="bg-red-500 hover:bg-red-600"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Pagination */}
          {!loading && pagination.pages > 1 && (
            <div className="flex justify-center mt-6">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (pagination.page > 1) {
                          handlePageChange(pagination.page - 1);
                        }
                      }}
                      className={
                        pagination.page <= 1
                          ? 'pointer-events-none opacity-50'
                          : ''
                      }
                    />
                  </PaginationItem>

                  {Array.from({ length: pagination.pages }, (_, i) => i + 1)
                    .filter(
                      (page) =>
                        page === 1 ||
                        page === pagination.pages ||
                        Math.abs(page - pagination.page) <= 1
                    )
                    .map((page, index, array) => (
                      <React.Fragment key={page}>
                        {index > 0 && array[index - 1] !== page - 1 && (
                          <PaginationItem>
                            <span className="px-3">...</span>
                          </PaginationItem>
                        )}
                        <PaginationItem>
                          <PaginationLink
                            href="#"
                            isActive={page === pagination.page}
                            onClick={(e) => {
                              e.preventDefault();
                              handlePageChange(page);
                            }}
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      </React.Fragment>
                    ))}

                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (pagination.page < pagination.pages) {
                          handlePageChange(pagination.page + 1);
                        }
                      }}
                      className={
                        pagination.page >= pagination.pages
                          ? 'pointer-events-none opacity-50'
                          : ''
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>

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
