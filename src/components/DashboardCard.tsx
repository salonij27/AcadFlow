import type { LucideIcon } from "lucide-react";

interface DashboardCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  color: "blue" | "emerald" | "amber" | "red" | "violet" | "slate";
  delay?: number;
}

const colors = {
  blue: { bg: "bg-blue-50", icon: "text-blue-600", ring: "ring-blue-100" },
  emerald: { bg: "bg-emerald-50", icon: "text-emerald-600", ring: "ring-emerald-100" },
  amber: { bg: "bg-amber-50", icon: "text-amber-600", ring: "ring-amber-100" },
  red: { bg: "bg-red-50", icon: "text-red-600", ring: "ring-red-100" },
  violet: { bg: "bg-violet-50", icon: "text-violet-600", ring: "ring-violet-100" },
  slate: { bg: "bg-slate-50", icon: "text-slate-600", ring: "ring-slate-100" },
};

export default function DashboardCard({ icon: Icon, label, value, color, delay = 0 }: DashboardCardProps) {
  const c = colors[color];
  return (
    <div
      className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300 animate-fade-in-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className={`w-11 h-11 rounded-xl ${c.bg} ${c.ring} ring-1 flex items-center justify-center`}>
          <Icon className={`w-5 h-5 ${c.icon}`} />
        </div>
      </div>
      <p className="text-3xl font-bold text-slate-800 tabular-nums">{value}</p>
      <p className="text-sm text-slate-500 mt-1">{label}</p>
    </div>
  );
}
