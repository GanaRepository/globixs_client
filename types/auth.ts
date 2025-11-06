// types/auth.ts
import { Document, Types } from 'mongoose';

export type UserRole = 'admin' | 'employee' | 'business' | 'candidate';

export interface IUser extends Document {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  companyName?: string;
  role: UserRole;
  isActive: boolean;
  createdBy?: Types.ObjectId;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISession {
  user: {
    id: string;
    email: string;
    role: UserRole;
    firstName?: string;
    lastName?: string;
    companyName?: string;
    isActive: boolean;
  };
  expires: string;
}

export interface ILoginCredentials {
  email: string;
  password: string;
}

export interface IRegisterCandidate {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

export interface IRegisterBusiness {
  companyName: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

export interface ICreateEmployee {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}
