import Dexie, { type Table } from "dexie";
import type { Assignment, Submission, NotificationItem, User } from "@/types";
import { getEffectiveStatus } from "@/utils/helpers";

export interface UserRecord extends User {
  id: string;
}

export interface AssignmentRecord extends Assignment {
  id: string;
}

export interface SubmissionRecord extends Submission {
  id: string;
}

export interface NotificationRecord extends NotificationItem {
  id: string;
}

export class AcadFlowDB extends Dexie {
  users!: Table<UserRecord, string>;
  assignments!: Table<AssignmentRecord, string>;
  submissions!: Table<SubmissionRecord, string>;
  notifications!: Table<NotificationRecord, string>;

  constructor() {
    super("AcadFlowDB");
    this.version(1).stores({
      users: "id, email, role, name, department, year, rollNumber",
      assignments: "id, title, subject, department, dueDate, totalMarks, createdBy, createdById, status, year",
      submissions: "id, assignmentId, studentId, studentName, rollNumber, status, grade",
      notifications: "id, userId, read, type, date",
    });
  }
}

export const db = new AcadFlowDB();

const today = new Date();
const addDays = (d: number) => {
  const dt = new Date(today);
  dt.setDate(dt.getDate() + d);
  return dt.toISOString().split("T")[0];
};

const seedUsers: UserRecord[] = [
  {
    id: "t1",
    role: "teacher",
    name: "Dr. Jane Foster",
    email: "teacher1@demo.edu",
    password: "admin123",
    department: "Computer Science",
    subjects: ["Data Structures", "Object-Oriented Programming", "DBMS", "Operating Systems"],
  },
  {
    id: "t2",
    role: "teacher",
    name: "Prof. Robert Smith",
    email: "teacher2@demo.edu",
    password: "admin123",
    department: "Electrical Engineering",
    subjects: ["Digital Electronics", "Mathematics"],
  },
  {
    id: "s1",
    role: "student",
    name: "Alex Johnson",
    email: "student1@demo.edu",
    password: "pass123",
    rollNumber: "CS-101",
    year: "2nd Year",
    department: "Computer Science",
  },
  {
    id: "s2",
    role: "student",
    name: "Maria Garcia",
    email: "student2@demo.edu",
    password: "pass123",
    rollNumber: "EE-204",
    year: "2nd Year",
    department: "Electrical Engineering",
  },
];

const seedAssignments: AssignmentRecord[] = [
  { id: "a1", title: "Linked List Implementation", subject: "Data Structures", description: "Implement a doubly linked list with insertion, deletion, and traversal operations in C++.", department: "Computer Science", year: "2nd Year", dueDate: addDays(3), totalMarks: 100, createdBy: "Dr. Jane Foster", createdById: "t1", status: "pending" },
  { id: "a2", title: "Inheritance & Polymorphism", subject: "Object-Oriented Programming", description: "Create a class hierarchy demonstrating inheritance, method overriding, and polymorphism.", department: "Computer Science", year: "2nd Year", dueDate: addDays(7), totalMarks: 100, createdBy: "Dr. Jane Foster", createdById: "t1", status: "pending" },
  { id: "a3", title: "ER Diagram & Normalization", subject: "DBMS", description: "Design an ER diagram for a library system and normalize up to 3NF.", department: "Computer Science", year: "2nd Year", dueDate: addDays(-2), totalMarks: 50, createdBy: "Dr. Jane Foster", createdById: "t1", status: "pending" },
  { id: "a4", title: "Fourier Series Problems", subject: "Mathematics", description: "Solve problems on Fourier series expansion of periodic functions.", department: "Electrical Engineering", year: "2nd Year", dueDate: addDays(5), totalMarks: 100, createdBy: "Prof. Robert Smith", createdById: "t2", status: "pending" },
  { id: "a5", title: "Logic Gate Simulator", subject: "Digital Electronics", description: "Build a simple logic gate simulator supporting AND, OR, NOT, XOR gates.", department: "Electrical Engineering", year: "2nd Year", dueDate: addDays(10), totalMarks: 100, createdBy: "Prof. Robert Smith", createdById: "t2", status: "pending" },
  { id: "a6", title: "Process Scheduling Algorithms", subject: "Operating Systems", description: "Implement FCFS, SJF, and Round Robin scheduling algorithms.", department: "Computer Science", year: "2nd Year", dueDate: addDays(-5), totalMarks: 100, createdBy: "Dr. Jane Foster", createdById: "t1", status: "pending" },
  { id: "a7", title: "Binary Search Tree Lab", subject: "Data Structures", description: "Implement BST with insert, search, and delete operations.", department: "Computer Science", year: "2nd Year", dueDate: addDays(-10), totalMarks: 50, createdBy: "Dr. Jane Foster", createdById: "t1", status: "completed" },
  { id: "a8", title: "SQL Joins & Subqueries", subject: "DBMS", description: "Write SQL queries demonstrating inner, outer joins and correlated subqueries.", department: "Computer Science", year: "2nd Year", dueDate: addDays(-15), totalMarks: 100, createdBy: "Dr. Jane Foster", createdById: "t1", status: "completed" },
  { id: "a9", title: "Python Data Analysis", subject: "Python Programming", description: "Analyze a CSV dataset using pandas and create visualizations with matplotlib.", department: "Computer Science", year: "2nd Year", dueDate: addDays(1), totalMarks: 100, createdBy: "Dr. Jane Foster", createdById: "t1", status: "pending" },
  { id: "a10", title: "Multithreading Mini Project", subject: "Operating Systems", description: "Build a producer-consumer problem using semaphores and threads.", department: "Computer Science", year: "2nd Year", dueDate: addDays(14), totalMarks: 100, createdBy: "Dr. Jane Foster", createdById: "t1", status: "pending" },
];

