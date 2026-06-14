import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { toast } from "sonner";

export default function Login() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("login");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "", name: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "login") {
        await api.post("/auth/login", formData);
      } else {
        await api.post("/auth/register", formData);
      }
      toast.success(mode === "login" ? "Logged in successfully!" : "Registered successfully!");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    try {
      const res = await api.get("/auth/google/login");
      window.location.href = res.data.auth_url;
    } catch {
      toast.error("Google login not configured");
    }
  };

  const handleGithub = async () => {
    try {
      const res = await api.get("/auth/github/login");
      window.location.href = res.data.auth_url;
    } catch {
      toast.error("GitHub login not configured");
    }
  };

  return (
    <div className="min-h-screen bg-[#070B14] text-white grid lg:grid-cols-2">
      <div className="relative hidden lg:flex flex-col p-12 bg-gradient-to-br from-[#0F172A] to-[#111] border-r border-white/[0.06]">
        <Link to="/" className="flex items-center gap-2">
          <span className="block w-3 h-3 bg-[#8B5CF6] rounded-full"></span>
          <span className="font-display text-xl font-bold tracking-tight">Margdarshak Sathi AI</span>
        </Link>

        <div className="mt-auto">
          <div className="text-[#8B5CF6] font-mono text-xs uppercase tracking-widest mb-3">Built for ambitious engineers</div>
          <h1 className="font-display text-5xl font-black leading-tight tracking-tight">
            Your career,
            <br />
            <span className="text-[#8B5CF6]">compiled.</span>
          </h1>
        </div>
      </div>

      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="space-y-2">
            <Link to="/" className="inline-flex items-center gap-1 text-slate-400 hover:text-white transition-colors mb-4">
              <span>Back</span>
            </Link>
            <div className="text-slate-500 font-mono text-xs uppercase tracking-widest">
              {mode === "login" ? "Welcome back" : "Get started"}
            </div>
            <h2 className="font-display text-3xl font-black tracking-tight">
              {mode === "login" ? "Sign in" : "Create your account"}
            </h2>
          </div>

          {/* Social Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleGoogle}
              className="flex items-center justify-center gap-2 px-4 py-2.5 border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.05] transition-colors rounded-sm"
            >
              <span className="text-sm font-medium">Google</span>
            </button>
            <button
              onClick={handleGithub}
              className="flex items-center justify-center gap-2 px-4 py-2.5 border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.05] transition-colors rounded-sm"
            >
              <span className="text-sm font-medium">GitHub</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-white/[0.06]" />
            <span className="text-slate-500 text-xs uppercase font-mono tracking-widest">Or continue with email</span>
            <div className="flex-1 h-px bg-white/[0.06]" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <div className="space-y-1">
                <label className="text-xs text-slate-400 font-mono uppercase tracking-widest">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value})}
                  required
                  className="w-full bg-white/[0.02] border border-white/[0.08] px-4 py-2.5 text-sm focus:outline-none focus:border-[#8B5CF6]/50 rounded-sm"
                  placeholder="John Doe"
                />
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs text-slate-400 font-mono uppercase tracking-widest">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value})}
                required
                className="w-full bg-white/[0.02] border border-white/[0.08] px-4 py-2.5 text-sm focus:outline-none focus:border-[#8B5CF6]/50 rounded-sm"
                placeholder="you@example.com"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-slate-400 font-mono uppercase tracking-widest">Password</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value})}
                required
                className="w-full bg-white/[0.02] border border-white/[0.08] px-4 py-2.5 text-sm focus:outline-none focus:border-[#8B5CF6]/50 rounded-sm"
                placeholder="••••••••"
                minLength={8}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-[#8B5CF6] text-white font-bold px-6 py-2.5 hover:bg-[#A78BFA] transition-colors disabled:opacity-50 rounded-sm"
            >
              {loading ? "Loading..." : (mode === "login" ? "Sign in" : "Create account")}
            </button>
          </form>

          <div className="text-center text-sm text-slate-400">
            {mode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              onClick={() => setMode(mode === "login" ? "register" : "login")}
              className="text-[#8B5CF6] hover:text-[#A78BFA] font-medium transition-colors"
            >
              {mode === "login" ? "Sign up" : "Sign in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
