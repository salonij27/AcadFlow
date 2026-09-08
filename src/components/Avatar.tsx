import { getInitials } from "@/utils/helpers";
import type { User } from "@/types";

export default function Avatar({ user, size = "md" }: { user: Pick<User, "name">; size?: "sm" | "md" | "lg" | "xl" }) {
  const sizes = {
    sm: "w-9 h-9 text-xs",
    md: "w-11 h-11 text-sm",
    lg: "w-14 h-14 text-base",
    xl: "w-20 h-20 text-2xl",
  };
  const s = sizes[size];

  // Deterministic gradient based on name
  const gradients = [
    "from-blue-500 to-blue-600",
    "from-emerald-500 to-emerald-600",
    "from-amber-500 to-amber-600",
    "from-rose-500 to-rose-600",
    "from-cyan-500 to-cyan-600",
    "from-indigo-500 to-indigo-600",
  ];
  const idx = user.name.charCodeAt(0) % gradients.length;
  const gradient = gradients[idx];

  return (
    <div className={`${s} rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-semibold flex-shrink-0 shadow-sm`}>
      {getInitials(user.name)}
    </div>
  );
}
