// app/api/blogs/[category]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/utils/db';
import Blog from '@/models/Blog';

export async function GET(
  req: NextRequest,
  { params }: { params: { category: string } }
) {
  try {
    await connectToDatabase();

    const category = params.category;

    // Support dynamic categories by allowing any category string
    const filter = category ? { category } : {};

    const blogs = await Blog.find(filter).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, blogs });
  } catch (error) {
    console.error('Error fetching blogs by category:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch blogs' },
      { status: 500 }
    );
  }
}
