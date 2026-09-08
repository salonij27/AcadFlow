import { useState, useMemo } from "react";
import { LayoutGrid, List, ClipboardList } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import DashboardLayout from "@/layouts/DashboardLayout";
import { studentNavItems } from "@/layouts/navConfig";
import AssignmentCard from "@/components/AssignmentCard";
import SearchBar from "@/components/SearchBar";
import FilterDropdown from "@/components/FilterDropdown";
import ResponsiveTable from "@/components/ResponsiveTable";
import StatusBadge from "@/components/StatusBadge";
import EmptyState from "@/components/EmptyState";
import { formatDate } from "@/utils/helpers";

type SortKey = "deadline" | "subject" | "status";

export default function StudentAssignments() {
  const { currentUser } = useAuth();
  const { assignments } = useData();
  const [view, setView] = useState<"card" | "table">("card");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortKey, setSortKey] = useState<SortKey>("deadline");

  const myAssignments = useMemo(() => {
    return assignments.filter(
      (a) => a.department === currentUser?.department && a.year === currentUser?.year
    );
  }, [assignments, currentUser]);

  const filtered = useMemo(() => {
    let result = myAssignments;
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.subject.toLowerCase().includes(q) ||
          a.createdBy.toLowerCase().includes(q)
      );
    }
    if (statusFilter !== "all") {
      result = result.filter((a) => a.status === statusFilter);
    }
    result = [...result].sort((a, b) => {
      if (sortKey === "deadline") return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      if (sortKey === "subject") return a.subject.localeCompare(b.subject);
      if (sortKey === "status") return a.status.localeCompare(b.status);
      return 0;
    });
    return result;
  }, [myAssignments, search, statusFilter, sortKey]);

  return (
    <DashboardLayout navItems={studentNavItems} roleLabel="Student">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Assignments</h1>
        <p className="text-slate-500 text-sm mt-1">Track and manage all your assignments.</p>
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-2xl border border-slate-100 p-4 mb-6 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-end">
          <SearchBar value={search} onChange={setSearch} placeholder="Search assignments..." />
          <div className="flex gap-3 flex-1 lg:flex-none">
            <FilterDropdown
              value={statusFilter}
              onChange={setStatusFilter}
              options={[
                { value: "all", label: "All Status" },
                { value: "pending", label: "Pending" },
                { value: "completed", label: "Completed" },
                { value: "overdue", label: "Overdue" },
              ]}
            />
            <FilterDropdown
              value={sortKey}
              onChange={(v) => setSortKey(v as SortKey)}
              options={[
                { value: "deadline", label: "Sort: Deadline" },
                { value: "subject", label: "Sort: Subject" },
                { value: "status", label: "Sort: Status" },
              ]}
            />
          </div>
          <div className="flex bg-slate-100 rounded-xl p-1">
            <button
              onClick={() => setView("card")}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition flex items-center gap-1.5 ${
                view === "card" ? "bg-white text-slate-700 shadow-sm" : "text-slate-400"
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setView("table")}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition flex items-center gap-1.5 ${
                view === "table" ? "bg-white text-slate-700 shadow-sm" : "text-slate-400"
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100">
          <EmptyState
            icon={<ClipboardList className="w-8 h-8 text-slate-300" />}
            title="No assignments found"
            description="Try adjusting your search or filter to find assignments."
          />
        </div>
      ) : view === "card" ? (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((a) => (
            <AssignmentCard key={a.id} assignment={a} />
          ))}
        </div>
      ) : (
        <ResponsiveTable
          headers={["Assignment", "Subject", "Due Date", "Status", "Marks", "Teacher"]}
          isEmpty={false}
        >
          {filtered.map((a) => (
            <tr key={a.id} className="hover:bg-slate-50/50 transition">
              <td className="px-5 py-3.5">
                <p className="text-sm font-medium text-slate-700">{a.title}</p>
                <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{a.description}</p>
              </td>
              <td className="px-5 py-3.5">
                <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                  {a.subject}
                </span>
              </td>
              <td className="px-5 py-3.5 text-sm text-slate-600 whitespace-nowrap">{formatDate(a.dueDate)}</td>
              <td className="px-5 py-3.5">
                <StatusBadge status={a.status} />
              </td>
              <td className="px-5 py-3.5 text-sm text-slate-600">{a.totalMarks}</td>
              <td className="px-5 py-3.5 text-sm text-slate-600 whitespace-nowrap">{a.createdBy}</td>
            </tr>
          ))}
        </ResponsiveTable>
      )}
    </DashboardLayout>
  );
}
