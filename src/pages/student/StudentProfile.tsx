import { useMemo, useState } from "react";
import { Mail, Building, Hash, GraduationCap, Save, CheckCircle2, TrendingUp } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import DashboardLayout from "@/layouts/DashboardLayout";
import { studentNavItems } from "@/layouts/navConfig";
import Avatar from "@/components/Avatar";
import { useToast } from "@/context/ToastContext";
import { calculateAverageGrade } from "@/utils/helpers";
import { ProgressRadialChart } from "@/charts/Charts";

export default function StudentProfile() {
  const { currentUser } = useAuth();
  const { assignments, submissions } = useData();
  const { showToast } = useToast();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: currentUser?.name || "",
    email: currentUser?.email || "",
    department: currentUser?.department || "",
    year: currentUser?.year || "",
    rollNumber: currentUser?.rollNumber || "",
  });

  const stats = useMemo(() => {
    const myAssignments = assignments.filter(
      (a) => a.department === currentUser?.department && a.year === currentUser?.year
    );
    const completed = myAssignments.filter((a) => a.status === "completed").length;
    const completion = myAssignments.length > 0 ? Math.round((completed / myAssignments.length) * 100) : 0;
    const avgGrade = calculateAverageGrade(currentUser?.id || "", submissions);
    return { completion, avgGrade, total: myAssignments.length, completed };
  }, [assignments, submissions, currentUser]);

  const infoItems = [
    { icon: Mail, label: "Email", value: currentUser?.email },
    { icon: Hash, label: "Roll Number", value: currentUser?.rollNumber },
    { icon: Building, label: "Department", value: currentUser?.department },
    { icon: GraduationCap, label: "Academic Year", value: currentUser?.year },
  ];

  const handleSave = () => {
    setEditing(false);
    showToast("Profile updated successfully!", "success");
  };

  return (
    <DashboardLayout navItems={studentNavItems} roleLabel="Student">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Profile</h1>
        <p className="text-slate-500 text-sm mt-1">Your academic profile and progress.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Profile card */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm text-center">
          <div className="flex justify-center mb-4">
            <Avatar user={currentUser!} size="xl" />
          </div>
          <h2 className="text-xl font-bold text-slate-800">{currentUser?.name}</h2>
          <p className="text-sm text-slate-400 mt-1">{currentUser?.email}</p>
          <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
            <GraduationCap className="w-3.5 h-3.5" />
            {currentUser?.role === "student" ? "Student" : "Teacher"}
          </div>

          <div className="mt-6 pt-6 border-t border-slate-50">
            <div className="relative">
              <ProgressRadialChart value={stats.completion} />
              <div className="absolute inset-0 flex items-center justify-center" style={{ bottom: "40px" }}>
                <div className="text-center">
                  <p className="text-3xl font-bold text-slate-800">{stats.completion}%</p>
                  <p className="text-xs text-slate-400">Progress</p>
                </div>
              </div>
            </div>
            <div className="flex justify-around mt-4 pt-4 border-t border-slate-50">
              <div>
                <p className="text-lg font-bold text-emerald-600">{stats.completed}</p>
                <p className="text-xs text-slate-400">Completed</p>
              </div>
              <div>
                <p className="text-lg font-bold text-amber-600">{stats.avgGrade}%</p>
                <p className="text-xs text-slate-400">Avg Grade</p>
              </div>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h3 className="text-sm font-semibold text-slate-700">Academic Details</h3>
              {!editing ? (
                <button
                  onClick={() => setEditing(true)}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Edit
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditing(false)}
                    className="text-sm text-slate-500 hover:text-slate-700 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                  >
                    <Save className="w-3.5 h-3.5" />
                    Save
                  </button>
                </div>
              )}
            </div>
            <div className="p-6 space-y-1">
              {infoItems.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="flex items-center gap-4 py-3.5 border-b border-slate-50 last:border-0">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4.5 h-4.5 text-slate-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-slate-400">{item.label}</p>
                      {editing ? (
                        <input
                          type="text"
                          value={formData[item.label.toLowerCase() as keyof typeof formData] || item.value || ""}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              [item.label.toLowerCase()]: e.target.value,
                            }))
                          }
                          className="text-sm font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500/20 w-full"
                        />
                      ) : (
                        <p className="text-sm font-medium text-slate-700">{item.value || "—"}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Academic progress summary */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-50/50 rounded-2xl border border-blue-100 p-6 mt-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-700">Academic Progress</h3>
                <p className="text-xs text-slate-500">Your overall performance summary</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white/60 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-slate-800">{stats.total}</p>
                <p className="text-xs text-slate-500 mt-1">Total Assignments</p>
              </div>
              <div className="bg-white/60 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-emerald-600">{stats.completion}%</p>
                <p className="text-xs text-slate-500 mt-1">Completion Rate</p>
              </div>
              <div className="bg-white/60 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-amber-600 flex items-center justify-center gap-1">
                  {stats.avgGrade}
                  <CheckCircle2 className="w-4 h-4 text-amber-400" />
                </p>
                <p className="text-xs text-slate-500 mt-1">Average Grade</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
