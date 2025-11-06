// app/api/employee/timesheet/check-existing/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/utils/authOptions';
import { connectToDatabase } from '@/utils/db';
import Timesheet from '@/models/Timesheet';

// Add this directive to mark the route as dynamic
export const dynamic = 'force-dynamic';

// GET handler to check for existing timesheet entries
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

    // Get dates from query params
    const url = new URL(req.url);
    const datesParam = url.searchParams.get('dates');

    if (!datesParam) {
      return NextResponse.json(
        { success: false, message: 'No dates provided' },
        { status: 400 }
      );
    }

    let dates: string[] = [];
    try {
      dates = JSON.parse(datesParam);
      if (!Array.isArray(dates)) {
        throw new Error('Invalid dates format');
      }
    } catch (error) {
      return NextResponse.json(
        { success: false, message: 'Invalid dates format' },
        { status: 400 }
      );
    }

    if (dates.length === 0) {
      return NextResponse.json({
        success: true,
        existingDates: [],
      });
    }

    // Convert dates to Date objects for MongoDB query
    const dateObjects = dates.map((dateStr) => new Date(dateStr));

    // Query for existing timesheets
    const existingTimesheets = await Timesheet.find({
      userId: session.user.id,
      date: { $in: dateObjects },
    }).select('date');

    // Extract dates from found timesheets
    const existingDates = existingTimesheets.map(
      (sheet) => sheet.date.toISOString().split('T')[0] // Format as YYYY-MM-DD
    );

    return NextResponse.json({
      success: true,
      existingDates,
    });
  } catch (error) {
    console.error('Error checking existing timesheets:', error);
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    );
  }
}
