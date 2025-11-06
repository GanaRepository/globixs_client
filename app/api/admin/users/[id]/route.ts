// app/api/admin/users/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/utils/db';
import User from '@/models/User';

// GET - Get a specific user by ID
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();

    const user = await User.findById(params.id).select(
      '-password -resetPasswordToken -resetPasswordExpires'
    );

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}

// PATCH - Update a user
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    const data = await req.json();

    // Validate the user exists
    const user = await User.findById(params.id);
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // Get the requester info (would come from session/auth)
    // Ensure this is implemented properly with your auth system
    const adminId = req.headers.get('X-Admin-Id') || 'admin'; // Replace with actual admin ID retrieval

    // Restrict certain updates
    // For example, don't allow changing an admin's role unless super admin
    if (
      user.role === 'admin' &&
      data.role &&
      data.role !== 'admin' &&
      adminId !== 'superadmin' // Implement proper super admin check
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Cannot change an admin user's role unless you are a super admin",
        },
        { status: 403 }
      );
    }

    // Filter allowed fields to update
    const allowedFields = [
      'firstName',
      'lastName',
      'companyName',
      'email',
      'role',
      'isActive',
    ];

    const updateData: any = {};

    allowedFields.forEach((field) => {
      if (data[field] !== undefined) {
        updateData[field] = data[field];
      }
    });

    // If email is being changed, check if it's already in use
    if (updateData.email && updateData.email !== user.email) {
      const existingUser = await User.findOne({
        email: updateData.email,
        _id: { $ne: params.id }, // Exclude the current user
      });

      if (existingUser) {
        return NextResponse.json(
          { success: false, message: 'Email is already in use' },
          { status: 409 }
        );
      }
    }

    // Update the user
    const updatedUser = await User.findByIdAndUpdate(
      params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password -resetPasswordToken -resetPasswordExpires');

    return NextResponse.json({
      success: true,
      message: 'User updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : 'Failed to update user',
      },
      { status: 500 }
    );
  }
}

// DELETE - Delete a user
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();

    // Validate the user exists
    const user = await User.findById(params.id);
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // Get the requester info (would come from session/auth)
    // Ensure this is implemented properly with your auth system
    const adminId = req.headers.get('X-Admin-Id') || 'admin'; // Replace with actual admin ID retrieval

    // Add protection: prevent admins from deleting other admins
    // Only super admin should delete admin accounts
    if (
      user.role === 'admin' &&
      adminId !== 'superadmin' // Implement proper super admin check
    ) {
      return NextResponse.json(
        {
          success: false,
          message: 'Cannot delete an admin user unless you are a super admin',
        },
        { status: 403 }
      );
    }

    // Delete the user
    await User.findByIdAndDelete(params.id);

    return NextResponse.json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete user' },
      { status: 500 }
    );
  }
}
