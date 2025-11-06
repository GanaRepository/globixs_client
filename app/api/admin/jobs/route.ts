import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/utils/db';
import Job from '@/models/Job';

export async function GET() {
  try {
    await connectToDatabase();
    const jobs = await Job.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, jobs });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch jobs' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
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

    const job = await Job.create(jobData);
    return NextResponse.json({
      success: true,
      job,
      message: 'Job created successfully',
    });
  } catch (error) {
    console.error('Error creating job:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create job' },
      { status: 500 }
    );
  }
}
