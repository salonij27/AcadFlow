import type { ReactNode } from "react";

interface ResponsiveTableProps {
  headers: string[];
  children: ReactNode;
  emptyMessage?: string;
  isEmpty?: boolean;
}

export default function ResponsiveTable({ headers, children, emptyMessage = "No data available", isEmpty = false }: ResponsiveTableProps) {
  if (isEmpty) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
        <p className="text-sm text-slate-400">{emptyMessage}</p>
      </div>
    );
  }
  return (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50">
              {headers.map((h, i) => (
                <th
                  key={i}
                  className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3.5 whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">{children}</tbody>
        </table>
      </div>
    </div>
  );
}
