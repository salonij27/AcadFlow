import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { GraduationCap, Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function Login() {
  const { login, isAuthenticated, currentUser } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (isAuthenticated && currentUser) {
    return <Navigate to={currentUser.role === "teacher" ? "/teacher/dashboard" : "/student/dashboard"} replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await login(email, password);
      if (result.success) {
        const user = JSON.parse(sessionStorage.getItem("acadflow_user") || "{}");
        navigate(user.role === "teacher" ? "/teacher/dashboard" : "/student/dashboard", { replace: true });
      } else {
        setError(result.error || "Invalid email or password.");
        setLoading(false);
      }
    } catch {
      setError("Invalid email or password.");
      setLoading(false);
    }
  };

  const fillCredentials = (type: "teacher" | "student") => {
    if (type === "teacher") {
      setEmail("teacher1@demo.edu");
      setPassword("admin123");
    } else {
      setEmail("student1@demo.edu");
      setPassword("pass123");
    }
    setError("");
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-50">
      {/* Left panel - branding */}
      <div className="lg:w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 relative overflow-hidden flex items-center justify-center p-8 lg:p-16">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-10 right-20 w-96 h-96 rounded-full bg-blue-300 blur-3xl" />
        </div>
        <div className="relative z-10 text-white max-w-md">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center">
              <GraduationCap className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">AcadFlow</h1>
              <p className="text-blue-200 text-sm">Academic Management System</p>
            </div>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold leading-tight mb-4">
            Manage assignments, track progress, and grade with ease.
          </h2>
          <p className="text-blue-100 leading-relaxed mb-10">
            A complete LMS experience for teachers and students. Create assignments, submit work,
            view analytics, and track academic performance all in one place.
          </p>
          <div className="space-y-4">
            {[
              "Smart assignment tracking & deadlines",
              "Real-time progress analytics",
              "Integrated grading & feedback",
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3 animate-fade-in-up" style={{ animationDelay: `${i * 150}ms` }}>
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
                <span className="text-blue-50 text-sm">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel - login form */}
      <div className="lg:w-1/2 flex items-center justify-center p-6 lg:p-16">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-1">Welcome back</h2>
            <p className="text-slate-500 text-sm">Sign in to access your dashboard</p>
          </div>

          {error && (
            <div className="mb-5 flex items-center gap-2.5 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 animate-fade-in">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@demo.edu"
                  required
                  autoFocus
                  className="w-full pl-11 pr-4 py-3 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full pl-11 pr-11 py-3 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                >
                  {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition shadow-sm hover:shadow-md flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100">
            <p className="text-xs text-slate-400 mb-3 text-center font-medium">Quick demo access</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => fillCredentials("teacher")}
                className="px-3 py-2.5 text-xs font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-100 transition text-left"
              >
                <span className="block text-slate-700 font-semibold mb-0.5">Teacher</span>
                <span className="block text-slate-400">teacher1@demo.edu</span>
              </button>
              <button
                onClick={() => fillCredentials("student")}
                className="px-3 py-2.5 text-xs font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-100 transition text-left"
              >
                <span className="block text-slate-700 font-semibold mb-0.5">Student</span>
                <span className="block text-slate-400">student1@demo.edu</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
