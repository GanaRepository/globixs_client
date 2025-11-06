// app/api/admin/timesheets/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/utils/authOptions';
import { connectToDatabase } from '@/utils/db';
import Timesheet from '@/models/Timesheet';

// Add this directive to mark the route as dynamic
export const dynamic = 'force-dynamic';

// PUT handler to update timesheet details
export async function PUT(
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

    // Only admins can update any timesheet
    if (session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized: Admin access required' },
        { status: 403 }
      );
    }

    await connectToDatabase();

    const { id } = params;
    const body = await req.json();
    const { hoursWorked, description, project, status } = body;

    // Validate input
    if (hoursWorked <= 0) {
      return NextResponse.json(
        { success: false, message: 'Hours worked must be greater than 0' },
        { status: 400 }
      );
    }

    if (!description) {
      return NextResponse.json(
        { success: false, message: 'Description is required' },
        { status: 400 }
      );
    }

    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return NextResponse.json(
        { success: false, message: 'Invalid status' },
        { status: 400 }
      );
    }

    // Update timesheet
    const updatedTimesheet = await Timesheet.findByIdAndUpdate(
      id,
      {
        hoursWorked,
        description,
        project,
        status,
        updatedAt: new Date(),
        updatedBy: session.user.id,
      },
      { new: true }
    );

    if (!updatedTimesheet) {
      return NextResponse.json(
        { success: false, message: 'Timesheet not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        timesheet: updatedTimesheet,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating timesheet:', error);
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    );
  }
}
