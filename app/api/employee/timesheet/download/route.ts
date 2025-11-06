// app/api/employee/timesheet/download/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/utils/authOptions';
import { connectToDatabase } from '@/utils/db';
import { downloadFile, getFileInfo } from '@/utils/gridfs';
import Timesheet from '@/models/Timesheet';

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

    // For security, verify that the user has access to this file
    // Find a timesheet with this attachment that belongs to the user
    // or allow admins to access any file
    let hasAccess = false;
    if (session.user.role === 'admin') {
      hasAccess = true;
    } else {
      const timesheetWithAttachment = await Timesheet.findOne({
        userId: session.user.id,
        fileId: fileId,
      });

      hasAccess = !!timesheetWithAttachment;
    }

    if (!hasAccess) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized access to file' },
        { status: 403 }
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
