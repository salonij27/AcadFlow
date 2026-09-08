import type { Assignment, Submission } from "@/types";

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function daysUntil(dateStr: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dateStr);
  due.setHours(0, 0, 0, 0);
  return Math.round((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

export function getEffectiveStatus(assignment: Assignment): Assignment["status"] {
  if (assignment.status === "completed") return "completed";
  if (daysUntil(assignment.dueDate) < 0) return "overdue";
  return "pending";
}

export function getStudentSubmissions(studentId: string, submissions: Submission[]): Submission[] {
  return submissions.filter((s) => s.studentId === studentId);
}

export function getGradedSubmissions(studentId: string, submissions: Submission[]): Submission[] {
  return submissions.filter((s) => s.studentId === studentId && s.status === "graded");
}

export function calculateAverageGrade(studentId: string, submissions: Submission[]): number {
  const graded = getGradedSubmissions(studentId, submissions);
  if (graded.length === 0) return 0;
  const total = graded.reduce((sum, s) => sum + (s.grade || 0), 0);
  return Math.round(total / graded.length);
}

export function getSubjectAverage(studentId: string, subject: string, assignments: Assignment[], submissions: Submission[]): number {
  const subjectAssignmentIds = assignments.filter((a) => a.subject === subject).map((a) => a.id);
  const graded = submissions.filter(
    (s) => s.studentId === studentId && s.status === "graded" && subjectAssignmentIds.includes(s.assignmentId)
  );
  if (graded.length === 0) return 0;
  return Math.round(graded.reduce((sum, s) => sum + (s.grade || 0), 0) / graded.length);
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
}
