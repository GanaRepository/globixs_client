// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Define paths that are publicly accessible
const publicPaths = [
  '/',
  '/about-us',
  '/services',
  '/careers',
  '/media',
  '/contact-us',
  '/login',
  '/login/business',
  '/login/candidate',
  '/login/employee',
  '/register',
  '/register/business',
  '/register/candidate',
  '/logout',
  '/unauthorized',
];

// Helper function to check file extensions
function isStaticFile(path: string): boolean {
  return /\.(jpg|jpeg|png|gif|svg|ico|css|js|woff|woff2)$/.test(path);
}

// Helper for public API paths
function isPublicApiPath(path: string): boolean {
  return (
    path.startsWith('/api/auth/') ||
    path.startsWith('/api/files') ||
    (path.startsWith('/api/blogs') && !path.includes('admin')) ||
    path.startsWith('/media/') ||
    path.includes('favicon')
  );
}

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Skip middleware for static files
  if (isStaticFile(path)) {
    return NextResponse.next();
  }

  console.log(`Middleware checking path: ${path}`);

  // Public paths are always accessible
  if (publicPaths.includes(path) || isPublicApiPath(path)) {
    return NextResponse.next();
  }

  try {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    const userRole = token?.role || 'none';
    console.log(`PATH: ${path}, ROLE: ${userRole}`);

    // ===== ADMIN ROUTES =====
    if (path.startsWith('/admin')) {
      // Admin login is a special case
      if (path === '/admin/login') {
        if (token && token.role !== 'admin') {
          console.log(`NON-ADMIN (${token.role}) tried to access admin login`);
          return NextResponse.redirect(new URL('/unauthorized', request.url));
        }
        return NextResponse.next();
      }

      // All other admin routes
      if (!token) {
        return NextResponse.redirect(new URL('/admin/login', request.url));
      }

      if (token.role !== 'admin') {
        console.log(`NON-ADMIN (${token.role}) tried to access: ${path}`);
        return NextResponse.redirect(new URL('/unauthorized', request.url));
      }

      return NextResponse.next();
    }

    // ===== EMPLOYEE ROUTES =====
    if (path.startsWith('/employee')) {
      if (!token) {
        return NextResponse.redirect(new URL('/login/employee', request.url));
      }

      if (token.role !== 'employee' && token.role !== 'admin') {
        return NextResponse.redirect(new URL('/unauthorized', request.url));
      }

      return NextResponse.next();
    }

    // ===== BUSINESS ROUTES =====
    if (path.startsWith('/business')) {
      if (!token) {
        return NextResponse.redirect(new URL('/login/business', request.url));
      }

      if (token.role !== 'business' && token.role !== 'admin') {
        return NextResponse.redirect(new URL('/unauthorized', request.url));
      }

      return NextResponse.next();
    }

    // ===== CANDIDATE ROUTES =====
    if (path.startsWith('/candidate')) {
      if (!token) {
        return NextResponse.redirect(new URL('/login/candidate', request.url));
      }

      if (token.role !== 'candidate' && token.role !== 'admin') {
        return NextResponse.redirect(new URL('/unauthorized', request.url));
      }

      return NextResponse.next();
    }

    // If path is not specifically handled, allow access
    return NextResponse.next();
  } catch (error) {
    console.error('Middleware error:', error);
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/employee/:path*',
    '/business/:path*',
    '/candidate/:path*',
    '/api/admin/:path*',
    '/api/employee/:path*',
    '/api/business/:path*',
    '/api/candidate/:path*',
  ],
};
