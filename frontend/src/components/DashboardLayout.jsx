import React, { useState } from "react";
import { Link, NavLink, useNavigate, Outlet } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  House, User, FileText, Compass, ChartBar, Path, GraduationCap,
  Briefcase, ChatCircleDots, Microphone, GithubLogo, TrendUp, SignOut, List, X,
  Robot, ShareNetwork, Brain, Target, Rocket, Cpu, Globe,
  GitBranch, Clock, Users,
  Sparkle, Crown, Shield
} from "@phosphor-icons/react";
import { Zap, Award, Radar, MessageSquare, BarChart3, ChevronRight, Layers } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

// Navigation items with futuristic styling
const mainNav = [
  { to: "/dashboard", label: "Overview", icon: House, color: "purple" },
  { to: "/twin", label: "Career Twin", icon: Robot, color: "blue" },
  { to: "/voice-interview", label: "AI Interview", icon: Microphone, color: "green" },
  { to: "/chat", label: "AI Mentor", icon: Brain, color: "purple" },
  { to: "/roadmap", label: "Roadmaps", icon: Path, color: "orange" },
];

const toolsNav = [
  { to: "/resume", label: "Resume Builder", icon: FileText, color: "purple" },
  { to: "/careers", label: "Job Intelligence", icon: Briefcase, color: "blue" },
  { to: "/skills", label: "Skill Gap", icon: ChartBar, color: "green" },
  { to: "/portfolio", label: "GitHub Analyzer", icon: GithubLogo, color: "orange" },
];

const settingsNav = [
  { to: "/profile", label: "Public Profile", icon: User, color: "purple" },
  { to: "/share", label: "Share Profile", icon: ShareNetwork, color: "blue" },
  { to: "/trends", label: "Industry Trends", icon: TrendUp, color: "green" },
  { to: "/courses", label: "Courses", icon: GraduationCap, color: "orange" },
];

const getColorClasses = (color) => {
  const colors = {
    purple: { bg: "bg-[#8B5CF6]/20", text: "text-[#8B5CF6]", border: "border-[#8B5CF6]/30", glow: "shadow-[#8B5CF6]/20" },
    blue: { bg: "bg-[#3B82F6]/20", text: "text-[#3B82F6]", border: "border-[#3B82F6]/30", glow: "shadow-[#3B82F6]/20" },
    green: { bg: "bg-[#A3FF12]/20", text: "text-[#A3FF12]", border: "border-[#A3FF12]/30", glow: "shadow-[#A3FF12]/20" },
    orange: { bg: "bg-[#F59E0B]/20", text: "text-[#F59E0B]", border: "border-[#F59E0B]/30", glow: "shadow-[#F59E0B]/20" },
  };
  return colors[color] || colors.purple;
};

