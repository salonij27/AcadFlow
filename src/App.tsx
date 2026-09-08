import { Suspense, lazy, useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { DataProvider } from "@/context/DataContext";
import { ToastProvider } from "@/context/ToastContext";
import ProtectedRoute from "@/routes/ProtectedRoute";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import { initializeDatabase } from "@/data/db";
import { GraduationCap } from "lucide-react";

const Login = lazy(() => import("@/pages/auth/Login"));
const StudentDashboard = lazy(() => import("@/pages/student/StudentDashboard"));
const StudentAssignments = lazy(() => import("@/pages/student/StudentAssignments"));
const StudentSubjects = lazy(() => import("@/pages/student/StudentSubjects"));
const StudentProgress = lazy(() => import("@/pages/student/StudentProgress"));
const StudentProfile = lazy(() => import("@/pages/student/StudentProfile"));
const TeacherDashboard = lazy(() => import("@/pages/teacher/TeacherDashboard"));
const TeacherAssignments = lazy(() => import("@/pages/teacher/TeacherAssignments"));
const TeacherSubmissions = lazy(() => import("@/pages/teacher/TeacherSubmissions"));
const TeacherGrading = lazy(() => import("@/pages/teacher/TeacherGrading"));
const TeacherProfile = lazy(() => import("@/pages/teacher/TeacherProfile"));

function PageFallback() {
  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="h-8 w-48 bg-slate-100 rounded-lg animate-pulse mb-6" />
        <LoadingSkeleton count={4} />
      </div>
    </div>
  );
}

function DbInitScreen() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-sm">
          <GraduationCap className="w-6 h-6 text-white" />
        </div>
        <div className="w-8 h-8 border-2 border-blue-200 border-t-blue-500 rounded-full animate-spin" />
        <p className="text-sm text-slate-400">Loading AcadFlow...</p>
      </div>
    </div>
  );
}

export default function App() {
  const [dbReady, setDbReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    initializeDatabase()
      .then(() => {
        if (mounted) setDbReady(true);
      })
      .catch((err) => {
        console.error("Database initialization failed:", err);
        if (mounted) setDbReady(true);
      });
    return () => {
      mounted = false;
    };
  }, []);

  if (!dbReady) {
    return <DbInitScreen />;
  }

  return (
    <AuthProvider>
      <DataProvider>
        <ToastProvider>
          <BrowserRouter>
            <Suspense fallback={<PageFallback />}>
              <Routes>
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/login" element={<Login />} />

                {/* Student routes */}
                <Route path="/student/dashboard" element={<ProtectedRoute role="student"><StudentDashboard /></ProtectedRoute>} />
                <Route path="/student/assignments" element={<ProtectedRoute role="student"><StudentAssignments /></ProtectedRoute>} />
                <Route path="/student/subjects" element={<ProtectedRoute role="student"><StudentSubjects /></ProtectedRoute>} />
                <Route path="/student/progress" element={<ProtectedRoute role="student"><StudentProgress /></ProtectedRoute>} />
                <Route path="/student/profile" element={<ProtectedRoute role="student"><StudentProfile /></ProtectedRoute>} />

                {/* Teacher routes */}
                <Route path="/teacher/dashboard" element={<ProtectedRoute role="teacher"><TeacherDashboard /></ProtectedRoute>} />
                <Route path="/teacher/assignments" element={<ProtectedRoute role="teacher"><TeacherAssignments /></ProtectedRoute>} />
                <Route path="/teacher/submissions" element={<ProtectedRoute role="teacher"><TeacherSubmissions /></ProtectedRoute>} />
                <Route path="/teacher/grading" element={<ProtectedRoute role="teacher"><TeacherGrading /></ProtectedRoute>} />
                <Route path="/teacher/profile" element={<ProtectedRoute role="teacher"><TeacherProfile /></ProtectedRoute>} />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/login" replace />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </ToastProvider>
      </DataProvider>
    </AuthProvider>
  );
}
