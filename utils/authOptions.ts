// utils/authOptions.ts
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import User from '@/models/User';
import { connectToDatabase } from '@/utils/db';
import { UserRole } from '@/types/auth';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
        loginType: { label: 'Login Type', type: 'text' },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required');
        }

        // Get login type to enforce role-based access
        const loginPath = req?.body?.callbackUrl || '';
        let expectedRole: UserRole | null = null;

        // Determine expected role based on login URL
        if (loginPath.includes('/admin/login')) {
          expectedRole = 'admin';
        } else if (loginPath.includes('/login/employee')) {
          expectedRole = 'employee';
        } else if (loginPath.includes('/login/business')) {
          expectedRole = 'business';
        } else if (loginPath.includes('/login/candidate')) {
          expectedRole = 'candidate';
        }

        await connectToDatabase();

        // Find user by email - this works for all user types
        const user = await User.findOne({ email: credentials.email });

        if (!user) {
          throw new Error('User not found');
        }

        // Verify the expected role if determined from URL
        if (expectedRole && user.role !== expectedRole) {
          // Provide a specific error message directing to correct login page
          throw new Error(
            `This email is associated with a ${user.role} account. Please log in via the ${user.role} login page.`
          );
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          throw new Error('Invalid email or password');
        }

        // Check if the user is active
        if (!user.isActive) {
          throw new Error(
            'This account has been deactivated. Please contact support.'
          );
        }

        // Return user data with role information
        return {
          id: user._id.toString(),
          email: user.email,
          role: user.role,
          firstName: user.firstName,
          lastName: user.lastName,
          companyName: user.companyName,
          isActive: user.isActive || true,
        };
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      // Initialize user object if it doesn't exist
      if (!session.user) {
        session.user = {} as any;
      }

      if (token) {
        // Set required properties to avoid TypeScript errors
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.role = token.role as UserRole;
        session.user.isActive = token.isActive as boolean;

        // Add conditional fields based on role
        if (token.firstName) session.user.firstName = token.firstName as string;
        if (token.lastName) session.user.lastName = token.lastName as string;
        if (token.companyName)
          session.user.companyName = token.companyName as string;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        // Initial sign in - add user data to token
        token.id = user.id;
        token.email = user.email;
        token.role = user.role;
        token.isActive = user.isActive;

        // Add conditional fields based on role
        if (user.firstName) token.firstName = user.firstName;
        if (user.lastName) token.lastName = user.lastName;
        if (user.companyName) token.companyName = user.companyName;
      }
      return token;
    },
    async redirect({ url, baseUrl }) {
      // Handle redirects based on role
      // This will be handled on the client side for better UX
      return url.startsWith(baseUrl) ? url : baseUrl;
    },
  },
  pages: {
    signIn: '/login',
    signOut: '/logout',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
};
