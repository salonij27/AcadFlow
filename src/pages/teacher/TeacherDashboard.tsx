import { useMemo } from "react";
import { Link } from "react-router-dom";
import { BookOpen, ClipboardList, FileQuestion, Users, ArrowRight, Calendar, Clock } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import DashboardLayout from "@/layouts/DashboardLayout";
import { teacherNavItems } from "@/layouts/navConfig";
import DashboardCard from "@/components/DashboardCard";
import { formatDate, daysUntil } from "@/utils/helpers";
import { subjects, mockStudents } from "@/data/mockData";

export default function TeacherDashboard() {
  const { currentUser } = useAuth();
  const { assignments, submissions } = useData();

  const stats = useMemo(() => {
    const myAssignments = assignments.filter((a) => a.createdById === currentUser?.id);
    const active = myAssignments.filter((a) => a.status !== "completed").length;
    const pendingReviews = submissions.filter((s) => s.status === "submitted").length;
    const mySubjects = subjects.filter((s) => s.teacher === currentUser?.name);
    const studentsCount = mockStudents.filter(
      (s) => mySubjects.some((sub) => sub.department === s.department)
    ).length;
    return { subjects: mySubjects.length, active, pendingReviews, students: studentsCount, myAssignments };
  }, [assignments, submissions, currentUser]);

  const upcomingDeadlines = useMemo(() => {
    return stats.myAssignments
      .filter((a) => a.status !== "completed")
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
      .slice(0, 5);
  }, [stats.myAssignments]);

  const recentSubmissions = useMemo(() => {
    return submissions.slice(-5).reverse();
  }, [submissions]);

  return (
    <DashboardLayout navItems={teacherNavItems} roleLabel="Teacher">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">
          Welcome, {currentUser?.name}.
        </h1>
        <p className="text-slate-500 text-sm mt-1">Here's your teaching overview for today.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <DashboardCard icon={BookOpen} label="Subjects Taught" value={stats.subjects} color="blue" delay={0} />
        <DashboardCard icon={ClipboardList} label="Active Assignments" value={stats.active} color="amber" delay={60} />
        <DashboardCard icon={FileQuestion} label="Pending Reviews" value={stats.pendingReviews} color="red" delay={120} />
        <DashboardCard icon={Users} label="Students" value={stats.students} color="emerald" delay={180} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Upcoming deadlines */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-500" />
              Upcoming Deadlines
            </h3>
            <Link to="/teacher/assignments" className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
              Manage <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="space-y-2">
            {upcomingDeadlines.length === 0 ? (
              <div className="py-8 text-center">
                <Clock className="w-8 h-8 text-slate-200 mx-auto mb-2" />
                <p className="text-sm text-slate-400">No upcoming deadlines.</p>
              </div>
            ) : (
              upcomingDeadlines.map((a) => {
                const days = daysUntil(a.dueDate);
                return (
                  <div key={a.id} className="flex items-center gap-4 py-2.5 px-3 rounded-xl hover:bg-slate-50 transition">
                    <div className={`w-2 h-10 rounded-full ${days < 0 ? "bg-red-400" : days === 0 ? "bg-amber-400" : "bg-blue-400"}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-700 truncate">{a.title}</p>
                      <p className="text-xs text-slate-400">{a.subject}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-slate-600">{formatDate(a.dueDate)}</p>
                      <p className={`text-xs ${days < 0 ? "text-red-500" : days === 0 ? "text-amber-500" : "text-slate-400"}`}>
                        {days < 0 ? `${Math.abs(days)}d overdue` : days === 0 ? "Due today" : `${days}d left`}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Recent submissions */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-500" />
              Recent Submissions
            </h3>
            <Link to="/teacher/submissions" className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="space-y-2">
            {recentSubmissions.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-sm text-slate-400">No submissions yet.</p>
              </div>
            ) : (
              recentSubmissions.map((s) => {
                const assignment = assignments.find((a) => a.id === s.assignmentId);
                return (
                  <div key={s.id} className="flex items-center gap-3 py-2.5 px-3 rounded-xl hover:bg-slate-50 transition">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-semibold text-slate-500 flex-shrink-0">
                      {s.studentName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-700 truncate">{s.studentName}</p>
                      <p className="text-xs text-slate-400 truncate">{assignment?.title || "—"}</p>
                    </div>
                    {s.status === "graded" ? (
                      <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                        {s.grade}/{assignment?.totalMarks}
                      </span>
                    ) : (
                      <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">
                        Pending
                      </span>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
