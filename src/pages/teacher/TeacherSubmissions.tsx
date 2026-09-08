import { useState, useMemo } from "react";
import { Search, Eye, MessageSquare } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import DashboardLayout from "@/layouts/DashboardLayout";
import { teacherNavItems } from "@/layouts/navConfig";
import SearchBar from "@/components/SearchBar";
import FilterDropdown from "@/components/FilterDropdown";
import ResponsiveTable from "@/components/ResponsiveTable";
import EmptyState from "@/components/EmptyState";
import Modal from "@/components/Modal";
import { formatDate } from "@/utils/helpers";
import type { Submission } from "@/types";

export default function TeacherSubmissions() {
  const { currentUser } = useAuth();
  const { assignments, submissions } = useData();
  const [search, setSearch] = useState("");
  const [assignmentFilter, setAssignmentFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewSubmission, setViewSubmission] = useState<Submission | null>(null);

  const myAssignmentIds = useMemo(() => {
    return new Set(assignments.filter((a) => a.createdById === currentUser?.id).map((a) => a.id));
  }, [assignments, currentUser]);

  const myAssignments = useMemo(() => {
    return assignments.filter((a) => a.createdById === currentUser?.id);
  }, [assignments, currentUser]);

  const filtered = useMemo(() => {
    let result = submissions.filter((s) => myAssignmentIds.has(s.assignmentId));
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (s) => s.studentName.toLowerCase().includes(q) || s.rollNumber.toLowerCase().includes(q)
      );
    }
    if (assignmentFilter !== "all") {
      result = result.filter((s) => s.assignmentId === assignmentFilter);
    }
    if (statusFilter !== "all") {
      result = result.filter((s) => s.status === statusFilter);
    }
    return result;
  }, [submissions, myAssignmentIds, search, assignmentFilter, statusFilter]);

  return (
    <DashboardLayout navItems={teacherNavItems} roleLabel="Teacher">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Student Submissions</h1>
        <p className="text-slate-500 text-sm mt-1">Review submissions across all your assignments.</p>
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-2xl border border-slate-100 p-4 mb-6 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-3">
          <SearchBar value={search} onChange={setSearch} placeholder="Search by student or roll number..." />
          <div className="flex gap-3 flex-1 lg:flex-none">
            <div className="flex-1 lg:w-56">
              <FilterDropdown
                value={assignmentFilter}
                onChange={setAssignmentFilter}
                options={[
                  { value: "all", label: "All Assignments" },
                  ...myAssignments.map((a) => ({ value: a.id, label: a.title.length > 25 ? a.title.substring(0, 25) + "..." : a.title })),
                ]}
              />
            </div>
            <div className="flex-1 lg:w-40">
              <FilterDropdown
                value={statusFilter}
                onChange={setStatusFilter}
                options={[
                  { value: "all", label: "All Status" },
                  { value: "submitted", label: "Submitted" },
                  { value: "graded", label: "Graded" },
                ]}
              />
            </div>
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100">
          <EmptyState
            icon={<Search className="w-8 h-8 text-slate-300" />}
            title="No submissions found"
            description="Students haven't submitted any work matching your filters yet."
          />
        </div>
      ) : (
        <ResponsiveTable headers={["Student", "Roll Number", "Assignment", "Status", "Date", "Grade", "Actions"]}>
          {filtered.map((s) => {
            const assignment = assignments.find((a) => a.id === s.assignmentId);
            return (
              <tr key={s.id} className="hover:bg-slate-50/50 transition">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-semibold text-slate-500 flex-shrink-0">
                      {s.studentName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </div>
                    <span className="text-sm font-medium text-slate-700">{s.studentName}</span>
                  </div>
                </td>
                <td className="px-5 py-3.5 text-sm text-slate-600">{s.rollNumber}</td>
                <td className="px-5 py-3.5 text-sm text-slate-600 max-w-xs truncate">{assignment?.title || "—"}</td>
                <td className="px-5 py-3.5">
                  {s.status === "graded" ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Graded
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                      Submitted
                    </span>
                  )}
                </td>
                <td className="px-5 py-3.5 text-sm text-slate-600 whitespace-nowrap">{formatDate(s.submissionDate)}</td>
                <td className="px-5 py-3.5">
                  {s.grade != null ? (
                    <span className="text-sm font-semibold text-slate-700">
                      {s.grade}<span className="text-slate-400 font-normal">/{assignment?.totalMarks}</span>
                    </span>
                  ) : (
                    <span className="text-sm text-slate-400">—</span>
                  )}
                </td>
                <td className="px-5 py-3.5">
                  <button
                    onClick={() => setViewSubmission(s)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            );
          })}
        </ResponsiveTable>
      )}

      {/* View submission modal */}
      <Modal open={!!viewSubmission} onClose={() => setViewSubmission(null)} title="Submission Details" size="md">
        {viewSubmission && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-sm font-semibold text-slate-500">
                {viewSubmission.studentName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
              </div>
              <div>
                <p className="text-base font-semibold text-slate-800">{viewSubmission.studentName}</p>
                <p className="text-sm text-slate-400">{viewSubmission.rollNumber}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 rounded-xl p-3">
                <p className="text-xs text-slate-400">Assignment</p>
                <p className="text-sm font-medium text-slate-700 mt-0.5">
                  {assignments.find((a) => a.id === viewSubmission.assignmentId)?.title || "—"}
                </p>
              </div>
              <div className="bg-slate-50 rounded-xl p-3">
                <p className="text-xs text-slate-400">Submission Date</p>
                <p className="text-sm font-medium text-slate-700 mt-0.5">{formatDate(viewSubmission.submissionDate)}</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-3">
                <p className="text-xs text-slate-400">Status</p>
                <p className="text-sm font-medium text-slate-700 mt-0.5 capitalize">{viewSubmission.status}</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-3">
                <p className="text-xs text-slate-400">Grade</p>
                <p className="text-sm font-medium text-slate-700 mt-0.5">
                  {viewSubmission.grade != null ? `${viewSubmission.grade}/${assignments.find((a) => a.id === viewSubmission.assignmentId)?.totalMarks}` : "Not graded yet"}
                </p>
              </div>
            </div>
            {viewSubmission.feedback && (
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                <p className="text-xs text-blue-600 font-medium flex items-center gap-1.5 mb-1">
                  <MessageSquare className="w-3.5 h-3.5" />
                  Feedback
                </p>
                <p className="text-sm text-slate-700">{viewSubmission.feedback}</p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </DashboardLayout>
  );
}
