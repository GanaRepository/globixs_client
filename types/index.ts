// types/index.ts
import { Document } from 'mongoose';
import { ReactNode } from 'react';

export interface IJob extends Document {
  title: string;
  location: string;
  experience: string;
  type: 'on-site' | 'remote' | 'hybrid' | 'Full-Time';
  description: string;
}

export interface IJobApplication extends Document {
  _id: string;
  jobId: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  skills: string;
  fileId: string;
  createdAt: Date;
}

export interface IAdmin extends Document {
  email: string;
  password: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IContact extends Document {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface FileInfo {
  id: string;
  filename: string;
  contentType: string;
  size: number;
  uploadDate: Date;
}

export interface SectionHeaderProps {
  title: string;
  subtitle: string;
  center?: boolean;
  titleSize?: 'default' | 'large' | 'small';
  maxWidth?: string;
}

export interface TechCardProps {
  icon: ReactNode;
  title: string;
}

export interface ServiceCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

export interface HeroSlide {
  title: string;
  subtitle: string;
  backgroundImage: string; // Unsplash or local image URL
}

export interface FeatureImage {
  img: string;
  headline: string;
}

export interface IndustryData {
  name: string;
  description: string;
  icon: ReactNode;
  image: string;
}

export interface NavItem {
  title: string;
  icon: ReactNode;
  active?: boolean;
}

// Example usage in a page or component
export const heroSlides: HeroSlide[] = [
  {
    title: 'Innovative IT Solutions',
    subtitle: 'Empowering Your Business with Cutting-Edge Technology',
    backgroundImage: '/path/to/unsplash-image-1.jpg', // or full Unsplash URL
  },
  {
    title: 'Expert Tech Consulting',
    subtitle: 'Transforming Challenges into Opportunities',
    backgroundImage: '/path/to/unsplash-image-2.jpg',
  },
  {
    title: 'Seamless Digital Transformation',
    subtitle: "Accelerating Your Company's Digital Journey",
    backgroundImage: '/path/to/unsplash-image-3.jpg',
  },
];

export interface SectionHeaderProps {
  accentColor?: 'primary' | 'secondary' | 'accent';
  title: string;
  subtitle: string;
  center?: boolean;
  titleSize?: 'small' | 'default' | 'large';
  maxWidth?: string;
}

export interface TechCardProps {
  icon: ReactNode;
  title: string;
}

export interface ServiceCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

export interface SolutionsSectionProps {
  isVisible: Record<string, boolean>;
  featureImages: string[];
}

export interface TestimonialProps {
  quote: string;
  author: string;
  position: string;
  company: string;
  image?: string;
}

export interface HeroSlideProps {
  title: string;
  subtitle: string;
  backgroundImage: string;
}

export interface IndustryData {
  name: string;
  description: string;
  icon: ReactNode;
  image: string;
}

export interface QuoteSectionProps {
  quote: string;
  author: string;
  role: string;
  bgColor?: string;
  textColor?: string;
}

export interface ServiceCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  imageUrl: string;
  ctaText?: string;
}

export interface TestimonialProps {
  quote: string;
  name: string;
  title: string;
  company: string;
  image?: string;
  metric?: string;
  metricIcon?: React.ReactNode;
}

export interface InfiniteMovingCardsProps {
  items: ReactNode[];
  direction?: 'left' | 'right';
  speed?: number;
  pauseOnHover?: boolean;
}

export interface IBlog {
  _id?: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  image?: string;
  featured: boolean;
  readTime: string;
  views: string;
  createdAt: Date;
  updatedAt?: Date;
}

// Comment type definition
export interface IComment {
  _id?: string;
  blogId: string;
  name: string;
  email?: string;
  content: string;
  createdAt: Date;
}
