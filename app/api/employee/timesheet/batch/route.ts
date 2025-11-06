// // app/api/employee/timesheet/batch/route.ts
// import { NextRequest, NextResponse } from 'next/server';
// import { getServerSession } from 'next-auth/next';
// import { authOptions } from '@/utils/authOptions';
// import { connectToDatabase } from '@/utils/db';
// import Timesheet from '@/models/Timesheet';
// import { uploadFile } from '@/utils/gridfs';

// // Add this directive to mark the route as dynamic
// export const dynamic = 'force-dynamic';

// // Define interface for timesheet entry
// interface TimesheetEntry {
//   date: string;
//   hoursWorked: number;
//   description: string;
//   project?: string;
// }

// // POST handler to create multiple timesheet entries
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

//     // Process the form data
//     const formData = await req.formData();

//     // Get the timesheet entries from form data
//     const entriesJson = formData.get('entries');
//     if (!entriesJson || typeof entriesJson !== 'string') {
//       return NextResponse.json(
//         { success: false, message: 'No timesheet entries provided' },
//         { status: 400 }
//       );
//     }

//     const entries: TimesheetEntry[] = JSON.parse(entriesJson);

//     // Validate entries
//     if (!Array.isArray(entries) || entries.length === 0) {
//       return NextResponse.json(
//         { success: false, message: 'No valid timesheet entries provided' },
//         { status: 400 }
//       );
//     }

//     // Process file upload if present
//     let attachmentId = null;
//     const attachment = formData.get('attachment') as File | null;

//     if (attachment) {
//       // Upload the file to GridFS
//       const buffer = Buffer.from(await attachment.arrayBuffer());
//       attachmentId = await uploadFile(buffer, attachment.name, attachment.type);
//     }

//     // Create timesheet entries in database
//     const createdTimesheets = await Promise.all(
//       entries.map(async (entry) => {
//         // Validate required fields
//         if (!entry.date || entry.hoursWorked <= 0 || !entry.description) {
//           throw new Error('Missing required fields in one or more entries');
//         }

//         // Create the timesheet entry
//         return await Timesheet.create({
//           userId: session.user.id,
//           date: entry.date,
//           hoursWorked: entry.hoursWorked,
//           description: entry.description,
//           project: entry.project || '',
//           fileId: attachmentId, // All entries share the same attachment
//           status: 'pending', // Default status
//         });
//       })
//     );

//     return NextResponse.json(
//       {
//         success: true,
//         data: {
//           timesheets: createdTimesheets,
//           count: createdTimesheets.length,
//         },
//         message: `Successfully submitted ${createdTimesheets.length} timesheet entries`,
//       },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error('Error creating timesheets:', error);
//     return NextResponse.json(
//       {
//         success: false,
//         message: error instanceof Error ? error.message : 'Server error',
//       },
//       { status: 500 }
//     );
//   }
// }

// app/api/employee/timesheet/batch/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/utils/authOptions';
import { connectToDatabase } from '@/utils/db';
import Timesheet from '@/models/Timesheet';
import { uploadFile } from '@/utils/gridfs';

// Add this directive to mark the route as dynamic
export const dynamic = 'force-dynamic';

// Define interface for timesheet entry
interface TimesheetEntry {
  date: string;
  hoursWorked: number;
  description: string;
  project?: string;
}

// POST handler to create multiple timesheet entries
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

    // Process the form data
    const formData = await req.formData();

    // Get the timesheet entries from form data
    const entriesJson = formData.get('entries');
    if (!entriesJson || typeof entriesJson !== 'string') {
      return NextResponse.json(
        { success: false, message: 'No timesheet entries provided' },
        { status: 400 }
      );
    }

    const entries: TimesheetEntry[] = JSON.parse(entriesJson);

    // Validate entries
    if (!Array.isArray(entries) || entries.length === 0) {
      return NextResponse.json(
        { success: false, message: 'No valid timesheet entries provided' },
        { status: 400 }
      );
    }

    // Check for duplicate dates in the submitted entries
    const dateMap = new Map();
    for (const entry of entries) {
      const dateStr = entry.date;
      if (dateMap.has(dateStr)) {
        return NextResponse.json(
          {
            success: false,
            message: 'Duplicate dates are not allowed in a single submission',
          },
          { status: 400 }
        );
      }
      dateMap.set(dateStr, true);
    }

    // Process file upload if present
    let fileId = null;
    const attachment = formData.get('attachment') as File | null;

    if (attachment) {
      // Upload the file to GridFS
      const buffer = Buffer.from(await attachment.arrayBuffer());
      fileId = await uploadFile(buffer, attachment.name, attachment.type);
    }

    // Check for existing timesheet entries for these dates
    const dates = entries.map((entry) => new Date(entry.date));
    const existingEntries = await Timesheet.find({
      userId: session.user.id,
      date: { $in: dates },
    });

    if (existingEntries.length > 0) {
      // Format dates for error message
      const existingDates = existingEntries.map(
        (entry) => entry.date.toISOString().split('T')[0]
      );

      return NextResponse.json(
        {
          success: false,
          message:
            'Timesheet entries already exist for these dates: ' +
            existingDates.join(', '),
          existingDates,
        },
        { status: 409 }
      );
    }

    // Create timesheet entries in database
    const createdTimesheets = await Promise.all(
      entries.map(async (entry) => {
        // Validate required fields
        if (!entry.date || entry.hoursWorked <= 0 || !entry.description) {
          throw new Error('Missing required fields in one or more entries');
        }

        // Create the timesheet entry
        return await Timesheet.create({
          userId: session.user.id,
          date: entry.date,
          hoursWorked: entry.hoursWorked,
          description: entry.description,
          project: entry.project || '',
          fileId: fileId,
          status: 'pending',
        });
      })
    );

    return NextResponse.json(
      {
        success: true,
        data: {
          timesheets: createdTimesheets,
          count: createdTimesheets.length,
        },
        message: `Successfully submitted ${createdTimesheets.length} timesheet entries`,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating timesheets:', error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Server error',
      },
      { status: 500 }
    );
  }
}
