// app/api/admin/employees/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/utils/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

// GET - Get all employees with pagination and search
export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    // Get pagination parameters from URL
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const search = url.searchParams.get('search') || '';
    const skip = (page - 1) * limit;

    // Build search query
    let query: any = { role: 'employee' };
    if (search) {
      query = {
        ...query,
        $or: [
          { firstName: { $regex: search, $options: 'i' } },
          { lastName: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
        ],
      };
    }

    // Count total documents
    const totalDocs = await User.countDocuments(query);
    const totalPages = Math.ceil(totalDocs / limit);

    // Get paginated employees
    const users = await User.find(query)
      .select('-password -resetPasswordToken -resetPasswordExpires')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return NextResponse.json({
      success: true,
      users,
      pagination: {
        totalPages,
        currentPage: page,
        total: totalDocs,
      },
    });
  } catch (error) {
    console.error('Error fetching employees:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch employees' },
      { status: 500 }
    );
  }
}

// POST - Create a new employee
export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const data = await req.json();

    // Find an admin to use as the creator
    const admin = await User.findOne({ role: 'admin' });
    if (!admin) {
      return NextResponse.json(
        { success: false, message: 'No admin user found to assign as creator' },
        { status: 500 }
      );
    }

    // Validate required fields
    const requiredFields = ['firstName', 'lastName', 'email', 'password'];
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { success: false, message: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // Check if email is already registered
    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'Email is already registered' },
        { status: 409 }
      );
    }

    // Validate password
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(data.password)) {
      return NextResponse.json(
        {
          success: false,
          message:
            'Password must be at least 8 characters and include uppercase, lowercase, number, and special character',
        },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Create employee with role explicitly set to 'employee'
    // and include the admin's ID as createdBy
    const newUser = await User.create({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: hashedPassword,
      role: 'employee',
      isActive: true,
      createdBy: admin._id, // Use the found admin's ID
    });

    // Return success (exclude sensitive info)
    return NextResponse.json({
      success: true,
      message: 'Employee created successfully',
      user: {
        id: newUser._id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error('Error creating employee:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create employee' },
      { status: 500 }
    );
  }
}
