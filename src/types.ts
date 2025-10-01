// src/types.ts

export interface User {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  state?: string;
  role: 'STUDENT' | 'TEACHER' | 'ADMIN';
}

export interface Batch {
  id: string;
  name: string;
  startDate: string;
  endDate?: string;
}

export interface Course {
  id: string;
  name: string;
  description?: string;
  isPaid: boolean;
  price?: number;
  slug: string;
  imageUrl?: string;
  subjects: Subject[];
  batches: Batch[];
  teacher?: { name: string; };
}

export interface Subject {
  id: string;
  name: string;
  description?: string;
  classes?: Class[];
  resources?: Resource[];
}

export interface Resource {
  id: string;
  title: string;
  description?: string;
  type: 'PDF' | 'YOUTUBE' | 'QUIZ' | 'NCERT_BOOK' | 'PREVIOUS_YEAR' | 'SYLLABUS';
  url?: string;
  signedUrl?: string;
}

export interface Class {
  id: string;
  title: string;
  description?: string;
  videoUrl?: string;
  isLive: boolean;
  startTime?: string;
  endTime?: string;
}

// ✅ CORRECTED: Single, accurate Enrollment definition
export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  batchId?: string;
  course: Course; // Includes the full Course object
  batch?: Batch;  // Includes the optional Batch object
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "INFO" | "SUCCESS" | "WARNING" | "ERROR";
  isRead: boolean;
  createdAt: string;
}

export interface PaymentOrder {
  id: string;
  entity: string;
  amount: number;
  amount_paid: number;
  amount_due: number;
  currency: string;
  receipt: string;
  offer_id: string | null;
  status: string;
  attempts: number;
  notes: Record<string, string | number | boolean>[];
  created_at: number;
}

export interface AdminStats {
  totalUsers: number;
  totalCourses: number;
  totalEnrollments: number;
  totalRevenue: number;
}

export interface Lead {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  source?: string;
  status: "NEW" | "CONTACTED" | "CONVERTED" | "LOST";
  assignedTo?: string;
  salesUser?: User;
  createdAt: string;
  updatedAt: string;
}

export interface LiveSession {
  id: string;
  classId: string;
  sessionUrl: string;
  playbackUrl?: string;
  startedAt: string;
  endedAt?: string;
}

export interface TestSeries {
  id: string;
  title: string;
  description?: string;
  classLevel: string;
  subject: string;
  price: number;
  isFree: boolean;
  tests: Test[];
}

export interface Test {
  id: string;
  title: string;
  duration?: number;
  questionsList: TestQuestion[];
}

export interface TestQuestion {
  id: string;
  text: string;
  options: Record<string, string>; // JSON field
  marks: number;
}

// ✅ CORRECTED: Single, accurate Quiz & QuizQuestion definition
export interface Quiz {
  id: string;
  title: string;
  isPaid: boolean;
  quizquestions: QuizQuestion[];
}

export interface QuizQuestion {
  id: string;
  text: string;
  options: Record<string, string>; // JSON field
  explanation?: string;
}

export interface TestAttempt {
  id: string;
  score: number;
  responses: Record<string, string | number | boolean>; // JSON
  userId: string;
  testId: string;
}

export interface QuizAttempt {
  id: string;
  score: number;
  responses: Record<string, string | number | boolean>; // JSON
  userId: string;
  quizId: string;
}

export interface Progress {
  id: string;
  percentage: number;
  userId: string;
  classId?: string;
  subjectId?: string;
  courseId?: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountPercent: number;
  maxDiscount?: number;
  validUntil: string;
  isActive: boolean;
}