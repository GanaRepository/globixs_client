// app/api/admin/files/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { downloadFile, getFileInfo } from '@/utils/gridfs';

export async function POST(req: NextRequest) {
  try {
    const { fileId } = await req.json();
    if (!fileId) {
      return NextResponse.json(
        { success: false, message: 'File ID is required' },
        { status: 400 }
      );
    }

    const fileInfo = await getFileInfo(fileId);
    if (!fileInfo) {
      return NextResponse.json(
        { success: false, message: 'File not found' },
        { status: 404 }
      );
    }

    const stream = await downloadFile(fileId);
    const response = new NextResponse(stream as any);

    response.headers.set('Content-Type', fileInfo.contentType);
    response.headers.set(
      'Content-Disposition',
      `attachment; filename="${fileInfo.filename}"`
    );

    return response;
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to download file' },
      { status: 500 }
    );
  }
}
