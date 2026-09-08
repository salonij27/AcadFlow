import type { LucideIcon } from "lucide-react";
import { LayoutDashboard, ClipboardList, BookOpen, TrendingUp, User } from "lucide-react";

export const studentNavItems: { to: string; label: string; icon: LucideIcon }[] = [
  { to: "/student/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/student/assignments", label: "Assignments", icon: ClipboardList },
  { to: "/student/subjects", label: "Subjects", icon: BookOpen },
  { to: "/student/progress", label: "Progress Report", icon: TrendingUp },
  { to: "/student/profile", label: "Profile", icon: User },
];

export const teacherNavItems: { to: string; label: string; icon: LucideIcon }[] = [
  { to: "/teacher/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/teacher/assignments", label: "Assignment Manager", icon: ClipboardList },
  { to: "/teacher/submissions", label: "Student Submissions", icon: BookOpen },
  { to: "/teacher/grading", label: "Grading", icon: TrendingUp },
  { to: "/teacher/profile", label: "Profile", icon: User },
];
