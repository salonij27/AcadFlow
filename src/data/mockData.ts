import type { Assignment, Submission, Subject, NotificationItem } from "@/types";

export const subjects: Subject[] = [
  { id: "sub1", name: "Data Structures", code: "CS201", department: "Computer Science", teacher: "Dr. Jane Foster", year: "2nd Year" },
  { id: "sub2", name: "Object-Oriented Programming", code: "CS202", department: "Computer Science", teacher: "Dr. Jane Foster", year: "2nd Year" },
  { id: "sub3", name: "DBMS", code: "CS203", department: "Computer Science", teacher: "Dr. Jane Foster", year: "2nd Year" },
  { id: "sub4", name: "Mathematics", code: "MA201", department: "Electrical Engineering", teacher: "Prof. Robert Smith", year: "2nd Year" },
  { id: "sub5", name: "Digital Electronics", code: "EE201", department: "Electrical Engineering", teacher: "Prof. Robert Smith", year: "2nd Year" },
  { id: "sub6", name: "Operating Systems", code: "CS204", department: "Computer Science", teacher: "Dr. Jane Foster", year: "2nd Year" },
  { id: "sub7", name: "Python Programming", code: "CS205", department: "Computer Science", teacher: "Dr. Jane Foster", year: "2nd Year" },
];

const today = new Date();
const addDays = (d: number) => {
  const dt = new Date(today);
  dt.setDate(dt.getDate() + d);
  return dt.toISOString().split("T")[0];
};

export const assignments: Assignment[] = [
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

export const submissions: Submission[] = [
  { id: "sub_a7_s1", assignmentId: "a7", studentId: "s1", studentName: "Alex Johnson", rollNumber: "CS-101", submissionDate: addDays(-12), status: "graded", grade: 88, feedback: "Good implementation. Edge cases handled well." },
  { id: "sub_a8_s1", assignmentId: "a8", studentId: "s1", studentName: "Alex Johnson", rollNumber: "CS-101", submissionDate: addDays(-16), status: "graded", grade: 92, feedback: "Excellent query optimization. Well structured." },
  { id: "sub_a7_s2", assignmentId: "a7", studentId: "s2", studentName: "Maria Garcia", rollNumber: "EE-204", submissionDate: addDays(-11), status: "graded", grade: 78, feedback: "Correct but missing some edge cases." },
  { id: "sub_a8_s2", assignmentId: "a8", studentId: "s2", studentName: "Maria Garcia", rollNumber: "EE-204", submissionDate: addDays(-14), status: "graded", grade: 85, feedback: "Good effort. Joins are correct." },
];

export const notifications: NotificationItem[] = [
  { id: "n1", userId: "s1", title: "Assignment Due Tomorrow", message: "'Python Data Analysis' is due tomorrow.", type: "warning", read: false, date: addDays(0) },
  { id: "n2", userId: "s1", title: "Grade Published", message: "Your grade for 'SQL Joins & Subqueries' is now available.", type: "success", read: false, date: addDays(-1) },
  { id: "n3", userId: "s1", title: "New Assignment", message: "'Multithreading Mini Project' has been published.", type: "info", read: true, date: addDays(0) },
  { id: "n4", userId: "t1", title: "New Submission", message: "Alex Johnson submitted 'Binary Search Tree Lab'.", type: "info", read: false, date: addDays(-1) },
  { id: "n5", userId: "t1", title: "Assignment Deadline Near", message: "'Linked List Implementation' is due in 3 days.", type: "warning", read: false, date: addDays(0) },
  { id: "n6", userId: "t2", title: "New Submission", message: "Maria Garcia submitted 'Binary Search Tree Lab'.", type: "info", read: false, date: addDays(-1) },
];

export const mockStudents = [
  { id: "s1", name: "Alex Johnson", rollNumber: "CS-101", department: "Computer Science", year: "2nd Year", email: "student1@demo.edu" },
  { id: "s2", name: "Maria Garcia", rollNumber: "EE-204", department: "Electrical Engineering", year: "2nd Year", email: "student2@demo.edu" },
  { id: "s3", name: "James Wilson", rollNumber: "CS-102", department: "Computer Science", year: "2nd Year", email: "student3@demo.edu" },
  { id: "s4", name: "Sarah Lee", rollNumber: "CS-103", department: "Computer Science", year: "2nd Year", email: "student4@demo.edu" },
  { id: "s5", name: "Michael Chen", rollNumber: "EE-205", department: "Electrical Engineering", year: "2nd Year", email: "student5@demo.edu" },
  { id: "s6", name: "Emily Davis", rollNumber: "EE-206", department: "Electrical Engineering", year: "2nd Year", email: "student6@demo.edu" },
];
