import { useMemo } from "react";
import { TrendingUp, PieChart as PieIcon, BarChart3, LineChart as LineIcon } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import DashboardLayout from "@/layouts/DashboardLayout";
import { studentNavItems } from "@/layouts/navConfig";
import { CompletionPieChart, SubjectMarksBarChart, MonthlyCompletionLineChart } from "@/charts/Charts";
import { getSubjectAverage } from "@/utils/helpers";
import { subjects } from "@/data/mockData";

export default function StudentProgress() {
  const { currentUser } = useAuth();
  const { assignments, submissions } = useData();

  const myAssignments = useMemo(() => {
    return assignments.filter(
      (a) => a.department === currentUser?.department && a.year === currentUser?.year
    );
  }, [assignments, currentUser]);

  const pieData = useMemo(() => {
    const completed = myAssignments.filter((a) => a.status === "completed").length;
    const pending = myAssignments.filter((a) => a.status === "pending").length;
    const overdue = myAssignments.filter((a) => a.status === "overdue").length;
    return [
      { name: "Completed", value: completed },
      { name: "Pending", value: pending },
      { name: "Overdue", value: overdue },
    ];
  }, [myAssignments]);

  const subjectMarksData = useMemo(() => {
    const mySubjects = subjects.filter(
      (s) => s.department === currentUser?.department && s.year === currentUser?.year
    );
    return mySubjects.map((s) => ({
      subject: s.name.length > 15 ? s.name.substring(0, 15) + "..." : s.name,
      marks: getSubjectAverage(currentUser?.id || "", s.name, assignments, submissions),
    }));
  }, [assignments, submissions, currentUser]);

  const monthlyData = useMemo(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
    return months.map((m, i) => ({
      month: m,
      assignments: Math.max(0, 2 + Math.round(Math.sin(i + 1) * 2) + (i % 2)),
    }));
  }, []);

  const overallStats = useMemo(() => {
    const completed = myAssignments.filter((a) => a.status === "completed").length;
    const graded = submissions.filter((s) => s.studentId === currentUser?.id && s.status === "graded");
    const avgGrade = graded.length > 0 ? Math.round(graded.reduce((sum, s) => sum + (s.grade || 0), 0) / graded.length) : 0;
    const completion = myAssignments.length > 0 ? Math.round((completed / myAssignments.length) * 100) : 0;
    return { completed, total: myAssignments.length, avgGrade, completion };
  }, [myAssignments, submissions, currentUser]);

  return (
    <DashboardLayout navItems={studentNavItems} roleLabel="Student">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Progress Report</h1>
        <p className="text-slate-500 text-sm mt-1">Visualize your academic performance and trends.</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
          <p className="text-xs text-slate-400 mb-1">Overall Completion</p>
          <p className="text-3xl font-bold text-blue-600">{overallStats.completion}%</p>
          <div className="mt-2 h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 rounded-full transition-all duration-700" style={{ width: `${overallStats.completion}%` }} />
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
          <p className="text-xs text-slate-400 mb-1">Completed</p>
          <p className="text-3xl font-bold text-emerald-600">{overallStats.completed}</p>
          <p className="text-xs text-slate-400 mt-2">out of {overallStats.total} total</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
          <p className="text-xs text-slate-400 mb-1">Average Grade</p>
          <p className="text-3xl font-bold text-amber-600">{overallStats.avgGrade}%</p>
          <p className="text-xs text-slate-400 mt-2">across all subjects</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
          <p className="text-xs text-slate-400 mb-1">Graded Assignments</p>
          <p className="text-3xl font-bold text-violet-600">
            {submissions.filter((s) => s.studentId === currentUser?.id && s.status === "graded").length}
          </p>
          <p className="text-xs text-slate-400 mt-2">with feedback</p>
        </div>
      </div>

      {/* Charts grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Pie chart */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
              <PieIcon className="w-4 h-4 text-emerald-500" />
            </div>
            <h3 className="text-sm font-semibold text-slate-700">Assignment Completion</h3>
          </div>
          <CompletionPieChart data={pieData} />
        </div>

        {/* Bar chart */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-blue-500" />
            </div>
            <h3 className="text-sm font-semibold text-slate-700">Subject-wise Marks</h3>
          </div>
          <SubjectMarksBarChart data={subjectMarksData} />
        </div>

        {/* Line chart */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm lg:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center">
              <LineIcon className="w-4 h-4 text-violet-500" />
            </div>
            <h3 className="text-sm font-semibold text-slate-700">Monthly Assignment Completion Trend</h3>
          </div>
          <MonthlyCompletionLineChart data={monthlyData} />
        </div>
      </div>
    </DashboardLayout>
  );
}
