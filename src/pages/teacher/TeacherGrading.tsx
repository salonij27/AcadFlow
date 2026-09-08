import { useState, useMemo } from "react";
import { Save, Award, MessageSquare, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import DashboardLayout from "@/layouts/DashboardLayout";
import { teacherNavItems } from "@/layouts/navConfig";
import FilterDropdown from "@/components/FilterDropdown";
import EmptyState from "@/components/EmptyState";
import ResponsiveTable from "@/components/ResponsiveTable";
import { useToast } from "@/context/ToastContext";
import { formatDate } from "@/utils/helpers";

export default function TeacherGrading() {
  const { currentUser } = useAuth();
  const { assignments, submissions, saveGrade, addNotification } = useData();
  const { showToast } = useToast();
  const [selectedAssignment, setSelectedAssignment] = useState("");
  const [selectedStudent, setSelectedStudent] = useState("");
  const [grade, setGrade] = useState("");
  const [feedback, setFeedback] = useState("");

  const myAssignments = useMemo(() => {
    return assignments.filter((a) => a.createdById === currentUser?.id);
  }, [assignments, currentUser]);

  const assignmentSubmissions = useMemo(() => {
    if (!selectedAssignment) return [];
    return submissions.filter((s) => s.assignmentId === selectedAssignment);
  }, [submissions, selectedAssignment]);

  const currentAssignment = assignments.find((a) => a.id === selectedAssignment);
  const currentSubmission = assignmentSubmissions.find((s) => s.studentId === selectedStudent);

  const handleSaveGrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssignment || !selectedStudent || grade === "") {
      showToast("Please select assignment, student, and enter a grade.", "error");
      return;
    }
    const gradeNum = Number(grade);
    if (gradeNum < 0 || (currentAssignment && gradeNum > currentAssignment.totalMarks)) {
      showToast(`Grade must be between 0 and ${currentAssignment?.totalMarks}.`, "error");
      return;
    }
    saveGrade(selectedAssignment, selectedStudent, gradeNum, feedback);
    addNotification({
      userId: selectedStudent,
      title: "Grade Published",
      message: `Your grade for '${currentAssignment?.title}' is now available.`,
      type: "success",
    });
    showToast("Grade Saved Successfully!", "success");
    setGrade("");
    setFeedback("");
    setSelectedStudent("");
  };

  return (
    <DashboardLayout navItems={teacherNavItems} roleLabel="Teacher">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Grading System</h1>
        <p className="text-slate-500 text-sm mt-1">Grade student submissions and provide feedback.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Grading form */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-700 mb-4">Grade a Submission</h3>
          <form onSubmit={handleSaveGrade} className="space-y-4">
            <FilterDropdown
              label="Select Assignment"
              value={selectedAssignment}
              onChange={(v) => {
                setSelectedAssignment(v);
                setSelectedStudent("");
                setGrade("");
                setFeedback("");
              }}
              options={[
                { value: "", label: "Choose assignment..." },
                ...myAssignments.map((a) => ({ value: a.id, label: a.title.length > 30 ? a.title.substring(0, 30) + "..." : a.title })),
              ]}
            />

            {selectedAssignment && (
              <FilterDropdown
                label="Select Student"
                value={selectedStudent}
                onChange={(v) => {
                  setSelectedStudent(v);
                  const sub = assignmentSubmissions.find((s) => s.studentId === v);
                  if (sub) {
                    setGrade(sub.grade?.toString() || "");
                    setFeedback(sub.feedback || "");
                  }
                }}
                options={[
                  { value: "", label: "Choose student..." },
                  ...assignmentSubmissions.map((s) => ({ value: s.studentId, label: `${s.studentName} (${s.rollNumber})` })),
                ]}
              />
            )}

            {selectedStudent && currentSubmission && (
              <>
                <div className="bg-slate-50 rounded-xl p-3 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Student</span>
                    <span className="font-medium text-slate-600">{currentSubmission.studentName}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Submitted</span>
                    <span className="font-medium text-slate-600">{formatDate(currentSubmission.submissionDate)}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Current Status</span>
                    <span className="font-medium text-slate-600 capitalize">{currentSubmission.status}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Marks <span className="text-slate-400">/ {currentAssignment?.totalMarks}</span>
                  </label>
                  <div className="relative">
                    <Award className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="number"
                      value={grade}
                      onChange={(e) => setGrade(e.target.value)}
                      min={0}
                      max={currentAssignment?.totalMarks}
                      placeholder="Enter marks"
                      className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Feedback</label>
                  <div className="relative">
                    <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                    <textarea
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      rows={3}
                      placeholder="Provide feedback to the student..."
                      className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition resize-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition shadow-sm flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Save Grade
                </button>
              </>
            )}

            {selectedAssignment && assignmentSubmissions.length === 0 && (
              <div className="py-6 text-center">
                <p className="text-sm text-slate-400">No submissions for this assignment yet.</p>
              </div>
            )}
          </form>
        </div>

        {/* Graded submissions table */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100">
              <h3 className="text-sm font-semibold text-slate-700">
                {selectedAssignment ? `Submissions for: ${currentAssignment?.title}` : "All Graded Submissions"}
              </h3>
            </div>
            {assignmentSubmissions.length === 0 ? (
              <EmptyState
                icon={<CheckCircle2 className="w-8 h-8 text-slate-300" />}
                title="No submissions to display"
                description="Select an assignment to view and grade submissions."
              />
            ) : (
              <ResponsiveTable headers={["Student", "Roll No.", "Date", "Grade", "Feedback"]}>
                {assignmentSubmissions.map((s) => (
                  <tr key={s.id} className={`hover:bg-slate-50/50 transition ${s.studentId === selectedStudent ? "bg-blue-50/30" : ""}`}>
                    <td className="px-5 py-3.5 text-sm font-medium text-slate-700">{s.studentName}</td>
                    <td className="px-5 py-3.5 text-sm text-slate-600">{s.rollNumber}</td>
                    <td className="px-5 py-3.5 text-sm text-slate-600 whitespace-nowrap">{formatDate(s.submissionDate)}</td>
                    <td className="px-5 py-3.5">
                      {s.grade != null ? (
                        <span className="text-sm font-semibold text-slate-700">
                          {s.grade}<span className="text-slate-400 font-normal">/{currentAssignment?.totalMarks}</span>
                        </span>
                      ) : (
                        <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">Not graded</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-sm text-slate-500 max-w-xs truncate">{s.feedback || "—"}</td>
                  </tr>
                ))}
              </ResponsiveTable>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
