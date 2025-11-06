// app/api/admin/comments/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/utils/db';
import Comment from '@/models/Comment';
import Blog from '@/models/Blog';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    // Get pagination parameters from the request
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');

    // Calculate skip for pagination
    const skip = (page - 1) * limit;

    // Get total count of comments
    const totalComments = await Comment.countDocuments();

    // Fetch paginated comments with most recent first
    const comments = await Comment.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Fetch associated blog titles for each comment
    const commentsWithBlogDetails = await Promise.all(
      comments.map(async (comment) => {
        const blog = await Blog.findById(comment.blogId, 'title');
        return {
          ...comment.toObject(),
          blogTitle: blog ? blog.title : 'Unknown Blog',
        };
      })
    );

    return NextResponse.json({
      success: true,
      comments: commentsWithBlogDetails,
      pagination: {
        total: totalComments,
        page,
        limit,
        pages: Math.ceil(totalComments / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching all comments:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch comments' },
      { status: 500 }
    );
  }
}

// Add DELETE method to support comment deletion
export async function DELETE(req: NextRequest) {
  try {
    await connectToDatabase();

    const { commentId } = await req.json();

    if (!commentId) {
      return NextResponse.json(
        { success: false, message: 'Comment ID is required' },
        { status: 400 }
      );
    }

    const result = await Comment.findByIdAndDelete(commentId);

    if (!result) {
      return NextResponse.json(
        { success: false, message: 'Comment not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Comment deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting comment:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete comment' },
      { status: 500 }
    );
  }
}
