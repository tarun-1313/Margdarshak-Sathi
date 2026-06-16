
import React, { useState } from "react";
import { Link, NavLink, useNavigate, Outlet } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import {
  House,
  User,
  FileText,
  ChartBar,
  Path,
  GraduationCap,
  Briefcase,
  Microphone,
  GithubLogo,
  TrendUp,
  SignOut,
  List,
  X,
  Robot,
  ShareNetwork,
  Brain,
  Sparkle,
} from "@phosphor-icons/react";

import { Zap } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

/* ---------------- NAVIGATION ---------------- */

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

/* ---------------- COLORS ---------------- */

const getColorClasses = (color) => {
  const colors = {
    purple: {
      bg: "bg-[#8B5CF6]/20",
      text: "text-[#8B5CF6]",
      border: "border-[#8B5CF6]/30",
    },

    blue: {
      bg: "bg-[#3B82F6]/20",
      text: "text-[#3B82F6]",
      border: "border-[#3B82F6]/30",
    },

    green: {
      bg: "bg-[#A3FF12]/20",
      text: "text-[#A3FF12]",
      border: "border-[#A3FF12]/30",
    },

    orange: {
      bg: "bg-[#F59E0B]/20",
      text: "text-[#F59E0B]",
      border: "border-[#F59E0B]/30",
    },
  };

  return colors[color] || colors.purple;
};

/* ---------------- NAV SECTION ---------------- */

const NavSection = ({ title, items, closeSidebar }) => (
  <div className="mb-6">
    <div className="px-4 mb-2 text-[10px] font-mono uppercase tracking-widest text-[#64748B]">
      {title}
    </div>

    <div className="space-y-1">
      {items.map(({ to, label, icon: Icon, color }) => {
        const colors = getColorClasses(color);

        return (
          <NavLink
            key={to}
            to={to}
            onClick={closeSidebar}
            className={({ isActive }) =>
              `group flex items-center gap-3 px-3 py-3 rounded-xl text-sm transition-all duration-300 ${
                isActive
                  ? `${colors.bg} ${colors.text} border ${colors.border}`
                  : "text-[#94A3B8] hover:bg-[#111827] hover:text-white"
              }`
            }
          >
            <Icon size={18} weight="duotone" />

            <span className="font-medium">{label}</span>
          </NavLink>
        );
      })}
    </div>
  </div>
);

/* ---------------- MAIN COMPONENT ---------------- */

export default function DashboardLayout() {
  const { user, signOut } = useAuth();

  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
    navigate("/", { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#070B14] text-[#F8FAFC] overflow-x-hidden lg:flex">

      {/* ---------------- MOBILE OVERLAY ---------------- */}

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* ---------------- SIDEBAR ---------------- */}

      <AnimatePresence>
        {(open || window.innerWidth >= 1024) && (
          <motion.aside
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            transition={{ duration: 0.25 }}
            className={`
              fixed top-0 left-0 z-50 h-screen
              w-[280px]
              bg-[#0B1120]
              border-r border-white/10
              flex flex-col
              lg:translate-x-0
            `}
          >

            {/* Header */}

            <div className="flex items-center justify-between p-5 border-b border-white/10">

              <Link
                to="/dashboard"
                className="flex items-center gap-3"
              >

                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8B5CF6] to-[#3B82F6] flex items-center justify-center">
                  <Sparkle
                    size={18}
                    weight="fill"
                    className="text-white"
                  />
                </div>

                <div>
                  <div className="text-lg font-black leading-tight">
                    Margdarshak
                    <br />
                    Sathi
                  </div>

                  <div className="text-[10px] uppercase tracking-[0.3em] text-[#8B5CF6]">
                    AI Career OS
                  </div>
                </div>
              </Link>

              {/* CLOSE BUTTON */}

              <button
                className="lg:hidden text-[#94A3B8]"
                onClick={() => setOpen(false)}
              >
                <X size={24} />
              </button>
            </div>

            {/* NAVIGATION */}

            <div className="flex-1 overflow-y-auto px-3 py-4">

              <NavSection
                title="Main"
                items={mainNav}
                closeSidebar={() => setOpen(false)}
              />

              <NavSection
                title="Tools"
                items={toolsNav}
                closeSidebar={() => setOpen(false)}
              />

              <NavSection
                title="Settings"
                items={settingsNav}
                closeSidebar={() => setOpen(false)}
              />
            </div>

            {/* USER SECTION */}

            <div className="p-4 border-t border-white/10">

              <div className="flex items-center gap-3">

                {user?.picture ? (
                  <img
                    src={user.picture}
                    alt=""
                    className="w-10 h-10 rounded-full"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-[#8B5CF6]/20 flex items-center justify-center">
                    <span className="text-sm font-bold">
                      {user?.name?.[0] || "U"}
                    </span>
                  </div>
                )}

                <div className="flex-1 min-w-0">

                  <div className="text-sm font-semibold truncate">
                    {user?.name}
                  </div>

                  <div className="text-xs text-[#64748B] truncate">
                    {user?.email}
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="p-2 rounded-lg hover:bg-white/5"
                >
                  <SignOut size={18} />
                </button>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* ---------------- MAIN CONTENT ---------------- */}

      <div className="flex-1 min-w-0 lg:ml-[280px]">

        {/* HEADER */}

        <header className="sticky top-0 z-30 px-6 lg:px-10 py-4 flex items-center justify-between backdrop-blur-xl bg-[#070B14]/80 border-b border-white/10">

          <div className="flex items-center gap-4">

            {/* OPEN MENU */}

            <button
              className="lg:hidden p-2 rounded-lg text-[#94A3B8] hover:text-white hover:bg-white/5"
              onClick={() => setOpen(true)}
            >
              <List size={22} />
            </button>

            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#111827] border border-white/10">
              <div className="w-2 h-2 rounded-full bg-[#A3FF12] animate-pulse" />

              <span className="text-xs font-mono text-[#94A3B8]">
                AI System Active
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">

            <div className="hidden md:flex items-center gap-3">

              <Link
                to="/dashboard"
                className="p-2 rounded-lg text-[#64748B] hover:text-white hover:bg-white/5"
              >
                <Sparkle size={20} />
              </Link>

              <Link
                to="/resume"
                className="p-2 rounded-lg text-[#64748B] hover:text-white hover:bg-white/5"
              >
                <Zap size={20} />
              </Link>
            </div>

            <div className="h-6 w-px bg-white/10" />

            <div className="flex items-center gap-3">

              <span className="hidden sm:block text-xs font-mono text-[#64748B]">
                welcome back,
              </span>

              <span className="text-sm font-semibold">
                {user?.name?.split(" ")[0]}
              </span>
            </div>
          </div>
        </header>

        {/* MAIN */}

        <main className="px-6 lg:px-10 py-8 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