const NavSection = ({ title, items, isActive }) => (
  <div className="mb-6">
    <div className="px-4 mb-2 text-[10px] font-mono uppercase tracking-widest text-[#64748B]">{title}</div>
    <div className="space-y-1">
      {items.map(({ to, label, icon: Icon, color }) => {
        const colors = getColorClasses(color);
        return (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-300 ${
                isActive
                  ? `${colors.bg} ${colors.text} border ${colors.border} shadow-lg ${colors.glow}`
                  : "text-[#94A3B8] hover:bg-[#0F172A] hover:text-[#F8FAFC]"
              }`
            }
          >
            <div className={`p-1.5 rounded-lg transition-all duration-300 ${
              ({ isActive }) => isActive ? colors.bg : "bg-transparent group-hover:bg-[#8B5CF6]/10"
            }`}>
              <Icon size={18} weight="duotone" />
            </div>
            <span className="font-medium">{label}</span>
            {({ isActive }) => isActive && (
              <motion.div
                layoutId="activeIndicator"
                className="ml-auto w-1.5 h-1.5 rounded-full bg-current"
              />
            )}
          </NavLink>
        );
      })}
    </div>
  </div>
);

export default function DashboardLayout() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleLogout = async () => {
    await signOut();
    navigate("/", { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#070B14] text-[#F8FAFC] flex">
      {/* Mobile overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Floating Glassmorphism Sidebar */}
      <motion.aside
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`fixed lg:sticky top-0 left-0 h-screen z-50 transition-all duration-500 ease-out ${
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } ${isHovered ? "lg:w-72" : "lg:w-20"}`}
      >
        <div className="h-full mx-4 my-4 rounded-2xl bg-gradient-to-b from-[#0F172A]/95 to-[#111827]/95 backdrop-blur-xl border border-[rgba(255,255,255,0.08)] shadow-2xl shadow-[#8B5CF6]/5 overflow-hidden flex flex-col">
          {/* Header */}
          <div className="p-5 border-b border-[rgba(255,255,255,0.06)]">
            <Link to="/dashboard" className="flex items-center gap-3" data-testid="sidebar-logo">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8B5CF6] to-[#3B82F6] flex items-center justify-center shadow-lg shadow-[#8B5CF6]/30">
                  <Sparkle size={20} className="text-white" weight="fill" />
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#A3FF12] border-2 border-[#0F172A] animate-pulse" />
              </div>
              <div className={`transition-all duration-300 ${isHovered ? "opacity-100 w-auto" : "opacity-0 w-0 lg:hidden"}`}>
                <div className="font-display text-lg font-black text-[#F8FAFC] leading-tight">Margdarshak<br/>Sathi</div>
                <div className="text-[10px] font-mono uppercase tracking-widest text-[#8B5CF6]">AI Career OS</div>
              </div>
            </Link>
            <button 
              className="lg:hidden absolute top-5 right-5 text-[#94A3B8] hover:text-[#F8FAFC]" 
              onClick={() => setOpen(false)} 
              aria-label="close"
            >
              <X size={24} />
            </button>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto py-4 px-3">
            <NavSection title="Main" items={mainNav} isHovered={isHovered} />
            <NavSection title="Tools" items={toolsNav} isHovered={isHovered} />
            <NavSection title="Settings" items={settingsNav} isHovered={isHovered} />
          </div>

          {/* User Profile */}
          <div className="p-4 border-t border-[rgba(255,255,255,0.06)]">
            <div className={`flex items-center gap-3 ${isHovered ? "" : "justify-center"}`}>
              {user?.picture ? (
                <img src={user.picture} alt="" className="w-10 h-10 rounded-full ring-2 ring-[#8B5CF6]/30" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#8B5CF6]/20 to-[#3B82F6]/20 border border-[#8B5CF6]/30 flex items-center justify-center">
                  <span className="font-mono text-sm font-bold text-[#8B5CF6]">{user?.name?.[0] || "U"}</span>
                </div>
              )}
              <div className={`flex-1 min-w-0 transition-all duration-300 ${isHovered ? "opacity-100 w-auto" : "opacity-0 w-0 lg:hidden"}`}>
                <div className="text-sm font-semibold text-[#F8FAFC] truncate">{user?.name}</div>
                <div className="text-xs text-[#64748B] truncate">{user?.email}</div>
              </div>
              <button
                onClick={handleLogout}
                data-testid="logout-button"
                className={`p-2 rounded-lg text-[#64748B] hover:text-[#F8FAFC] hover:bg-[#8B5CF6]/10 transition-all ${isHovered ? "" : "lg:hidden"}`}
                aria-label="logout"
              >
                <SignOut size={18} />
              </button>
            </div>
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        {/* Header */}
        <header className="sticky top-0 z-30 px-6 lg:px-10 py-4 flex items-center justify-between backdrop-blur-xl bg-[#070B14]/80 border-b border-[rgba(255,255,255,0.06)]">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden p-2 rounded-lg text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#0F172A] transition-all"
              onClick={() => setOpen(true)}
              aria-label="open-menu"
              data-testid="open-menu-button"
            >
              <List size={22} />
            </button>
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0F172A] border border-[rgba(255,255,255,0.08)]">
              <div className="w-2 h-2 rounded-full bg-[#A3FF12] animate-pulse" />
              <span className="text-xs font-mono text-[#94A3B8]">AI System Active</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-3">
              <Link
                to="/dashboard"
                className="p-2 rounded-lg text-[#64748B] hover:text-[#F8FAFC] hover:bg-[#0F172A] transition-all"
                title="Go to Dashboard"
              >
                <Sparkle size={20} />
              </Link>
              <Link
                to="/resume"
                className="p-2 rounded-lg text-[#64748B] hover:text-[#F8FAFC] hover:bg-[#0F172A] transition-all"
                title="Resume Builder"
              >
                <Zap size={20} />
              </Link>
            </div>
            <div className="h-6 w-px bg-[rgba(255,255,255,0.08)]" />
            <div className="flex items-center gap-3">
              <span className="hidden sm:block text-xs font-mono text-[#64748B]">welcome back,</span>
              <span className="text-sm font-semibold text-[#F8FAFC]">{user?.name?.split(" ")[0]}</span>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="px-6 lg:px-10 py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}



