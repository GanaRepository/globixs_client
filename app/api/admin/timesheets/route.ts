// // app/api/admin/timesheets/route.ts
// import { NextRequest, NextResponse } from 'next/server';
// import { getServerSession } from 'next-auth/next';
// import { authOptions } from '@/utils/authOptions';
// import { connectToDatabase } from '@/utils/db';
// import Timesheet from '@/models/Timesheet';
// import User from '@/models/User';

// // Add this directive to mark the route as dynamic
// export const dynamic = 'force-dynamic';

// // GET handler for admin to retrieve all timesheets with filtering
// export async function GET(req: NextRequest) {
//   try {
//     const session = await getServerSession(authOptions);

//     if (!session || !session.user) {
//       return NextResponse.json(
//         { success: false, message: 'Not authenticated' },
//         { status: 401 }
//       );
//     }

//     // Only admins can view all timesheets
//     if (session.user.role !== 'admin') {
//       return NextResponse.json(
//         { success: false, message: 'Unauthorized: Admin access required' },
//         { status: 403 }
//       );
//     }

//     await connectToDatabase();

//     // Get query params for filtering
//     const url = new URL(req.url);
//     const userId = url.searchParams.get('userId');
//     const status = url.searchParams.get('status');
//     const startDate = url.searchParams.get('startDate');
//     const endDate = url.searchParams.get('endDate');
//     const search = url.searchParams.get('search');
//     const limit = parseInt(url.searchParams.get('limit') || '100');
//     const page = parseInt(url.searchParams.get('page') || '1');
//     const skip = (page - 1) * limit;

//     // Build query
//     const query: any = {};

//     // Add filters if provided
//     if (userId && userId !== 'all') {
//       query.userId = userId;
//     }

//     if (status && status !== 'all') {
//       query.status = status;
//     }

//     if (startDate && endDate) {
//       query.date = {
//         $gte: new Date(startDate),
//         $lte: new Date(endDate),
//       };
//     }

//     // Add text search if provided
//     if (search) {
//       query.$or = [
//         { project: { $regex: search, $options: 'i' } },
//         { description: { $regex: search, $options: 'i' } },
//       ];
//     }

//     // Get timesheets with pagination
//     const timesheets = await Timesheet.find(query)
//       .sort({ date: -1 })
//       .skip(skip)
//       .limit(limit);

//     // Get count for pagination
//     const total = await Timesheet.countDocuments(query);

//     // Attach user information to each timesheet
//     const userIds = Array.from(
//       new Set(timesheets.map((sheet) => sheet.userId.toString()))
//     );
//     const users = await User.find({ _id: { $in: userIds } });

//     // Create a map of user IDs to user data for easy lookup
//     const userMap = users.reduce((map, user) => {
//       map[user._id.toString()] = { name: user.name, email: user.email };
//       return map;
//     }, {});

//     // Attach user data to each timesheet
//     const timesheetsWithUsers = timesheets.map((timesheet) => {
//       const timesheetObj = timesheet.toObject();
//       const userId = timesheet.userId.toString();

//       if (userMap[userId]) {
//         timesheetObj.user = userMap[userId];
//       }

//       return timesheetObj;
//     });

//     return NextResponse.json(
//       {
//         success: true,
//         timesheets: timesheetsWithUsers,
//         pagination: {
//           total,
//           pages: Math.ceil(total / limit),
//           page,
//           limit,
//         },
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

// app/api/admin/timesheets/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/utils/authOptions';
import { connectToDatabase } from '@/utils/db';
import Timesheet from '@/models/Timesheet';
import User from '@/models/User';

// Add this directive to mark the route as dynamic
export const dynamic = 'force-dynamic';

// GET handler for admin to retrieve all timesheets with filtering
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Only admins can view all timesheets
    if (session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized: Admin access required' },
        { status: 403 }
      );
    }

    await connectToDatabase();

    // Get query params for filtering
    const url = new URL(req.url);
    const userId = url.searchParams.get('userId');
    const status = url.searchParams.get('status');
    const startDate = url.searchParams.get('startDate');
    const endDate = url.searchParams.get('endDate');
    const search = url.searchParams.get('search');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const page = parseInt(url.searchParams.get('page') || '1');
    const skip = (page - 1) * limit;

    // Build query
    const query: any = {};

    // Add filters if provided
    if (userId && userId !== 'all') {
      query.userId = userId;
    }

    if (status && status !== 'all') {
      query.status = status;
    }

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    // Add text search if provided
    if (search) {
      query.$or = [
        { project: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // Count total documents for pagination
    const total = await Timesheet.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    // Get timesheets with pagination
    const timesheets = await Timesheet.find(query)
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit);

    // Attach user information to each timesheet
    const userIds = Array.from(
      new Set(timesheets.map((sheet) => sheet.userId.toString()))
    );
    const users = await User.find({ _id: { $in: userIds } });

    // Create a map of user IDs to user data for easy lookup
    const userMap = users.reduce((map, user) => {
      map[user._id.toString()] = {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      };
      return map;
    }, {});

    // Attach user data to each timesheet
    const timesheetsWithUsers = timesheets.map((timesheet) => {
      const timesheetObj = timesheet.toObject();
      const userId = timesheet.userId.toString();

      if (userMap[userId]) {
        timesheetObj.user = userMap[userId];
      }

      return timesheetObj;
    });

    return NextResponse.json(
      {
        success: true,
        timesheets: timesheetsWithUsers,
        pagination: {
          total,
          pages: totalPages,
          page,
          limit,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching timesheets:', error);
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    );
  }
}
