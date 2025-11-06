// app/api/admin/timesheets/download/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/utils/authOptions';
import { connectToDatabase } from '@/utils/db';
import { downloadFile, getFileInfo } from '@/utils/gridfs';

// Add this directive to mark the route as dynamic
export const dynamic = 'force-dynamic';

// GET handler to download a timesheet attachment
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Only admins can download any attachment
    if (session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized: Admin access required' },
        { status: 403 }
      );
    }

    await connectToDatabase();

    // Get the file ID from query params
    const url = new URL(req.url);
    const fileId = url.searchParams.get('fileId');

    if (!fileId) {
      return NextResponse.json(
        { success: false, message: 'No file ID provided' },
        { status: 400 }
      );
    }

    // Get file information for headers
    const fileInfo = await getFileInfo(fileId);

    if (!fileInfo) {
      return NextResponse.json(
        { success: false, message: 'File not found' },
        { status: 404 }
      );
    }

    // Download the file from GridFS
    const fileStream = await downloadFile(fileId);

    // Convert stream to buffer for NextResponse
    const chunks: Buffer[] = [];
    for await (const chunk of fileStream) {
      chunks.push(Buffer.from(chunk));
    }

    const buffer = Buffer.concat(chunks);

    // Set appropriate headers for file download
    const headers = new Headers();
    headers.set('Content-Type', fileInfo.contentType);
    headers.set(
      'Content-Disposition',
      `attachment; filename="${fileInfo.filename}"`
    );

    // Return the file as a response
    return new NextResponse(buffer, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error('Error downloading file:', error);
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    );
  }
}
