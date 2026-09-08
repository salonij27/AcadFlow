import { useState, useMemo } from "react";
import { Plus, Edit2, Trash2, Copy, Eye, ClipboardList, Send, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import DashboardLayout from "@/layouts/DashboardLayout";
import { teacherNavItems } from "@/layouts/navConfig";
import SearchBar from "@/components/SearchBar";
import FilterDropdown from "@/components/FilterDropdown";
import ResponsiveTable from "@/components/ResponsiveTable";
import StatusBadge from "@/components/StatusBadge";
import Modal from "@/components/Modal";
import ConfirmDialog from "@/components/ConfirmDialog";
import EmptyState from "@/components/EmptyState";
import { useToast } from "@/context/ToastContext";
import { subjects } from "@/data/mockData";
import { formatDate, daysUntil } from "@/utils/helpers";
import type { Assignment } from "@/types";

const emptyForm = {
  title: "",
  subject: "",
  description: "",
  department: "",
  year: "2nd Year",
  dueDate: "",
  totalMarks: 100,
};

export default function TeacherAssignments() {
  const { currentUser } = useAuth();
  const { assignments, createAssignment, updateAssignment, deleteAssignment, duplicateAssignment, addNotification } = useData();
  const { showToast } = useToast();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [formData, setFormData] = useState(emptyForm);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [viewAssignment, setViewAssignment] = useState<Assignment | null>(null);

  const myAssignments = useMemo(() => {
    return assignments.filter((a) => a.createdById === currentUser?.id);
  }, [assignments, currentUser]);

  const filtered = useMemo(() => {
    let result = myAssignments;
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((a) => a.title.toLowerCase().includes(q) || a.subject.toLowerCase().includes(q));
    }
    if (filter !== "all") {
      result = result.filter((a) => a.status === filter);
    }
    return result;
  }, [myAssignments, search, filter]);

  const handleOpenCreate = () => {
    setFormData({ ...emptyForm, department: currentUser?.department || "", subject: subjects[0]?.name || "" });
    setEditId(null);
    setShowForm(true);
  };

  const handleOpenEdit = (a: Assignment) => {
    setFormData({
      title: a.title,
      subject: a.subject,
      description: a.description,
      department: a.department,
      year: a.year,
      dueDate: a.dueDate,
      totalMarks: a.totalMarks,
    });
    setEditId(a.id);
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.subject || !formData.dueDate) {
      showToast("Please fill all required fields.", "error");
      return;
    }
    if (editId) {
      updateAssignment(editId, formData);
      showToast("Assignment updated successfully!", "success");
    } else {
      createAssignment({
        ...formData,
        createdBy: currentUser?.name || "",
        createdById: currentUser?.id || "",
      });
      addNotification({
        userId: "s1",
        title: "New Assignment",
        message: `'${formData.title}' has been published.`,
        type: "info",
      });
      addNotification({
        userId: "s2",
        title: "New Assignment",
        message: `'${formData.title}' has been published.`,
        type: "info",
      });
      showToast("Assignment published successfully!", "success");
    }
    setShowForm(false);
    setFormData(emptyForm);
    setEditId(null);
  };

  const handleClear = () => {
    setFormData(emptyForm);
    setEditId(null);
  };

  const handleDuplicate = (id: string) => {
    duplicateAssignment(id);
    showToast("Assignment duplicated!", "success");
  };

  const handleDelete = () => {
    if (deleteId) {
      deleteAssignment(deleteId);
      showToast("Assignment deleted.", "info");
      setDeleteId(null);
    }
  };

  const mySubjects = subjects.filter((s) => s.teacher === currentUser?.name);

  return (
    <DashboardLayout navItems={teacherNavItems} roleLabel="Teacher">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Assignment Manager</h1>
          <p className="text-slate-500 text-sm mt-1">Create and manage your assignments.</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition shadow-sm hover:shadow-md flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">New Assignment</span>
        </button>
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-2xl border border-slate-100 p-4 mb-6 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-3">
          <SearchBar value={search} onChange={setSearch} placeholder="Search assignments..." />
          <div className="sm:w-48">
            <FilterDropdown
              value={filter}
              onChange={setFilter}
              options={[
                { value: "all", label: "All Status" },
                { value: "pending", label: "Pending" },
                { value: "completed", label: "Completed" },
                { value: "overdue", label: "Overdue" },
              ]}
            />
          </div>
        </div>
      </div>

      {/* Assignments table */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100">
          <EmptyState
            icon={<ClipboardList className="w-8 h-8 text-slate-300" />}
            title="No assignments yet"
            description="Create your first assignment to get started."
            action={
              <button
                onClick={handleOpenCreate}
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Create Assignment
              </button>
            }
          />
        </div>
      ) : (
        <ResponsiveTable
          headers={["Assignment", "Subject", "Due Date", "Status", "Marks", "Actions"]}
          isEmpty={false}
        >
          {filtered.map((a) => (
            <tr key={a.id} className="hover:bg-slate-50/50 transition">
              <td className="px-5 py-3.5">
                <p className="text-sm font-medium text-slate-700">{a.title}</p>
                <p className="text-xs text-slate-400 mt-0.5 line-clamp-1 max-w-xs">{a.description}</p>
              </td>
              <td className="px-5 py-3.5">
                <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">{a.subject}</span>
              </td>
              <td className="px-5 py-3.5 text-sm text-slate-600 whitespace-nowrap">
                {formatDate(a.dueDate)}
                <p className="text-xs text-slate-400">{daysUntil(a.dueDate) < 0 ? `${Math.abs(daysUntil(a.dueDate))}d overdue` : `${daysUntil(a.dueDate)}d left`}</p>
              </td>
              <td className="px-5 py-3.5">
                <StatusBadge status={a.status} />
              </td>
              <td className="px-5 py-3.5 text-sm text-slate-600">{a.totalMarks}</td>
              <td className="px-5 py-3.5">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setViewAssignment(a)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition"
                    title="View Submissions"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleOpenEdit(a)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-amber-50 hover:text-amber-600 transition"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDuplicate(a.id)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
                    title="Duplicate"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteId(a.id)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-red-50 hover:text-red-600 transition"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </ResponsiveTable>
      )}

      {/* Create/Edit modal */}
      <Modal open={showForm} onClose={() => setShowForm(false)} title={editId ? "Edit Assignment" : "Create New Assignment"} size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Assignment Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Linked List Implementation"
              className="w-full px-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition"
              required
            />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Subject *</label>
              <select
                value={formData.subject}
                onChange={(e) => {
                  const sub = subjects.find((s) => s.name === e.target.value);
                  setFormData({ ...formData, subject: e.target.value, department: sub?.department || formData.department });
                }}
                className="w-full px-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition cursor-pointer"
                required
              >
                <option value="">Select subject</option>
                {mySubjects.map((s) => (
                  <option key={s.id} value={s.name}>{s.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Department *</label>
              <input
                type="text"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              placeholder="Assignment description and instructions..."
              className="w-full px-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition resize-none"
            />
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Academic Year</label>
              <select
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                className="w-full px-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition cursor-pointer"
              >
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Due Date *</label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="w-full px-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Total Marks</label>
              <input
                type="number"
                value={formData.totalMarks}
                onChange={(e) => setFormData({ ...formData, totalMarks: Number(e.target.value) })}
                min={1}
                className="w-full px-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleClear}
              className="px-4 py-2.5 text-sm font-medium text-slate-600 rounded-xl hover:bg-slate-100 transition flex items-center gap-1.5"
            >
              <X className="w-4 h-4" />
              Clear Form
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition shadow-sm flex items-center gap-1.5"
            >
              <Send className="w-4 h-4" />
              {editId ? "Update Assignment" : "Publish Assignment"}
            </button>
          </div>
        </form>
      </Modal>

      {/* View submissions modal */}
      <Modal open={!!viewAssignment} onClose={() => setViewAssignment(null)} title="Assignment Details" size="md">
        {viewAssignment && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-800">{viewAssignment.title}</h3>
              <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md mt-1 inline-block">
                {viewAssignment.subject}
              </span>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">{viewAssignment.description || "No description provided."}</p>
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="bg-slate-50 rounded-xl p-3">
                <p className="text-xs text-slate-400">Due Date</p>
                <p className="text-sm font-medium text-slate-700">{formatDate(viewAssignment.dueDate)}</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-3">
                <p className="text-xs text-slate-400">Total Marks</p>
                <p className="text-sm font-medium text-slate-700">{viewAssignment.totalMarks}</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-3">
                <p className="text-xs text-slate-400">Department</p>
                <p className="text-sm font-medium text-slate-700">{viewAssignment.department}</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-3">
                <p className="text-xs text-slate-400">Status</p>
                <div className="mt-1"><StatusBadge status={viewAssignment.status} /></div>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete confirmation */}
      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Assignment"
        message="Are you sure you want to delete this assignment? This action cannot be undone."
        confirmLabel="Delete"
      />
    </DashboardLayout>
  );
}
