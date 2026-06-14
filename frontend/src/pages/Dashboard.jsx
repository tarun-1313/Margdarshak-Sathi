
import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Compass, FileText, Brain, Target, Zap, ArrowUp, Github, Users, Clock, Sparkles, BookOpen, Upload, Star, CheckCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const GlowingCard = ({ children, className = "" }) => (
  <motion.div
    whileHover={{ y: -4, scale: 1.01 }}
    transition={{ type: "spring", stiffness: 300 }}
    className={`
      relative overflow-hidden
      bg-gradient-to-br from-slate-900/80 via-slate-900/60 to-slate-900/40
      backdrop-blur-2xl
      border border-white/10
      shadow-[0_0_40px_rgba(139,92,246,0.12),0_20px_60px_rgba(0,0,0,0.4)]
      rounded-3xl
      ${className}
    `}
  >
    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-500/5 to-cyan-500/5 pointer-events-none" />
    {children}
  </motion.div>
);

const AnimatedCounter = ({ to, duration = 2 }) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    let startTime = null;
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      setCount(Math.floor(progress * to));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [to, duration]);
  
  return <span>{count}</span>;
};

export default function Dashboard() {
  const { user } = useAuth();
  const [portfolioData, setPortfolioData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [resume, setResume] = useState(null);
  const [interviews, setInterviews] = useState(0);
  const [roadmap, setRoadmap] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const portfolioRes = await fetch("/api/portfolio", { credentials: "include" });
        if (portfolioRes.ok) setPortfolioData(await portfolioRes.json());

        const resumeRes = await fetch("/api/resume/latest", { credentials: "include" });
        if (resumeRes.ok) setResume(await resumeRes.json());

        const roadmapRes = await fetch("/api/roadmap", { credentials: "include" });
        if (roadmapRes.ok) setRoadmap(await roadmapRes.json());

        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-slate-400 mt-4">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  // Calculate metrics from actual data
  const atsScore = resume?.ats_score || 0;
  const githubScore = portfolioData?.analysis?.score || 0;
  const totalStars = portfolioData?.repos?.reduce((sum, r) => sum + (r.stars || 0), 0) || 0;
  const publicRepos = portfolioData?.public_repos || 0;
  const userSkills = user?.skills || [];
  const aiSkillScore = Math.min(30 + (userSkills.length * 10) + Math.floor(githubScore / 3), 100);
  const interviewReadiness = Math.min(55 + (interviews * 10), 95);

  return (
    <div className="min-h-screen space-y-8 p-6 lg:p-10">
      {/* --- Hero Command Center --- */}
      <GlowingCard className="p-8 lg:p-12">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs font-mono uppercase tracking-widest text-green-400">AI Career Engine Online</span>
              </div>
            </div>
            
            <div>
              <h1 className="font-display text-4xl lg:text-5xl font-black text-white mb-4">
                Your AI Career Command Center
              </h1>
              <p className="text-lg text-slate-400 leading-relaxed">
                Welcome back, {user?.name?.split(' ')[0] || 'User'}! Your career intelligence dashboard is ready.
              </p>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-purple-400" />
                <span>Last updated: Just now</span>
              </div>
            </div>
          </div>

          {/* Right panel: AI Insights */}
          <div className="space-y-4">
            <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-500/10 via-blue-500/5 to-cyan-500/10 border border-white/10">
              <h3 className="text-sm font-mono uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                <Sparkles size={16} className="text-purple-400" />
                What Your AI Recommends
              </h3>
              
              <div className="space-y-4">
                {!resume && (
                  <div className="p-4 rounded-xl bg-slate-800/50 border border-white/5">
                  <h4 className="text-sm font-semibold text-purple-400 mb-1 flex items-center gap-2">
                    <FileText size={14} />
                    Upload Your Resume
                  </h4>
                  <p className="text-xs text-slate-400">
                    Get an ATS score and personal recommendations to improve your resume for recruiters
                  </p>
                </div>
                )}

                {!portfolioData && (
                  <div className="p-4 rounded-xl bg-slate-800/50 border border-white/5">
                  <h4 className="text-sm font-semibold text-blue-400 mb-1 flex items-center gap-2">
                    <Github size={14} />
                    Connect GitHub
                  </h4>
                  <p className="text-xs text-slate-400">
                    Analyze your repos and get a portfolio quality score
                  </p>
                </div>
                )}

                {userSkills.length === 0 && (
                  <div className="p-4 rounded-xl bg-slate-800/50 border border-white/5">
                  <h4 className="text-sm font-semibold text-yellow-400 mb-1 flex items-center gap-2">
                    <Brain size={14} />
                    Add Your Skills
                  </h4>
                  <p className="text-xs text-slate-400">
                    Boost your AI skill score by adding your technical skills
                  </p>
                </div>
                )}

                {resume && portfolioData && userSkills.length > 0 && (
                  <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                  <h4 className="text-sm font-semibold text-green-400 mb-1 flex items-center gap-2">
                    <CheckCircle size={14} />
                    Great Job!
                  </h4>
                  <p className="text-xs text-slate-300">
                    You're all set! Now take a mock interview or generate a roadmap!
                  </p>
                </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </GlowingCard>

      {/* --- Quick Actions --- */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Zap size={20} className="text-yellow-400" />
          <h2 className="text-xl font-black text-white">Quick Actions</h2>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link to="/resume" className="block">
            <GlowingCard className="p-6">
              <div className="p-3 rounded-2xl mb-4 bg-purple-500/10 text-purple-400 border border-white/10">
                <Upload size={24} />
              </div>
              <h3 className="text-lg font-bold text-white">Resume AI</h3>
              <p className="text-sm text-slate-400 mb-3">ATS optimization & analysis</p>
              <div className="text-xs text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full inline-block">
                {resume ? 'Score: ' + atsScore + '/100' : 'Upload your resume'}
              </div>
            </GlowingCard>
          </Link>
          
          <Link to="/portfolio" className="block">
            <GlowingCard className="p-6">
              <div className="p-3 rounded-2xl mb-4 bg-blue-500/10 text-blue-400 border border-white/10">
                <Github size={24} />
              </div>
              <h3 className="text-lg font-bold text-white">Portfolio</h3>
              <p className="text-sm text-slate-400 mb-3">GitHub analysis & showcase</p>
              <div className="text-xs text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full inline-block">
                {portfolioData ? 'Score: ' + githubScore + '/100' : 'Connect GitHub'}
              </div>
            </GlowingCard>
          </Link>
          
          <Link to="/voice-interview" className="block">
            <GlowingCard className="p-6">
              <div className="p-3 rounded-2xl mb-4 bg-green-500/10 text-green-400 border border-white/10">
                <Brain size={24} />
              </div>
              <h3 className="text-lg font-bold text-white">Interview AI</h3>
              <p className="text-sm text-slate-400 mb-3">Mock interviews & practice</p>
              <div className="text-xs text-green-400 bg-green-500/10 px-3 py-1 rounded-full inline-block">
                {interviews > 0 ? interviews + ' taken' : 'Start practicing'}
              </div>
            </GlowingCard>
          </Link>
          
          <Link to="/roadmap" className="block">
            <GlowingCard className="p-6">
              <div className="p-3 rounded-2xl mb-4 bg-orange-500/10 text-orange-400 border border-white/10">
                <Target size={24} />
              </div>
              <h3 className="text-lg font-bold text-white">Roadmap AI</h3>
              <p className="text-sm text-slate-400 mb-3">Personalized learning paths</p>
              <div className="text-xs text-orange-400 bg-orange-500/10 px-3 py-1 rounded-full inline-block">
                {roadmap ? 'View your plan' : 'Generate roadmap'}
              </div>
            </GlowingCard>
          </Link>
        </div>
      </div>

      {/* --- Profile Overview --- */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Users size={20} className="text-purple-400" />
          <h2 className="text-xl font-black text-white">Your Public Profile</h2>
        </div>
        
        <GlowingCard className="p-6">
          <div className="flex flex-col md:flex-row items-center gap-6 mb-6">
            {portfolioData?.avatar_url ? (
              <img
                src={portfolioData.avatar_url}
                alt={user?.name || 'Profile'}
                className="w-24 h-24 rounded-full border-4 border-purple-500/30"
              />
            ) : (
              <div className="w-24 h-24 rounded-full border-4 border-purple-500/30 bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
                <Users size={36} className="text-purple-400" />
              </div>
            )}
            
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-2xl font-bold text-white">{portfolioData?.name || user?.name || 'Your Name'}</h3>
              <p className="text-slate-400">{portfolioData?.bio || 'Software Engineer'}</p>
              {portfolioData?.html_url && (
                <a href={portfolioData.html_url} target="_blank" rel="noreferrer" className="text-purple-400 text-sm hover:underline mt-2 inline-block">
                  View GitHub Profile
                </a>
              )}
            </div>
          </div>
          
          {userSkills.length > 0 && (
            <div className="mb-6">
              <h4 className="text-sm font-mono uppercase tracking-widest text-slate-500 mb-3">Skills</h4>
              <div className="flex flex-wrap gap-2">
                {userSkills.slice(0, 8).map((skill, idx) => (
                  <div key={idx} className="px-3 py-1 rounded-full bg-slate-800/50 border border-white/10 text-sm text-slate-300">
                    {skill}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {portfolioData?.repos?.length > 0 && (
            <div>
              <h4 className="text-sm font-mono uppercase tracking-widest text-slate-500 mb-3">Featured Projects</h4>
              <div className="space-y-3">
                {portfolioData.repos.slice(0, 3).map((repo, idx) => (
                  <a
                    key={idx}
                    href={repo.html_url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-4 rounded-2xl bg-slate-800/40 border border-white/5 hover:border-purple-500/30 transition-all block"
                  >
                    <div className="flex items-center justify-between">
                      <h5 className="text-white font-semibold">{repo.name}</h5>
                      <div className="flex items-center gap-2 text-slate-400 text-sm">
                        <Star size={14} className="text-yellow-400" />
                        <span>{repo.stars || 0}</span>
                        {repo.language && <span className="text-purple-400">{repo.language}</span>}
                      </div>
                    </div>
                    {repo.description && (
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2">{repo.description}</p>
                    )}
                  </a>
                ))}
              </div>
            </div>
          )}
        </GlowingCard>
      </div>
    </div>
  );
}

