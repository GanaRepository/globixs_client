// app/api/admin/users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/utils/db';
import User from '@/models/User';

// Add this directive to mark the route as dynamic
export const dynamic = 'force-dynamic';

// GET - Get all users with pagination, search, and role filter
export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    // Get pagination and filter parameters from URL
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const search = url.searchParams.get('search') || '';
    const role = url.searchParams.get('role') || '';
    const skip = (page - 1) * limit;

    // Build query
    let query: any = {};

    // Add role filter if specified
    if (role && role !== 'all') {
      query.role = role;
    }

    // Add search query if specified
    if (search) {
      query = {
        ...query,
        $or: [
          { firstName: { $regex: search, $options: 'i' } },
          { lastName: { $regex: search, $options: 'i' } },
          { companyName: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
        ],
      };
    }

    // Count total documents matching the query
    const totalDocs = await User.countDocuments(query);
    const totalPages = Math.ceil(totalDocs / limit);

    // Get paginated users
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
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}
