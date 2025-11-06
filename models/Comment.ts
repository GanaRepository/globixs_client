// models/Comment.ts
import mongoose, { Schema } from 'mongoose';

export interface IComment {
  _id?: string;
  blogId: string;
  name: string;
  email?: string;
  content: string;
  createdAt: Date;
}

const CommentSchema = new Schema<IComment>({
  blogId: {
    type: String,
    required: true,
    ref: 'Blog',
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
    default: '',
  },
  content: {
    type: String,
    required: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Comment ||
  mongoose.model<IComment>('Comment', CommentSchema);
