import type { Assignment } from "@/types";
import StatusBadge from "./StatusBadge";
import { Calendar, BookOpen, User, Award, CheckCircle2, Clock } from "lucide-react";
import { formatDate, daysUntil } from "@/utils/helpers";
import { useData } from "@/context/DataContext";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";

interface AssignmentCardProps {
  assignment: Assignment;
  onComplete?: (id: string) => void;
}

export default function AssignmentCard({ assignment, onComplete }: AssignmentCardProps) {
  const { submissions, markCompleted, addNotification } = useData();
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  const days = daysUntil(assignment.dueDate);
  const hasSubmitted = submissions.some(
    (s) => s.assignmentId === assignment.id && s.studentId === currentUser?.id
  );

  const handleComplete = () => {
    if (onComplete) {
      onComplete(assignment.id);
    } else if (currentUser?.role === "student") {
      markCompleted(assignment.id, currentUser.id, currentUser.name, currentUser.rollNumber || "");
      addNotification({
        userId: currentUser.id,
        title: "Assignment Marked Completed",
        message: `You marked '${assignment.title}' as completed.`,
        type: "success",
      });
      showToast("Assignment marked as completed!", "success");
    }
  };

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
              {assignment.subject}
            </span>
            <StatusBadge status={assignment.status} />
          </div>
          <h3 className="text-base font-semibold text-slate-800 group-hover:text-blue-600 transition">
            {assignment.title}
          </h3>
        </div>
      </div>
      <p className="text-sm text-slate-500 line-clamp-2 mb-4">{assignment.description}</p>
      <div className="grid grid-cols-2 gap-3 mb-4 text-xs">
        <div className="flex items-center gap-1.5 text-slate-500">
          <Calendar className="w-3.5 h-3.5" />
          {formatDate(assignment.dueDate)}
        </div>
        <div className="flex items-center gap-1.5 text-slate-500">
          <Award className="w-3.5 h-3.5" />
          {assignment.totalMarks} marks
        </div>
        <div className="flex items-center gap-1.5 text-slate-500">
          <BookOpen className="w-3.5 h-3.5" />
          {assignment.department}
        </div>
        <div className="flex items-center gap-1.5 text-slate-500">
          <User className="w-3.5 h-3.5" />
          {assignment.createdBy}
        </div>
      </div>
      <div className="flex items-center justify-between pt-3 border-t border-slate-50">
        {assignment.status === "completed" ? (
          <span className="inline-flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
            <CheckCircle2 className="w-4 h-4" />
            Completed
          </span>
        ) : days < 0 ? (
          <span className="inline-flex items-center gap-1.5 text-xs text-red-600 font-medium">
            <Clock className="w-4 h-4" />
            {Math.abs(days)} days overdue
          </span>
        ) : days === 0 ? (
          <span className="inline-flex items-center gap-1.5 text-xs text-amber-600 font-medium">
            <Clock className="w-4 h-4" />
            Due today
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <Clock className="w-4 h-4" />
            {days} days left
          </span>
        )}
        {assignment.status !== "completed" && currentUser?.role === "student" && !hasSubmitted && (
          <button
            onClick={handleComplete}
            className="text-xs font-medium text-blue-600 hover:text-blue-700 transition flex items-center gap-1"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            Mark Done
          </button>
        )}
      </div>
    </div>
  );
}
