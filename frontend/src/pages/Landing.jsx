import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowUpRight, Sparkle, Lightning, Brain, ChartLineUp, Target,
  RocketLaunch, Compass, GithubLogo, ChatCircleDots,
} from "@phosphor-icons/react";

const features = [
  { icon: Brain, title: "AI Career Matching", desc: "Get 5 personalized career paths with match %, salary ranges, and demand signals.", testid: "feature-career" },
  { icon: Target, title: "Skill Gap Analysis", desc: "See exactly what you're missing and how long it takes to close the gap.", testid: "feature-skillgap" },
  { icon: Compass, title: "Personalized Roadmap", desc: "A month-by-month, week-by-week plan tailored to your target role.", testid: "feature-roadmap" },
  { icon: ChartLineUp, title: "Live ATS Resume Score", desc: "Upload your PDF/DOCX — instantly get keywords, structure, and rewrites.", testid: "feature-ats" },
  { icon: GithubLogo, title: "GitHub Portfolio Audit", desc: "AI reviews your repos, READMEs, deployments and suggests improvements.", testid: "feature-github" },
  { icon: ChatCircleDots, title: "AI Mock Interviews", desc: "Live conversational interviews with scoring across technical, HR, and behavioural rounds.", testid: "feature-interview" },
];

const stats = [
  { k: "12K+", v: "Roadmaps generated" },
  { k: "98%", v: "Match accuracy" },
  { k: "5.2x", v: "Faster job hunt" },
  { k: "24/7", v: "AI mentor" },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-base text-white">
      {/* Header */}
      <header className="glass-header sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2" data-testid="landing-logo">
            <span className="block w-3 h-3 bg-accent-yellow"></span>
            <span className="font-display text-lg font-extrabold tracking-display">CareerPilot AI</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-sm text-secondary">
            <a href="#features" className="hover:text-white" data-testid="nav-features">Features</a>
            <a href="#how" className="hover:text-white" data-testid="nav-how">How it works</a>
            <a href="#stats" className="hover:text-white" data-testid="nav-stats">Why us</a>
          </nav>
          <Link to="/login" className="btn-yellow text-sm" data-testid="header-cta">
            Launch Console <ArrowUpRight size={16} weight="bold" />
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden noise">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url(https://images.pexels.com/photos/13129482/pexels-photo-13129482.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940)`,
            backgroundSize: "cover", backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0c0c0c]/70 to-[#0c0c0c]" />
        <div className="absolute inset-0 grid-bg opacity-50" />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-10 py-24 lg:py-36">
          <div className="grid lg:grid-cols-12 gap-12 items-end">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-8"
            >
              <div className="overline mb-6 flex items-center gap-2">
                <span className="block w-2 h-2 bg-accent-yellow"></span> AI CAREER OPERATING SYSTEM · v1.0
              </div>
              <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black tracking-display leading-[0.95]">
                Build a career<br/>
                <span className="accent-text">the algorithm</span> can't<br/>predict alone.
              </h1>
              <p className="mt-8 text-secondary max-w-2xl text-lg leading-relaxed">
                CareerPilot AI reads your resume, scans the market, audits your GitHub,
                and ships you a month-by-month plan, matched jobs, and AI mock interviews —
                in one console. No tabs. No guesswork.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link to="/login" className="btn-yellow" data-testid="hero-cta-primary">
                  <RocketLaunch size={18} weight="bold" /> Start free
                </Link>
                <a href="#features" className="btn-ghost" data-testid="hero-cta-secondary">
                  Tour the features
                </a>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="lg:col-span-4 flat-card p-6"
            >
              <div className="overline mb-3">LIVE CAREER MATCH</div>
              <div className="space-y-3 font-mono text-xs">
                {[
                  ["AI Engineer", 95],
                  ["ML Engineer", 91],
                  ["Data Scientist", 88],
                  ["LLM Researcher", 84],
                ].map(([role, score]) => (
                  <div key={role}>
                    <div className="flex justify-between mb-1">
                      <span className="text-white">{role}</span>
                      <span className="text-accent">{score}%</span>
                    </div>
                    <div className="h-1 bg-elevated">
                      <div className="h-full bg-accent-yellow" style={{ width: `${score}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-4 border-t border-default">
                <div className="overline">NEXT MILESTONE</div>
                <div className="mt-2 text-sm">Master LangGraph multi-agent workflows</div>
                <div className="text-xs text-muted mt-1">est. 3 weeks · high priority</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section id="stats" className="border-t border-default">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 grid grid-cols-2 lg:grid-cols-4">
          {stats.map((s, i) => (
            <div
              key={s.v}
              className={`py-10 px-4 lg:px-8 ${i < 3 ? "border-r" : ""} ${i < 2 ? "border-b lg:border-b-0" : ""} border-default`}
            >
              <div className="font-display text-4xl lg:text-5xl font-black tracking-display">{s.k}</div>
              <div className="overline mt-2">{s.v}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Bento */}
      <section id="features" className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="max-w-3xl">
            <div className="overline mb-4 flex items-center gap-2">
              <Sparkle size={12} weight="fill" /> THE FULL CAREER STACK
            </div>
            <h2 className="font-display text-4xl lg:text-5xl font-black tracking-display">
              One console.<br/>Every career decision.
            </h2>
            <p className="mt-4 text-secondary text-lg">
              Twelve AI agents working in parallel — so you ship, not search.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, idx) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="flat-card hover-lift p-8 group"
                data-testid={f.testid}
              >
                <f.icon size={28} weight="duotone" className="text-[var(--accent)] mb-6" />
                <h3 className="font-display text-xl font-extrabold mb-2">{f.title}</h3>
                <p className="text-sm text-secondary leading-relaxed">{f.desc}</p>
                <div className="mt-6 overline opacity-0 group-hover:opacity-100 transition-opacity">
                  Available in console →
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How */}
      <section id="how" className="border-t border-default py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5">
            <div className="overline mb-4">HOW IT WORKS</div>
            <h2 className="font-display text-4xl lg:text-5xl font-black tracking-display">
              Three steps to a<br/><span className="text-accent">shipping</span> career.
            </h2>
          </div>
          <div className="lg:col-span-7 space-y-6">
            {[
              ["01", "Tell us about you", "Drop your resume, link GitHub, set goals. Onboarding takes 90 seconds."],
              ["02", "Get matched and mapped", "Five career paths, your skill gap, and a personalized monthly roadmap."],
              ["03", "Ship the plan", "Live jobs, mock interviews, AI mentor — until the offer letter arrives."],
            ].map(([n, t, d]) => (
              <div key={n} className="flat-card p-8 flex gap-6">
                <div className="font-mono text-xs text-accent shrink-0">{n}</div>
                <div>
                  <h3 className="font-display text-2xl font-extrabold mb-2">{t}</h3>
                  <p className="text-secondary text-sm">{d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="border-t border-default py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="overline mb-4">USERS</div>
          <h2 className="font-display text-4xl lg:text-5xl font-black tracking-display mb-12">
            Built for ambitious people.
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              ["Sara K.", "ML Engineer, Bengaluru", "https://images.unsplash.com/photo-1580489944761-15a19d654956?crop=entropy&cs=srgb&fm=jpg&h=200&w=200", "Switched from data analyst → ML in 5 months. The roadmap and mock interviews carried me."],
              ["Daniel M.", "AI PM, Remote", "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?crop=entropy&cs=srgb&fm=jpg&h=200&w=200", "ATS went from 62 → 91. Two FAANG callbacks in a week. This is unfair."],
              ["Priya R.", "Final-year CSE", "https://images.pexels.com/photos/29086752/pexels-photo-29086752.jpeg?auto=compress&cs=tinysrgb&h=200&w=200", "I stopped doomscrolling Reddit. The AI mentor actually knows me."],
            ].map(([name, role, img, q]) => (
              <div key={name} className="flat-card p-8">
                <p className="text-base leading-relaxed mb-6">"{q}"</p>
                <div className="flex items-center gap-3 pt-6 border-t border-default">
                  <img src={img} alt="" className="w-10 h-10 object-cover" />
                  <div>
                    <div className="text-sm">{name}</div>
                    <div className="overline mt-1">{role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-default py-24 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="relative max-w-4xl mx-auto px-6 lg:px-10 text-center">
          <Lightning size={32} weight="fill" className="text-[var(--accent)] mx-auto mb-6" />
          <h2 className="font-display text-5xl lg:text-7xl font-black tracking-display">
            Stop guessing.<br/>Start <span className="text-accent">shipping</span>.
          </h2>
          <p className="mt-6 text-secondary text-lg">
            Free to start. No credit card. Your career compiled in minutes.
          </p>
          <div className="mt-10">
            <Link to="/login" className="btn-yellow text-base" data-testid="footer-cta">
              <RocketLaunch size={20} weight="bold" /> Launch CareerPilot AI
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-default py-8">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted font-mono">
          <div>© 2026 CAREERPILOT AI — BUILT FOR SHIPPING CAREERS.</div>
          <div className="flex gap-6">
            <span>v1.0.0</span>
            <span>STATUS · ONLINE</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
