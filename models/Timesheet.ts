// models/Timesheet.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface ITimesheet extends Document {
  userId: mongoose.Types.ObjectId;
  date: Date;
  hoursWorked: number;
  description: string;
  project?: string;
  fileId?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  updatedAt?: Date;
  updatedBy?: mongoose.Types.ObjectId;
}

const TimesheetSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    date: {
      type: Date,
      required: true,
      index: true,
    },
    hoursWorked: {
      type: Number,
      required: true,
      min: 0,
      max: 24,
    },
    description: {
      type: String,
      required: true,
    },
    project: {
      type: String,
      default: '',
    },
    fileId: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
      index: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    // Schema options should be here, not as a separate object
    timestamps: false, // Add this if you're manually handling timestamps
  }
);

// Add the unique compound index after schema creation
TimesheetSchema.index({ userId: 1, date: 1 }, { unique: true });

// Check if model is already defined to prevent overwriting during hot reload
const Timesheet =
  mongoose.models.Timesheet ||
  mongoose.model<ITimesheet>('Timesheet', TimesheetSchema);

export default Timesheet;