const seedSubmissions: SubmissionRecord[] = [
  { id: "sub_a7_s1", assignmentId: "a7", studentId: "s1", studentName: "Alex Johnson", rollNumber: "CS-101", submissionDate: addDays(-12), status: "graded", grade: 88, feedback: "Good implementation. Edge cases handled well." },
  { id: "sub_a8_s1", assignmentId: "a8", studentId: "s1", studentName: "Alex Johnson", rollNumber: "CS-101", submissionDate: addDays(-16), status: "graded", grade: 92, feedback: "Excellent query optimization. Well structured." },
  { id: "sub_a7_s2", assignmentId: "a7", studentId: "s2", studentName: "Maria Garcia", rollNumber: "EE-204", submissionDate: addDays(-11), status: "graded", grade: 78, feedback: "Correct but missing some edge cases." },
  { id: "sub_a8_s2", assignmentId: "a8", studentId: "s2", studentName: "Maria Garcia", rollNumber: "EE-204", submissionDate: addDays(-14), status: "graded", grade: 85, feedback: "Good effort. Joins are correct." },
];

const seedNotifications: NotificationRecord[] = [
  { id: "n1", userId: "s1", title: "Assignment Due Tomorrow", message: "'Python Data Analysis' is due tomorrow.", type: "warning", read: false, date: addDays(0) },
  { id: "n2", userId: "s1", title: "Grade Published", message: "Your grade for 'SQL Joins & Subqueries' is now available.", type: "success", read: false, date: addDays(-1) },
  { id: "n3", userId: "s1", title: "New Assignment", message: "'Multithreading Mini Project' has been published.", type: "info", read: true, date: addDays(0) },
  { id: "n4", userId: "t1", title: "New Submission", message: "Alex Johnson submitted 'Binary Search Tree Lab'.", type: "info", read: false, date: addDays(-1) },
  { id: "n5", userId: "t1", title: "Assignment Deadline Near", message: "'Linked List Implementation' is due in 3 days.", type: "warning", read: false, date: addDays(0) },
  { id: "n6", userId: "t2", title: "New Submission", message: "Maria Garcia submitted 'Binary Search Tree Lab'.", type: "info", read: false, date: addDays(-1) },
];

let initPromise: Promise<void> | null = null;

export async function initializeDatabase(): Promise<void> {
  if (initPromise) return initPromise;

  initPromise = (async () => {
    try {
      const userCount = await db.users.count();
      if (userCount === 0) {
        await db.users.bulkAdd(seedUsers);
      }

      const assignmentCount = await db.assignments.count();
      if (assignmentCount === 0) {
        await db.assignments.bulkAdd(seedAssignments);
      }

      const submissionCount = await db.submissions.count();
      if (submissionCount === 0) {
        await db.submissions.bulkAdd(seedSubmissions);
      }

      const notificationCount = await db.notifications.count();
      if (notificationCount === 0) {
        await db.notifications.bulkAdd(seedNotifications);
      }
    } catch (err) {
      console.error("Database initialization failed:", err);
      initPromise = null;
      throw err;
    }
  })();

  return initPromise;
}

export async function findUserByEmail(email: string): Promise<UserRecord | undefined> {
  return db.users.where("email").equals(email.trim().toLowerCase()).first();
}

export { getEffectiveStatus };
