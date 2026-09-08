export interface User {
  id: string;
  role: "teacher" | "student";
  name: string;
  email: string;
  password: string;
  department?: string;
  rollNumber?: string;
  year?: string;
  subjects?: string[];
}

export type AssignmentStatus = "pending" | "completed" | "overdue";

export interface Assignment {
  id: string;
  title: string;
  subject: string;
  description: string;
  department: string;
  year: string;
  dueDate: string;
  totalMarks: number;
  createdBy: string;
  createdById: string;
  status: AssignmentStatus;
}

export type SubmissionStatus = "submitted" | "graded" | "pending";

export interface Submission {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  rollNumber: string;
  submissionDate: string;
  status: SubmissionStatus;
  grade?: number;
  feedback?: string;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  department: string;
  teacher: string;
  year: string;
}

export type NotificationType = "info" | "warning" | "success" | "error";

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  date: string;
}
