// app/api/admin/timesheets/[id]/status/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/utils/authOptions';
import { connectToDatabase } from '@/utils/db';
import Timesheet from '@/models/Timesheet';

// Add this directive to mark the route as dynamic
export const dynamic = 'force-dynamic';

// PATCH handler to update timesheet status
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Only admins can update timesheet status
    if (session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized: Admin access required' },
        { status: 403 }
      );
    }

    await connectToDatabase();

    const { id } = params;
    const body = await req.json();
    const { status } = body;

    // Validate status
    if (!['approved', 'rejected'].includes(status)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid status. Must be "approved" or "rejected"',
        },
        { status: 400 }
      );
    }

    // Update timesheet status
    const timesheet = await Timesheet.findByIdAndUpdate(
      id,
      {
        status,
        updatedAt: new Date(),
        updatedBy: session.user.id,
      },
      { new: true }
    );

    if (!timesheet) {
      return NextResponse.json(
        { success: false, message: 'Timesheet not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        timesheet,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating timesheet status:', error);
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    );
  }
}
