// // app/api/employee/timesheet/route.ts
// import { NextRequest, NextResponse } from 'next/server';
// import { getServerSession } from 'next-auth/next';
// import { authOptions } from '@/utils/authOptions';
// import { connectToDatabase } from '@/utils/db';
// import Timesheet from '@/models/Timesheet';

// // Add this directive to mark the route as dynamic
// export const dynamic = 'force-dynamic';

// // GET handler to retrieve timesheet entries
// export async function GET(req: NextRequest) {
//   try {
//     const session = await getServerSession(authOptions);

//     if (!session || !session.user) {
//       return NextResponse.json(
//         { success: false, message: 'Not authenticated' },
//         { status: 401 }
//       );
//     }

//     // Only employees or admins can access timesheets
//     if (session.user.role !== 'employee' && session.user.role !== 'admin') {
//       return NextResponse.json(
//         { success: false, message: 'Unauthorized: Employee access required' },
//         { status: 403 }
//       );
//     }

//     await connectToDatabase();

//     // Get query params
//     const url = new URL(req.url);
//     const userId = url.searchParams.get('userId') || session.user.id;
//     const startDate = url.searchParams.get('startDate');
//     const endDate = url.searchParams.get('endDate');

//     // Build query
//     const query: any = { userId };
//     if (startDate && endDate) {
//       query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
//     }

//     // Get timesheet entries
//     const timesheets = await Timesheet.find(query).sort({ date: -1 });

//     return NextResponse.json(
//       {
//         success: true,
//         data: timesheets,
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error('Error fetching timesheets:', error);
//     return NextResponse.json(
//       { success: false, message: 'Server error' },
//       { status: 500 }
//     );
//   }
// }

// // POST handler to create new timesheet entries
// export async function POST(req: NextRequest) {
//   try {
//     const session = await getServerSession(authOptions);

//     if (!session || !session.user) {
//       return NextResponse.json(
//         { success: false, message: 'Not authenticated' },
//         { status: 401 }
//       );
//     }

//     // Only employees can create their own timesheets
//     if (session.user.role !== 'employee') {
//       return NextResponse.json(
//         { success: false, message: 'Unauthorized: Employee access required' },
//         { status: 403 }
//       );
//     }

//     await connectToDatabase();

//     const body = await req.json();
//     const { date, hoursWorked, description, project } = body;

//     // Validate input
//     if (!date || !hoursWorked || !description) {
//       return NextResponse.json(
//         { success: false, message: 'Missing required fields' },
//         { status: 400 }
//       );
//     }

//     // Create timesheet entry
//     const timesheet = await Timesheet.create({
//       userId: session.user.id,
//       date,
//       hoursWorked,
//       description,
//       project,
//       status: 'pending', // Default status
//     });

//     return NextResponse.json(
//       {
//         success: true,
//         data: timesheet,
//       },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error('Error creating timesheet:', error);
//     return NextResponse.json(
//       { success: false, message: 'Server error' },
//       { status: 500 }
//     );
//   }
// }

// app/api/employee/timesheet/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/utils/authOptions';
import { connectToDatabase } from '@/utils/db';
import Timesheet from '@/models/Timesheet';

// Add this directive to mark the route as dynamic
export const dynamic = 'force-dynamic';

// GET handler to retrieve timesheet entries with pagination
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

    // Get pagination parameters from URL
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const startDate = url.searchParams.get('startDate');
    const endDate = url.searchParams.get('endDate');
    const skip = (page - 1) * limit;

    // Build query
    const query: any = { userId: session.user.id };

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    // Count total documents for pagination
    const totalItems = await Timesheet.countDocuments(query);
    const totalPages = Math.ceil(totalItems / limit);

    // Get timesheets with pagination
    const timesheets = await Timesheet.find(query)
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit);

    return NextResponse.json({
      success: true,
      data: timesheets,
      pagination: {
        totalPages,
        currentPage: page,
        totalItems,
      },
    });
  } catch (error) {
    console.error('Error fetching timesheets:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch timesheets' },
      { status: 500 }
    );
  }
}

// POST handler to create a single timesheet entry
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      );
    }

    await connectToDatabase();
    const data = await req.json();

    // Validate required fields
    const requiredFields = ['date', 'hoursWorked', 'description'];
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { success: false, message: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // Check if a timesheet entry already exists for this date
    const existingTimesheet = await Timesheet.findOne({
      userId: session.user.id,
      date: new Date(data.date),
    });

    if (existingTimesheet) {
      return NextResponse.json(
        {
          success: false,
          message: 'A timesheet entry already exists for this date',
        },
        { status: 409 }
      );
    }

    // Create timesheet entry
    const timesheet = await Timesheet.create({
      userId: session.user.id,
      date: data.date,
      hoursWorked: data.hoursWorked,
      description: data.description,
      project: data.project || '',
      status: 'pending',
    });

    return NextResponse.json(
      {
        success: true,
        data: timesheet,
        message: 'Timesheet entry created successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating timesheet:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create timesheet entry' },
      { status: 500 }
    );
  }
}
