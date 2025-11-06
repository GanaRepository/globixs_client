// // app/api/admin/applications/route.ts
// import { NextRequest, NextResponse } from 'next/server';
// import { connectToDatabase } from '@/utils/db';
// import { uploadFile, deleteFile } from '@/utils/gridfs';
// import JobApplication from '@/models/JobApplication';

// // GET method handler with pagination
// export async function GET(req: NextRequest) {
//   try {
//     await connectToDatabase();

//     // Get pagination parameters from URL
//     const url = new URL(req.url);
//     const page = parseInt(url.searchParams.get('page') || '1');
//     const limit = parseInt(url.searchParams.get('limit') || '10');
//     const skip = (page - 1) * limit;

//     // Count total documents
//     const totalDocs = await JobApplication.countDocuments();
//     const totalPages = Math.ceil(totalDocs / limit);

//     // Get paginated applications
//     const applications = await JobApplication.find()
//       .sort({ createdAt: -1 })
//       .skip(skip)
//       .limit(limit);

//     return NextResponse.json({
//       success: true,
//       applications,
//       pagination: {
//         totalPages,
//         currentPage: page,
//       },
//     });
//   } catch (error) {
//     console.error('Error fetching applications:', error);
//     return NextResponse.json(
//       { success: false, message: 'Failed to fetch applications' },
//       { status: 500 }
//     );
//   }
// }

// export async function POST(req: NextRequest) {
//   try {
//     await connectToDatabase();

//     const formData = await req.formData();
//     const resume = formData.get('resume') as File;

//     if (!resume) {
//       return NextResponse.json(
//         { success: false, message: 'Resume is required' },
//         { status: 400 }
//       );
//     }

//     // Upload file to GridFS
//     const buffer = Buffer.from(await resume.arrayBuffer());
//     const fileId = await uploadFile(buffer, resume.name, resume.type);

//     // Create application
//     const application = await JobApplication.create({
//       jobId: formData.get('jobId'),
//       fullName: formData.get('fullName'),
//       email: formData.get('email'),
//       phoneNumber: formData.get('phoneNumber'),
//       skills: formData.get('skills'),
//       fileId: fileId,
//     });

//     return NextResponse.json({
//       success: true,
//       message: 'Application submitted successfully',
//     });
//   } catch (error) {
//     console.error('Error submitting application:', error);
//     return NextResponse.json(
//       { success: false, message: 'Failed to submit application' },
//       { status: 500 }
//     );
//   }
// }

// export async function DELETE(req: NextRequest) {
//   try {
//     await connectToDatabase();

//     const { id } = await req.json();
//     const application = await JobApplication.findById(id);

//     if (!application) {
//       return NextResponse.json(
//         { success: false, message: 'Application not found' },
//         { status: 404 }
//       );
//     }

//     // Delete the file from GridFS
//     await deleteFile(application.fileId);

//     // Delete the application record
//     await JobApplication.findByIdAndDelete(id);

//     return NextResponse.json({
//       success: true,
//       message: 'Application deleted successfully',
//     });
//   } catch (error) {
//     console.error('Error deleting application:', error);
//     return NextResponse.json(
//       { success: false, message: 'Failed to delete application' },
//       { status: 500 }
//     );
//   }
// }

// app/api/admin/applications/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/utils/db';
import { uploadFile, deleteFile } from '@/utils/gridfs';
import JobApplication from '@/models/JobApplication';
import Job from '@/models/Job'; // Import Job model
import { sendJobApplicationConfirmationEmail } from '@/lib/mailer'; // Import from correct path

// GET method handler with pagination
export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    // Get pagination parameters from URL
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    // Count total documents
    const totalDocs = await JobApplication.countDocuments();
    const totalPages = Math.ceil(totalDocs / limit);

    // Get paginated applications
    const applications = await JobApplication.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return NextResponse.json({
      success: true,
      applications,
      pagination: {
        totalPages,
        currentPage: page,
      },
    });
  } catch (error) {
    console.error('Error fetching applications:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch applications' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const formData = await req.formData();
    const resume = formData.get('resume') as File;
    const jobId = formData.get('jobId') as string;
    const fullName = formData.get('fullName') as string;
    const email = formData.get('email') as string;
    const phoneNumber = formData.get('phoneNumber') as string;
    const skills = formData.get('skills') as string;

    if (!resume) {
      return NextResponse.json(
        { success: false, message: 'Resume is required' },
        { status: 400 }
      );
    }

    // Upload file to GridFS
    const buffer = Buffer.from(await resume.arrayBuffer());
    const fileId = await uploadFile(buffer, resume.name, resume.type);

    // Create application
    const application = await JobApplication.create({
      jobId,
      fullName,
      email,
      phoneNumber,
      skills,
      fileId: fileId,
    });

    // Get job title for email
    const job = await Job.findById(jobId);
    const jobTitle = job ? job.title : 'the position';

    // Send confirmation email to the applicant
    try {
      await sendJobApplicationConfirmationEmail(email, fullName, jobTitle);
      console.log('Job application confirmation email sent successfully');
    } catch (emailError) {
      // Log the error but don't fail the request
      console.error('Error sending job application email:', emailError);
    }

    return NextResponse.json({
      success: true,
      message: 'Application submitted successfully',
    });
  } catch (error) {
    console.error('Error submitting application:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to submit application' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectToDatabase();

    const { id } = await req.json();
    const application = await JobApplication.findById(id);

    if (!application) {
      return NextResponse.json(
        { success: false, message: 'Application not found' },
        { status: 404 }
      );
    }

    // Delete the file from GridFS
    await deleteFile(application.fileId);

    // Delete the application record
    await JobApplication.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: 'Application deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting application:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete application' },
      { status: 500 }
    );
  }
}
