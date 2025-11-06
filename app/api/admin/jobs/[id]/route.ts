// app/api/admin/jobs/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/utils/db';
import Job from '@/models/Job';

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();

    const jobData = await req.json();

    // Validate required fields
    const requiredFields = [
      'title',
      'location',
      'experience',
      'type',
      'description',
    ];
    for (const field of requiredFields) {
      if (!jobData[field]) {
        return NextResponse.json(
          { success: false, message: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // Validate job type
    const validTypes = ['on-site', 'remote', 'hybrid', 'fulltime'];
    if (!validTypes.includes(jobData.type)) {
      return NextResponse.json(
        { success: false, message: 'Invalid job type' },
        { status: 400 }
      );
    }

    // Find and update job
    const updatedJob = await Job.findByIdAndUpdate(
      params.id,
      {
        title: jobData.title,
        location: jobData.location,
        experience: jobData.experience,
        type: jobData.type,
        description: jobData.description,
        // Add updatedAt timestamp
        updatedAt: new Date(),
      },
      // Return the updated document
      { new: true }
    );

    if (!updatedJob) {
      return NextResponse.json(
        { success: false, message: 'Job not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      job: updatedJob,
      message: 'Job updated successfully',
    });
  } catch (error) {
    console.error('Error updating job:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update job' },
      { status: 500 }
    );
  }
}

// Keep the existing DELETE method
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();

    const job = await Job.findByIdAndDelete(params.id);
    if (!job) {
      return NextResponse.json(
        { success: false, message: 'Job not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Job deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting job:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete job' },
      { status: 500 }
    );
  }
}
