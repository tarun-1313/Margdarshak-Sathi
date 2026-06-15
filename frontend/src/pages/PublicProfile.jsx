
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";

import { api } from "@/lib/api";

import {
  GithubLogo,
  ArrowUpRight,
  At,
  MapPin,
  Calendar,
  Code,
  Rocket,
  Sparkle,
  Cpu,
  Database,
  Globe,
  Monitor,
  Palette,
  Brain,
  LinkedinLogo,
  DownloadSimple
} from "@phosphor-icons/react";

import {
  TrendingUp,
  Trophy,
  Mail as EnvelopeSimple
} from "lucide-react";

const AnimatedCounter = ({ to, duration = 1000, suffix = "" }) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    let start = 0;
    const step = Math.ceil(to / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= to) {
        setCount(to);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [to, duration]);
  
  return <span>{count}{suffix}</span>;
};

export default function PublicProfile() {
  const { slug } = useParams();
  const [doc, setDoc] = useState(null);
  const [err, setErr] = useState(null);

  useEffect(() => {
    api.get(`/public/${slug}`).then((r) => setDoc(r.data)).catch((e) => setErr(e?.response?.data?.detail || "Not found"));
  }, [slug]);

  if (err) return (
    <div className="min-h-screen bg-[#070B14] flex items-center justify-center text-center">
      <div>
        <div className="uppercase tracking-widest text-xs text-slate-500 font-mono mb-3">404</div>
        <h1 className="font-display text-4xl font-black">Profile not found</h1>
        <Link to="/" className="uppercase tracking-widest text-xs font-mono mt-6 inline-block text-[#8B5CF6]">← back home</Link>
      </div>
    </div>
  );
  if (!doc) return <div className="min-h-screen bg-[#070B14] flex items-center justify-center"><div className="dot-loader"><span/><span/><span/></div></div>;

  // Mock data for demo purposes
  const mockStats = [
    { label: "AI Projects", value: 12 },
    { label: "Technologies", value: 25 },
    { label: "GitHub Contributions", value: 500 },
    { label: "AI Systems Built", value: 8 },
    { label: "Deployments", value: 4 },
    { label: "ATS Score", value: 85 },
  ];

  const mockProjects = [
    { title: "Margdarshak Sathi AI", category: "AI Career OS", description: "AI-powered career operating system with interviews, skill gap analysis, roadmaps, and ATS optimization.", stack: ["FastAPI", "Gemini", "MongoDB", "LangGraph"], github: "#", demo: "#", complexity: "High", status: "Deployed" },
    { title: "Voice Interview Simulator", category: "AI Interviews", description: "Real-time voice interviews with AI feedback, STT, and personalized evaluation.", stack: ["Deepgram", "ElevenLabs", "React", "FastAPI"], github: "#", demo: "#", complexity: "Very High", status: "Deployed" },
    { title: "Multi-Agent AI System", category: "LangGraph", description: "Complex multi-agent workflow for task automation and collaboration.", stack: ["LangGraph", "OpenAI", "Python"], github: "#", demo: "#", complexity: "High", status: "WIP" },
  ];

  const mockSkills = {
    "AI & Machine Learning": [
      { name: "TensorFlow", proficiency: 90 },
      { name: "PyTorch", proficiency: 85 },
      { name: "LangChain", proficiency: 95 },
      { name: "LangGraph", proficiency: 92 },
      { name: "NLP", proficiency: 88 },
      { name: "RAG", proficiency: 90 },
    ],
    "Backend": [
      { name: "FastAPI", proficiency: 95 },
      { name: "Node.js", proficiency: 80 },
      { name: "MongoDB", proficiency: 85 },
      { name: "PostgreSQL", proficiency: 75 },
    ],
    "Frontend": [
      { name: "React", proficiency: 90 },
      { name: "Next.js", proficiency: 85 },
      { name: "TailwindCSS", proficiency: 95 },
    ],
    "Cloud & DevOps": [
      { name: "Docker", proficiency: 80 },
      { name: "AWS", proficiency: 70 },
      { name: "GitHub Actions", proficiency: 85 },
    ],
  };

  const mockTimeline = [
    { year: "2024", title: "Started AI/ML Journey" },
    { year: "2025", title: "Built Multi-Agent AI Systems" },
    { year: "2026", title: "Developing Production AI Platforms" },
    { year: "Future", title: "AI Infrastructure Engineer" },
  ];

  const mockCareerMatches = [
    { role: "AI Engineer", match: 96 },
    { role: "ML Engineer", match: 92 },
    { role: "LLM Engineer", match: 90 },
    { role: "AI Research Engineer", match: 85 },
  ];

  const mockCertifications = [
    { name: "Deep Learning Specialization", issuer: "Coursera", year: "2024" },
    { name: "Generative AI with LLMs", issuer: "DeepLearning.AI", year: "2025" },
    { name: "LangChain Developer Certification", issuer: "LangChain", year: "2025" },
  ];

  return (
    <div className="min-h-screen bg-[#070B14] text-[#F8FAFC] relative overflow-hidden">
      {/* Background layers */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(139,92,246,0.1)_0%,transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(59,130,246,0.08)_0%,transparent_50%)]"></div>
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)`, backgroundSize: '40px 40px' }}></div>
      </div>

      <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#070B14]/70 border-b border-[rgba(255,255,255,0.08)] py-4">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="block w-3 h-3 bg-[#8B5CF6] rounded-full"></span>
            <span className="font-display text-lg font-extrabold tracking-tight">Margdarshak Sathi</span>
          </Link>
          <div className="uppercase tracking-widest text-xs font-mono text-[#94A3B8]">@{doc.slug}</div>
        </div>
      </header>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-12 lg:py-16 space-y-12 lg:space-y-16">
        {/* Hero Section */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="space-y-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8">
            {doc.picture ? (
              <img src={doc.picture} alt="" className="w-32 h-32 lg:w-40 lg:h-40 object-cover rounded-full border-4 border-[#8B5CF6]/20 shadow-[0_0_40px_rgba(139,92,246,0.15)]" />
            ) : (
              <div className="w-32 h-32 lg:w-40 lg:h-40 bg-white/5 border-2 border-[rgba(255,255,255,0.08)] rounded-full flex items-center justify-center">
                <span className="font-display text-3xl font-black text-[#94A3B8]">{doc.name?.[0] || "U"}</span>
              </div>
            )}
            <div className="flex-1 space-y-3">
              <h1 className="font-display text-5xl lg:text-7xl font-black tracking-tight">{doc.name}</h1>
              <p className="text-lg lg:text-xl text-[#A3FF12] font-display font-bold">
                AI Engineer • Generative AI • LangGraph • LLM Applications
              </p>
              <p className="text-lg text-[#94A3B8] max-w-2xl">
                Building intelligent AI systems, multi-agent workflows, and production-grade AI applications using modern AI infrastructure.
              </p>
              
              <div className="flex flex-wrap items-center gap-4 mt-6">
                <div className="flex items-center gap-2 text-sm text-[#CBD5E1]">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="font-mono">Available for: AI/ML Roles • Internships • Freelance • Open Source</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 mt-6">
                {doc.github_url && (
                  <a href={doc.github_url} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2.5 border border-[rgba(255,255,255,0.08)] bg-white/5 hover:bg-white/10 transition-all rounded-sm">
                    <GithubLogo size={18} />
                    <span className="text-sm font-medium">GitHub</span>
                  </a>
                )}
                <button className="flex items-center gap-2 px-4 py-2.5 border border-[rgba(255,255,255,0.08)] bg-white/5 hover:bg-white/10 transition-all rounded-sm">
                  <LinkedinLogo size={18} />
                  <span className="text-sm font-medium">LinkedIn</span>
                </button>
                <button className="flex items-center gap-2 px-4 py-2.5 bg-[#8B5CF6] text-white hover:bg-[#A78BFA] transition-all rounded-sm font-bold">
                  <DownloadSimple size={18} />
                  <span className="text-sm">Resume</span>
                </button>
                <a href="mailto:contact@example.com" className="flex items-center gap-2 px-4 py-2.5 border border-[rgba(255,255,255,0.08)] bg-white/5 hover:bg-white/10 transition-all rounded-sm">
                  <At size={18} />
                  <span className="text-sm font-medium">Contact</span>
                </a>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Live AI Stats */}
        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {mockStats.map((stat, idx) => (
            <motion.div key={idx} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.3, delay: idx * 0.05 }} whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(215,255,0,0.1)" }} className="p-5 bg-[#0F172A]/60 border border-[rgba(255,255,255,0.08)] backdrop-blur-sm transition-all">
              <div className="font-display text-3xl lg:text-4xl font-black text-[#8B5CF6]">
                <AnimatedCounter to={stat.value} />+
              </div>
              <div className="text-xs font-mono uppercase tracking-widest text-slate-400 mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </motion.section>

        {/* Featured Projects */}
        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }} className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-3xl font-black tracking-tight">Featured AI Projects</h2>
            <Sparkle size={24} className="text-[#8B5CF6]" />
          </div>
          <div className="grid lg:grid-cols-3 gap-4">
            {mockProjects.map((project, idx) => (
              <motion.a key={idx} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: idx * 0.1 }} href={project.github} target="_blank" rel="noreferrer" className="group p-6 bg-[#0F172A]/60 border border-[rgba(255,255,255,0.08)] hover:border-[#8B5CF6]/30 backdrop-blur-sm transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="text-xs font-mono uppercase tracking-widest text-[#8B5CF6]">{project.category}</div>
                    <h3 className="font-display text-xl font-extrabold mt-1">{project.title}</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    {project.status === "Deployed" && <span className="text-xs font-mono text-green-400 uppercase tracking-widest border border-green-400/30 px-2 py-0.5">Deployed</span>}
                    {project.status === "WIP" && <span className="text-xs font-mono text-yellow-400 uppercase tracking-widest border border-yellow-400/30 px-2 py-0.5">WIP</span>}
                  </div>
                </div>
                
                <p className="text-sm text-slate-400 mb-4">{project.description}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {project.stack.map((tech, i) => (
                    <span key={i} className="text-xs font-mono text-slate-300 bg-white/5 border border-[rgba(255,255,255,0.08)] px-2 py-1">{tech}</span>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">Complexity: {project.complexity}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <GithubLogo size={16} className="text-slate-400 group-hover:text-white" />
                    <ArrowUpRight size={16} className="text-slate-400 group-hover:text-white" />
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
        </motion.section>

        {/* AI Tech Stack Visualization */}
        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.3 }} className="space-y-8">
          <h2 className="font-display text-3xl font-black tracking-tight">Technical Stack</h2>
          <div className="grid lg:grid-cols-2 gap-6">
            {Object.entries(mockSkills).map(([category, skills], catIdx) => (
              <div key={catIdx} className="p-6 bg-[#0F172A]/60 border border-[rgba(255,255,255,0.08)] backdrop-blur-sm">
                <div className="text-xs font-mono uppercase tracking-widest text-slate-500 mb-4">{category}</div>
                <div className="space-y-4">
                  {skills.map((skill, idx) => (
                    <div key={idx}>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="font-medium">{skill.name}</span>
                        <span className="font-mono text-[#8B5CF6]">{skill.proficiency}%</span>
                      </div>
                      <div className="h-1.5 bg-white/5 overflow-hidden">
                        <motion.div initial={{ width: 0 }} whileInView={{ width: `${skill.proficiency}%` }} viewport={{ once: true }} transition={{ duration: 1, delay: catIdx * 0.2 + idx * 0.1 }} className="h-full bg-gradient-to-r from-[#8B5CF6] to-[#A78BFA]"></motion.div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Career Timeline */}
        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.4 }} className="space-y-6">
          <h2 className="font-display text-3xl font-black tracking-tight">Career Timeline</h2>
          <div className="relative">
            <div className="absolute left-3 top-0 bottom-0 w-px bg-white/10"></div>
            <div className="space-y-8">
              {mockTimeline.map((item, idx) => (
                <motion.div key={idx} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: idx * 0.1 }} className="relative pl-10">
                  <div className="absolute left-0 w-6 h-6 rounded-full bg-[#8B5CF6]/20 border-2 border-[#8B5CF6] flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-[#8B5CF6]"></div>
                  </div>
                  <div className="p-5 bg-[#0F172A]/60 border border-[rgba(255,255,255,0.08)] backdrop-blur-sm">
                    <div className="text-xs font-mono uppercase tracking-widest text-slate-500">{item.year}</div>
                    <div className="font-display text-xl font-extrabold mt-1">{item.title}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* AI Career Match */}
        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.5 }} className="p-8 bg-[#0F172A]/60 border border-[rgba(255,255,255,0.08)] backdrop-blur-sm">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-display text-3xl font-black tracking-tight">AI Career Match</h2>
            <Brain size={28} className="text-[#8B5CF6]" />
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {mockCareerMatches.map((item, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: idx * 0.1 }} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-display font-extrabold">{item.role}</span>
                  <span className="font-mono text-[#8B5CF6] text-xl">{item.match}%</span>
                </div>
                <div className="h-2 bg-white/5 overflow-hidden">
                  <motion.div initial={{ width: 0 }} whileInView={{ width: `${item.match}%` }} viewport={{ once: true }} transition={{ duration: 1, delay: idx * 0.1 }} className="h-full bg-gradient-to-r from-[#8B5CF6] to-[#A78BFA]"></motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Certifications */}
        {mockCertifications.length > 0 && (
          <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.6 }} className="space-y-6">
            <h2 className="font-display text-3xl font-black tracking-tight">Certifications & Achievements</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {mockCertifications.map((cert, idx) => (
                <div key={idx} className="p-5 bg-[#0F172A]/60 border border-[rgba(255,255,255,0.08)] backdrop-blur-sm">
                  <Trophy size={20} className="text-[#8B5CF6] mb-3" />
                  <div className="font-display font-extrabold">{cert.name}</div>
                  <div className="text-sm text-slate-400 mt-1">{cert.issuer} • {cert.year}</div>
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* GitHub Analytics */}
        {doc.portfolio && (
          <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.7 }} className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-3xl font-black tracking-tight">GitHub Analytics</h2>
              {doc.github_url && (
                <a href={doc.github_url} target="_blank" rel="noreferrer" className="text-xs font-mono uppercase tracking-widest text-[#8B5CF6] flex items-center gap-1">
                  View on GitHub <ArrowUpRight size={12} />
                </a>
              )}
            </div>
            <div className="p-6 bg-[#0F172A]/60 border border-[rgba(255,255,255,0.08)] backdrop-blur-sm">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                  <div className="font-display text-2xl font-black text-[#8B5CF6]">{doc.portfolio.repos?.length || 0}</div>
                  <div className="text-xs font-mono uppercase tracking-widest text-slate-500 mt-1">Repositories</div>
                </div>
                <div className="text-center">
                  <div className="font-display text-2xl font-black text-[#8B5CF6]">500+</div>
                  <div className="text-xs font-mono uppercase tracking-widest text-slate-500 mt-1">Contributions</div>
                </div>
                <div className="text-center">
                  <div className="font-display text-2xl font-black text-[#8B5CF6]">50+</div>
                  <div className="text-xs font-mono uppercase tracking-widest text-slate-500 mt-1">Stars</div>
                </div>
                <div className="text-center">
                  <div className="font-display text-2xl font-black text-[#8B5CF6]">10+</div>
                  <div className="text-xs font-mono uppercase tracking-widest text-slate-500 mt-1">Followers</div>
                </div>
              </div>

              {doc.portfolio.repos?.length > 0 && (
                <div className="grid md:grid-cols-2 gap-3">
                  {doc.portfolio.repos.map((r, i) => (
                    <a key={i} href={r.url} target="_blank" rel="noreferrer" className="p-5 bg-white/5 border border-[rgba(255,255,255,0.08)] hover:border-white/20 transition-all">
                      <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-slate-500">
                        <GithubLogo size={12} /> {r.language || "—"}
                      </div>
                      <div className="font-display font-extrabold mt-2">{r.name}</div>
                      <div className="text-xs text-slate-400 mt-1 line-clamp-2">{r.description}</div>
                    </a>
                  ))}
                </div>
              )}
            </div>
          </motion.section>
        )}

        {/* Recruiter Contact */}
        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.8 }} className="p-8 bg-gradient-to-br from-0F172A/80 to-[#070B14] border border-[rgba(255,255,255,0.08)] backdrop-blur-sm text-center">
          <h2 className="font-display text-4xl font-black tracking-tight mb-4">Let's Build Together</h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-6">
            Interested in collaborating or hiring? I'm open to internships, AI/ML opportunities, remote work, and startup collaboration.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a href="mailto:contact@example.com" className="flex items-center gap-2 px-6 py-3 bg-[#8B5CF6] text-black hover:bg-[#A78BFA] transition-all rounded-sm font-bold">
              <EnvelopeSimple size={18} />
              <span>Get in Touch</span>
            </a>
            <button className="flex items-center gap-2 px-6 py-3 border border-[rgba(255,255,255,0.08)] bg-white/5 hover:bg-white/10 transition-all rounded-sm">
              <DownloadSimple size={18} />
              <span>Download Resume</span>
            </button>
          </div>
        </motion.section>

        <footer className="text-center pt-8 border-t border-[rgba(255,255,255,0.08)]">
          <div className="uppercase tracking-widest text-xs font-mono text-slate-500">CRAFTED WITH CAREERPILOT AI</div>
          <Link to="/" className="text-xs font-mono text-[#8B5CF6] mt-2 inline-block">Build your own →</Link>
        </footer>
      </div>
    </div>
  );
}
