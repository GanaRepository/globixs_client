// app/api/admin/applications/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/utils/db';
import JobApplication from '@/models/JobApplication';

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();

    // Get application ID from path parameter
    const { id } = params;

    // Get updated data from request body
    const updateData = await req.json();

    // Validate required fields
    const requiredFields = ['fullName', 'email', 'phoneNumber'];
    for (const field of requiredFields) {
      if (!updateData[field]) {
        return NextResponse.json(
          { success: false, message: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(updateData.email)) {
      return NextResponse.json(
        { success: false, message: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Find and update the application
    const updatedApplication = await JobApplication.findByIdAndUpdate(
      id,
      {
        fullName: updateData.fullName,
        email: updateData.email,
        phoneNumber: updateData.phoneNumber,
        skills: updateData.skills,
        // Add updated timestamp
        updatedAt: new Date(),
      },
      // Return the updated document
      { new: true }
    );

    if (!updatedApplication) {
      return NextResponse.json(
        { success: false, message: 'Application not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      application: updatedApplication,
      message: 'Application updated successfully',
    });
  } catch (error) {
    console.error('Error updating application:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update application' },
      { status: 500 }
    );
  }
}
