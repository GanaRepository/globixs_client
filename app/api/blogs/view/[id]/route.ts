// app/api/blogs/view/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/utils/db';
import Blog from '@/models/Blog';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();

    const id = params.id;
    const blog = await Blog.findById(id);

    if (!blog) {
      return NextResponse.json(
        { success: false, message: 'Blog not found' },
        { status: 404 }
      );
    }

    // Increment view count
    const currentViews = parseInt(blog.views) || 0;
    blog.views = (currentViews + 1).toString();
    await blog.save();

    return NextResponse.json({
      success: true,
      message: 'View count updated',
    });
  } catch (error) {
    console.error('Error updating view count:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update view count' },
      { status: 500 }
    );
  }
}
