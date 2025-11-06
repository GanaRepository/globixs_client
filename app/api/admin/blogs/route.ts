// app/api/admin/blogs/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/utils/db';
import { uploadFile } from '@/utils/gridfs';
import Blog from '@/models/Blog';

export async function GET() {
  try {
    await connectToDatabase();
    const blogs = await Blog.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, blogs });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch blogs' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const formData = await req.formData();

    // Get blog data from form
    const title = formData.get('title') as string;
    const excerpt = formData.get('excerpt') as string;
    const content = formData.get('content') as string;
    const author = formData.get('author') as string;
    const category = formData.get('category') as string;
    const featured = formData.get('featured') === 'true';

    // Validate required fields
    if (!title || !excerpt || !content || !author || !category) {
      return NextResponse.json(
        { success: false, message: 'All fields are required' },
        { status: 400 }
      );
    }

    // Handle image upload if provided
    const blogImage = formData.get('blogImage') as File;
    let imageUrl = '';

    if (blogImage) {
      const buffer = Buffer.from(await blogImage.arrayBuffer());
      const fileId = await uploadFile(buffer, blogImage.name, blogImage.type);
      // Use the public endpoint instead of admin endpoint
      imageUrl = `/api/files?fileId=${fileId}`;
    }

    // Current date for createdAt and readTime estimation (1 min per 200 words)
    const createdAt = new Date();
    const wordCount = content.split(/\s+/).length;
    const readTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));
    const readTime = `${readTimeMinutes} min read`;

    // Create blog post
    const blog = await Blog.create({
      title,
      excerpt,
      content,
      author,
      category,
      featured,
      image: imageUrl,
      createdAt,
      readTime,
      views: '0',
    });

    return NextResponse.json({
      success: true,
      blog,
      message: 'Blog post published successfully',
    });
  } catch (error) {
    console.error('Error creating blog:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to publish blog post' },
      { status: 500 }
    );
  }
}
