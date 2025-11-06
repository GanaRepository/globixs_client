// app/api/blogs/comments/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/utils/db';
import Comment from '@/models/Comment';

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const commentData = await req.json();

    // Validate required fields
    if (!commentData.blogId || !commentData.name || !commentData.content) {
      return NextResponse.json(
        { success: false, message: 'All fields are required' },
        { status: 400 }
      );
    }

    // Create comment
    const comment = await Comment.create({
      blogId: commentData.blogId,
      name: commentData.name,
      email: commentData.email || '',
      content: commentData.content,
      createdAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      comment,
      message: 'Comment added successfully',
    });
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to add comment' },
      { status: 500 }
    );
  }
}
