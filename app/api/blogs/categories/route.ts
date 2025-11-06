// app/api/blogs/categories/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/utils/db';
import Blog from '@/models/Blog';

export async function GET() {
  try {
    await connectToDatabase();

    // Get all unique categories from blogs
    const uniqueCategories = await Blog.distinct('category');

    return NextResponse.json({
      success: true,
      categories: uniqueCategories,
    });
  } catch (error) {
    console.error('Error fetching unique categories:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}
