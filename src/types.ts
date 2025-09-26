// src/types.ts

export interface User {
    id: string;
    email: string;
    name?: string;
    phone?: string;
    state?: string;
    username?: string;
    role: 'STUDENT' | 'TEACHER' | 'ADMIN';
    isVerified: boolean;
    createdAt: string;
  }
  
  export interface Course {
    id: string;
    name: string;
    description?: string;
    isPaid: boolean;
    price?: number;
    teacher?: User;
    subjects?: Subject[];
  }
  
  export interface Subject {
    id: string;
    name: string;
    description?: string;
    classes?: Class[];
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
  
  export interface Notification {
      id: string;
      title: string;
      message: string;
      type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
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
      notes: any[];
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
    status: 'NEW' | 'CONTACTED' | 'CONVERTED' | 'LOST';
    assignedTo?: string;
    salesUser?: User;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface LiveSession {
    id: string;
    classId: string;
    sessionUrl: string; // Ingest URL for teacher
    playbackUrl?: string; // Playback URL for students
    startedAt: string;
    endedAt?: string;
  }