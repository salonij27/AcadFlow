import { useState } from "react";
import { Mail, Building, BookOpen, Save, GraduationCap } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import DashboardLayout from "@/layouts/DashboardLayout";
import { teacherNavItems } from "@/layouts/navConfig";
import Avatar from "@/components/Avatar";
import { useToast } from "@/context/ToastContext";
import { subjects } from "@/data/mockData";

export default function TeacherProfile() {
  const { currentUser } = useAuth();
  const { showToast } = useToast();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: currentUser?.name || "",
    email: currentUser?.email || "",
    department: currentUser?.department || "",
  });

  const mySubjects = subjects.filter((s) => s.teacher === currentUser?.name);

  const infoItems = [
    { icon: Mail, label: "Email", value: currentUser?.email },
    { icon: Building, label: "Department", value: currentUser?.department },
  ];

  const handleSave = () => {
    setEditing(false);
    showToast("Profile updated successfully!", "success");
  };

  return (
    <DashboardLayout navItems={teacherNavItems} roleLabel="Teacher">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Profile</h1>
        <p className="text-slate-500 text-sm mt-1">Your teaching profile and subjects.</p>
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
            Teacher
          </div>

          <div className="mt-6 pt-6 border-t border-slate-50">
            <p className="text-3xl font-bold text-slate-800">{mySubjects.length}</p>
            <p className="text-xs text-slate-400 mt-1">Subjects Taught</p>
          </div>
        </div>

        {/* Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h3 className="text-sm font-semibold text-slate-700">Profile Details</h3>
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
                            setFormData((prev) => ({ ...prev, [item.label.toLowerCase()]: e.target.value }))
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

          {/* Subjects */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
              <h3 className="text-sm font-semibold text-slate-700">Subjects Taught</h3>
            </div>
            <div className="p-6 grid sm:grid-cols-2 gap-3">
              {mySubjects.map((s) => (
                <div key={s.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-5 h-5 text-blue-500" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-700 truncate">{s.name}</p>
                    <p className="text-xs text-slate-400">{s.code} - {s.department}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
