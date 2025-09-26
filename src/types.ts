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