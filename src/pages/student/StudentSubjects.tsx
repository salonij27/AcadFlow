import { useState, useMemo } from "react";
import { BookOpen, ChevronDown, Award, User, Calendar } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import DashboardLayout from "@/layouts/DashboardLayout";
import { studentNavItems } from "@/layouts/navConfig";
import { subjects } from "@/data/mockData";
import { SubjectMiniBar } from "@/charts/Charts";
import StatusBadge from "@/components/StatusBadge";
import { formatDate, daysUntil } from "@/utils/helpers";

export default function StudentSubjects() {
  const { currentUser } = useAuth();
  const { assignments, submissions } = useData();
  const [selectedSubject, setSelectedSubject] = useState(subjects[0]?.name || "");

  const mySubjects = useMemo(() => {
    return subjects.filter(
      (s) => s.department === currentUser?.department && s.year === currentUser?.year
    );
  }, [currentUser]);

  const subjectAssignments = useMemo(() => {
    return assignments.filter((a) => a.subject === selectedSubject);
  }, [assignments, selectedSubject]);

  const subjectStats = useMemo(() => {
    const completed = subjectAssignments.filter((a) => a.status === "completed").length;
    const completion = subjectAssignments.length > 0 ? Math.round((completed / subjectAssignments.length) * 100) : 0;
    const subjectAssignmentIds = subjectAssignments.map((a) => a.id);
    const graded = submissions.filter(
      (s) => s.studentId === currentUser?.id && s.status === "graded" && subjectAssignmentIds.includes(s.assignmentId)
    );
    const avgGrade = graded.length > 0 ? Math.round(graded.reduce((sum, s) => sum + (s.grade || 0), 0) / graded.length) : 0;
    const teacher = subjects.find((s) => s.name === selectedSubject)?.teacher || "—";
    return { completed, completion, avgGrade, total: subjectAssignments.length, teacher };
  }, [subjectAssignments, submissions, currentUser, selectedSubject]);

  const subjectCompletionData = mySubjects.map((s) => {
    const sAssignments = assignments.filter((a) => a.subject === s.name);
    const sCompleted = sAssignments.filter((a) => a.status === "completed").length;
    return { subject: s.name.length > 12 ? s.name.substring(0, 12) + "..." : s.name, completion: sAssignments.length > 0 ? Math.round((sCompleted / sAssignments.length) * 100) : 0 };
  });

  const currentSubject = subjects.find((s) => s.name === selectedSubject);

  return (
    <DashboardLayout navItems={studentNavItems} roleLabel="Student">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Subjects</h1>
        <p className="text-slate-500 text-sm mt-1">Explore your subjects and their assignments.</p>
      </div>

      {/* Subject selector */}
      <div className="bg-white rounded-2xl border border-slate-100 p-4 mb-6 shadow-sm">
        <label className="block text-xs font-medium text-slate-500 mb-1.5">Select Subject</label>
        <div className="relative max-w-xs">
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="appearance-none w-full pl-3 pr-10 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition cursor-pointer font-medium text-slate-700"
          >
            {mySubjects.map((s) => (
              <option key={s.id} value={s.name}>
                {s.name} ({s.code})
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        {/* Subject info cards */}
        <div className="lg:col-span-2 grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
            <BookOpen className="w-5 h-5 text-blue-500 mb-3" />
            <p className="text-2xl font-bold text-slate-800">{subjectStats.total}</p>
            <p className="text-xs text-slate-400 mt-1">Total Assignments</p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
            <Award className="w-5 h-5 text-emerald-500 mb-3" />
            <p className="text-2xl font-bold text-slate-800">{subjectStats.completion}%</p>
            <p className="text-xs text-slate-400 mt-1">Completion</p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
            <Award className="w-5 h-5 text-amber-500 mb-3" />
            <p className="text-2xl font-bold text-slate-800">{subjectStats.avgGrade}%</p>
            <p className="text-xs text-slate-400 mt-1">Average Grade</p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
            <User className="w-5 h-5 text-violet-500 mb-3" />
            <p className="text-sm font-bold text-slate-800 leading-tight">{subjectStats.teacher}</p>
            <p className="text-xs text-slate-400 mt-1">Instructor</p>
          </div>
        </div>

        {/* Mini chart */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-700 mb-3">Subject Completion %</h3>
          <SubjectMiniBar data={subjectCompletionData} />
        </div>
      </div>

      {/* Subject assignments */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="text-sm font-semibold text-slate-700">
            {currentSubject?.name} Assignments
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">{currentSubject?.code} - {currentSubject?.department}</p>
        </div>
        <div className="divide-y divide-slate-50">
          {subjectAssignments.length === 0 ? (
            <div className="px-5 py-12 text-center">
              <p className="text-sm text-slate-400">No assignments for this subject yet.</p>
            </div>
          ) : (
            subjectAssignments.map((a) => {
              const days = daysUntil(a.dueDate);
              return (
                <div key={a.id} className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50/50 transition">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-700 truncate">{a.title}</p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(a.dueDate)}
                      </span>
                      <span>{a.totalMarks} marks</span>
                      {days >= 0 && a.status !== "completed" && (
                        <span className={days === 0 ? "text-amber-500" : ""}>{days}d left</span>
                      )}
                    </div>
                  </div>
                  <StatusBadge status={a.status} />
                </div>
              );
            })
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
