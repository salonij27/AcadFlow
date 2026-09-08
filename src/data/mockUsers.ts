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
    name: "Dr. Anil Patil",
    email: "teacher1@demo.edu",
    password: "admin123",
    department: "Computer Science",
    subjects: ["Data Structures", "Object-Oriented Programming", "DBMS", "Operating Systems"],
  },
  {
    id: "t2",
    role: "teacher",
    name: "Prof. Sunita Kulkarni",
    email: "teacher2@demo.edu",
    password: "admin123",
    department: "Electrical Engineering",
    subjects: ["Digital Electronics", "Mathematics"],
  },
  {
    id: "s1",
    role: "student",
    name: "Nishant Walse",
    email: "student1@demo.edu",
    password: "pass123",
    rollNumber: "2RA-44",
    year: "2nd Year",
    department: "Computer Science",
  },
  {
    id: "s2",
    role: "student",
    name: "Roshan Chavhan",
    email: "roshan@demo.edu",
    password: "pass123",
    rollNumber: "2RA-41",
    year: "2nd Year",
    department: "Computer Science",
  },
  {
    id: "s3",
    role: "student",
    name: "Saloni Jaiswal",
    email: "saloni@demo.edu",
    password: "pass123",
    rollNumber: "2RA-42",
    year: "2nd Year",
    department: "Computer Science",
  },
  {
    id: "s4",
    role: "student",
    name: "Dhanashri Hulhule",
    email: "dhanashri@demo.edu",
    password: "pass123",
    rollNumber: "2RA-43",
    year: "2nd Year",
    department: "Computer Science",
  },
];

export default users;
