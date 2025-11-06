// models/JobApplication.ts
import mongoose, { Schema } from 'mongoose';
import { IJobApplication } from '@/types';

const JobApplicationSchema = new Schema<IJobApplication>({
  jobId: {
    type: String,
    required: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  skills: {
    type: String,
    required: true,
  },
  fileId: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.JobApplication ||
  mongoose.model<IJobApplication>('JobApplication', JobApplicationSchema);
