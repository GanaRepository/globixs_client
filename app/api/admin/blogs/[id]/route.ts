// app/api/admin/blogs/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/utils/db';
import { uploadFile, deleteFile } from '@/utils/gridfs';
import Blog from '@/models/Blog';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    const blog = await Blog.findById(params.id);

    if (!blog) {
      return NextResponse.json(
        { success: false, message: 'Blog not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, blog });
  } catch (error) {
    console.error('Error fetching blog:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch blog' },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    const id = params.id;

    // Find the blog first to check if it exists
    const existingBlog = await Blog.findById(id);
    if (!existingBlog) {
      return NextResponse.json(
        { success: false, message: 'Blog not found' },
        { status: 404 }
      );
    }

    const formData = await req.formData();

    // Get updated data
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

    // Prepare update object
    const updateData: any = {
      title,
      excerpt,
      content,
      author,
      category,
      featured,
      updatedAt: new Date(),
    };

    // If content changed, update read time
    if (content !== existingBlog.content) {
      const wordCount = content.split(/\s+/).length;
      const readTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));
      updateData.readTime = `${readTimeMinutes} min read`;
    }

    // Handle image update if provided
    const blogImage = formData.get('blogImage') as File;
    if (blogImage) {
      // If there's an existing image, extract file ID to delete it later
      const existingImageUrl = existingBlog.image;
      let existingFileId = null;

      if (existingImageUrl) {
        const fileIdMatch = existingImageUrl.match(/fileId=([^&]+)/);
        if (fileIdMatch && fileIdMatch[1]) {
          existingFileId = fileIdMatch[1];
        }
      }

      // Upload new image
      const buffer = Buffer.from(await blogImage.arrayBuffer());
      const newFileId = await uploadFile(
        buffer,
        blogImage.name,
        blogImage.type
      );
      // Use the public endpoint
      updateData.image = `/api/files?fileId=${newFileId}`;

      // Delete old image if exists
      if (existingFileId) {
        try {
          await deleteFile(existingFileId);
        } catch (deleteError) {
          console.error('Error deleting old image:', deleteError);
          // Continue with update even if delete fails
        }
      }
    }

    // Update blog
    const updatedBlog = await Blog.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    return NextResponse.json({
      success: true,
      blog: updatedBlog,
      message: 'Blog post updated successfully',
    });
  } catch (error) {
    console.error('Error updating blog:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update blog post' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    const id = params.id;

    // Find the blog to get the image URL if any
    const blog = await Blog.findById(id);
    if (!blog) {
      return NextResponse.json(
        { success: false, message: 'Blog not found' },
        { status: 404 }
      );
    }

    // If blog has an image, delete it from GridFS
    if (blog.image) {
      const fileIdMatch = blog.image.match(/fileId=([^&]+)/);
      if (fileIdMatch && fileIdMatch[1]) {
        try {
          await deleteFile(fileIdMatch[1]);
        } catch (deleteError) {
          console.error('Error deleting blog image:', deleteError);
          // Continue with blog deletion even if image delete fails
        }
      }
    }

    // Delete the blog
    await Blog.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: 'Blog post deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting blog:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete blog post' },
      { status: 500 }
    );
  }
}
