// app/api/admin/auth/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(req: NextRequest) {
  console.log('Admin auth DELETE route called');
  // Success response - actual session clearing handled by NextAuth
  return NextResponse.json({ success: true }, { status: 200 });
}
