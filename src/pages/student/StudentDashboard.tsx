import { useMemo } from "react";
import { Link } from "react-router-dom";
import { ClipboardList, CheckCircle2, Clock, AlertTriangle, TrendingUp, ArrowRight, Calendar } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import DashboardLayout from "@/layouts/DashboardLayout";
import { studentNavItems } from "@/layouts/navConfig";
import DashboardCard from "@/components/DashboardCard";
import AssignmentCard from "@/components/AssignmentCard";
import { CompletionPieChart, ProgressRadialChart } from "@/charts/Charts";
import { calculateAverageGrade, formatDate, daysUntil } from "@/utils/helpers";

export default function StudentDashboard() {
  const { currentUser } = useAuth();
  const { assignments, submissions } = useData();

  const stats = useMemo(() => {
    const studentAssignments = assignments.filter(
      (a) => a.department === currentUser?.department && a.year === currentUser?.year
    );
    const completed = studentAssignments.filter((a) => a.status === "completed").length;
    const pending = studentAssignments.filter((a) => a.status === "pending").length;
    const overdue = studentAssignments.filter((a) => a.status === "overdue").length;
    const avgGrade = calculateAverageGrade(currentUser?.id || "", submissions);
    const completionPct = studentAssignments.length > 0 ? Math.round((completed / studentAssignments.length) * 100) : 0;

    return { total: studentAssignments.length, completed, pending, overdue, avgGrade, completionPct, studentAssignments };
  }, [assignments, submissions, currentUser]);

  const upcomingAssignments = useMemo(() => {
    return stats.studentAssignments
      .filter((a) => a.status !== "completed")
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
      .slice(0, 4);
  }, [stats.studentAssignments]);

  const pieData = [
    { name: "Completed", value: stats.completed },
    { name: "Pending", value: stats.pending },
    { name: "Overdue", value: stats.overdue },
  ];

  return (
    <DashboardLayout navItems={studentNavItems} roleLabel="Student">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">
          Welcome back, {currentUser?.name?.split(" ")[0]}.
        </h1>
        <p className="text-slate-500 text-sm mt-1">Here's your academic overview for today.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <DashboardCard icon={ClipboardList} label="Total Assignments" value={stats.total} color="blue" delay={0} />
        <DashboardCard icon={CheckCircle2} label="Completed" value={stats.completed} color="emerald" delay={60} />
        <DashboardCard icon={Clock} label="Pending" value={stats.pending} color="amber" delay={120} />
        <DashboardCard icon={AlertTriangle} label="Overdue" value={stats.overdue} color="red" delay={180} />
        <DashboardCard icon={TrendingUp} label="Average Grade" value={`${stats.avgGrade}%`} color="violet" delay={240} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        {/* Upcoming assignments */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-800">Upcoming Assignments</h2>
            <Link to="/student/assignments" className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {upcomingAssignments.length > 0 ? (
              upcomingAssignments.map((a) => <AssignmentCard key={a.id} assignment={a} />)
            ) : (
              <div className="col-span-2 bg-white rounded-2xl border border-slate-100 p-12 text-center">
                <CheckCircle2 className="w-10 h-10 text-emerald-300 mx-auto mb-3" />
                <p className="text-sm text-slate-400">All caught up! No pending assignments.</p>
              </div>
            )}
          </div>
        </div>

        {/* Completion overview */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-700 mb-2">Completion Overview</h3>
            <div className="relative">
              <ProgressRadialChart value={stats.completionPct} />
              <div className="absolute inset-0 flex items-center justify-center" style={{ bottom: "40px" }}>
                <div className="text-center">
                  <p className="text-3xl font-bold text-slate-800">{stats.completionPct}%</p>
                  <p className="text-xs text-slate-400">Completed</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-700 mb-4">Assignment Distribution</h3>
            <CompletionPieChart data={pieData} />
          </div>
        </div>
      </div>

      {/* Deadlines timeline */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-blue-500" />
          Upcoming Deadlines
        </h3>
        <div className="space-y-2">
          {stats.studentAssignments
            .filter((a) => a.status !== "completed")
            .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
            .slice(0, 5)
            .map((a) => {
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
            })}
        </div>
      </div>
    </DashboardLayout>
  );
}
