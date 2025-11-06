// app/api/blogs/comments/[blogId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/utils/db';
import Comment from '@/models/Comment';

export async function GET(
  req: NextRequest,
  { params }: { params: { blogId: string } }
) {
  try {
    await connectToDatabase();

    const blogId = params.blogId;
    const comments = await Comment.find({ blogId }).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, comments });
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch comments' },
      { status: 500 }
    );
  }
}
