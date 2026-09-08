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

const users: User[] = [
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

export default users;
