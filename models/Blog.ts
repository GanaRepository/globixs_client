// models/Blog.ts
import mongoose, { Schema } from 'mongoose';

export interface IBlog {
  _id?: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  category: string; // Changed from enum to string to support custom categories
  image?: string;
  featured: boolean;
  readTime: string;
  views: string;
  createdAt: Date;
  updatedAt?: Date;
}

const BlogSchema = new Schema<IBlog>({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  excerpt: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default: '',
  },
  featured: {
    type: Boolean,
    default: false,
  },
  readTime: {
    type: String,
    default: '5 min read',
  },
  views: {
    type: String,
    default: '0',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: null,
  },
});

export default mongoose.models.Blog ||
  mongoose.model<IBlog>('Blog', BlogSchema);
