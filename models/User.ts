// models/User.ts
import mongoose, { Schema } from 'mongoose';
import { IUser } from '@/types/auth';

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: function (this: IUser) {
        return this.role === 'candidate' || this.role === 'employee';
      },
    },
    lastName: {
      type: String,
      required: function (this: IUser) {
        return this.role === 'candidate' || this.role === 'employee';
      },
    },
    companyName: {
      type: String,
      required: function (this: IUser) {
        return this.role === 'business';
      },
    },
    role: {
      type: String,
      enum: ['admin', 'employee', 'business', 'candidate'],
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    resetPasswordToken: {
      type: String,
      default: null,
    },
    resetPasswordExpires: {
      type: Date,
      default: null,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: function (this: IUser) {
        return this.role === 'employee';
      },
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.User ||
  mongoose.model<IUser>('User', UserSchema);
