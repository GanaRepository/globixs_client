// types/next-auth.d.ts
import 'next-auth';
import { UserRole } from './auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      role: UserRole;
      firstName?: string;
      lastName?: string;
      companyName?: string;
      isActive: boolean;
    };
  }

  interface User {
    id: string;
    email: string;
    role: UserRole;
    firstName?: string;
    lastName?: string;
    companyName?: string;
    isActive: boolean;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    email: string;
    role: UserRole;
    firstName?: string;
    lastName?: string;
    companyName?: string;
    isActive: boolean;
  }
}
