import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Microphone, Stop, Play, Pause, Clock, Brain, Target,
  Star, TrendUp,
  Sparkle, ArrowRight, Settings, User,
  Send, CheckCircle, XCircle, Code
} from "@phosphor-icons/react";
import { Zap, Activity, Trophy, Volume2 as VolumeHigh, Award, MessageSquare, RefreshCw, BarChart3, RotateCcw, ChevronRight, Bot, Layers } from "lucide-react";

// Mock interview session data
const mockInterview = {
  id: 1,
  type: "Technical - AI/ML",
  difficulty: "Medium",
  duration: "45 min",
  questions: [
    {
      id: 1,
      question: "Explain the difference between supervised and unsupervised learning.",
      category: "ML Fundamentals",
      expectedTime: "3-5 min",
      hints: ["Give concrete examples", "Mention use cases"]
    },
    {
      id: 2,
      question: "How does gradient descent work? What are its variants?",
      category: "Optimization",
      expectedTime: "5-7 min",
      hints: ["Explain the intuition", "Compare variants"]
    },
    {
      id: 3,
      question: "Explain the Transformer architecture and its key components.",
      category: "Deep Learning",
      expectedTime: "7-10 min",
      hints: ["Attention mechanism", "Positional encoding"]
    }
  ]
};

// Voice Waveform Visualization Component
const VoiceWaveform = ({ isActive, isListening }) => {
  const bars = 40;
  
  return (
    <div className="flex items-center justify-center gap-1 h-24">
      {[...Array(bars)].map((_, i) => (
        <motion.div
          key={i}
          className={`w-1.5 rounded-full ${
            isListening ? "bg-gradient-to-t from-[#8B5CF6] to-[#A3FF12]" : "bg-[#8B5CF6]/30"
          }`}
          animate={isActive ? {
            height: ["20%", `${40 + Math.random() * 60}%`, "20%"],
          } : {
            height: "20%"
          }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            delay: i * 0.03,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
};

// AI Avatar Component
const AIAvatar = ({ isSpeaking, isListening }) => {
  return (
    <div className="relative w-32 h-32">
      {/* Outer glow */}
      <motion.div
        animate={isSpeaking ? {
          scale: [1, 1.1, 1],
          opacity: [0.5, 0.8, 0.5]
        } : {}}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute inset-0 rounded-full bg-gradient-to-br from-[#8B5CF6]/30 to-[#3B82F6]/30 blur-xl"
      />
      
      {/* Avatar ring */}
      <div className="absolute inset-2 rounded-full bg-gradient-to-br from-[#8B5CF6] to-[#3B82F6] p-[2px]">
        <div className="w-full h-full rounded-full bg-[#0F172A] flex items-center justify-center overflow-hidden">
          {/* AI Face */}
          <div className="relative w-20 h-20">
            {/* Eyes */}
            <motion.div
              animate={isSpeaking ? {
                scaleY: [1, 0.1, 1]
              } : {}}
              transition={{ duration: 0.2, repeat: isSpeaking ? Infinity : 0, repeatDelay: 3 }}
              className="absolute top-4 left-3 w-5 h-5 rounded-full bg-[#8B5CF6]"
            />
            <motion.div
              animate={isSpeaking ? {
                scaleY: [1, 0.1, 1]
              } : {}}
              transition={{ duration: 0.2, repeat: isSpeaking ? Infinity : 0, repeatDelay: 3 }}
              className="absolute top-4 right-3 w-5 h-5 rounded-full bg-[#8B5CF6]"
            />
            
            {/* Mouth */}
            <motion.div
              animate={isSpeaking ? {
                height: [4, 16, 4],
                borderRadius: ["4px", "8px", "4px"]
              } : {}}
              transition={{ duration: 0.3, repeat: Infinity }}
              className="absolute bottom-3 left-1/2 transform -translate-x-1/2 w-8 bg-[#A3FF12]"
            />

            {/* Listening indicator */}
            {isListening && (
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-3 h-3 rounded-full bg-[#A3FF12]"
              />
            )}
          </div>
        </div>
      </div>
      
      {/* Status badge */}
      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2">
        <div className={`px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-widest ${
          isSpeaking ? "bg-[#8B5CF6]/20 text-[#8B5CF6] border border-[#8B5CF6]/30" :
          isListening ? "bg-[#A3FF12]/20 text-[#A3FF12] border border-[#A3FF12]/30" :
          "bg-[#1F2937] text-[#64748B] border border-[#374151]"
        }`}>
          {isSpeaking ? "Speaking" : isListening ? "Listening" : "Idle"}
        </div>
      </div>
    </div>
  );
};

// Interview Stats Component
const InterviewStats = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="p-4 rounded-xl bg-[#0F172A] border border-[rgba(255,255,255,0.08)]"
        >
          <div className="flex items-center gap-2 mb-2">
            <div className={`p-1.5 rounded-lg ${stat.color === "purple" ? "bg-[#8B5CF6]/20" : stat.color === "green" ? "bg-[#A3FF12]/20" : stat.color === "blue" ? "bg-[#3B82F6]/20" : "bg-[#F59E0B]/20"}`}>
              <stat.icon size={14} className={stat.color === "purple" ? "text-[#8B5CF6]" : stat.color === "green" ? "text-[#A3FF12]" : stat.color === "blue" ? "text-[#3B82F6]" : "text-[#F59E0B]"} />
            </div>
            <span className="text-xs font-mono uppercase tracking-widest text-[#64748B]">{stat.label}</span>
          </div>
          <div className="font-display text-2xl font-black text-[#F8FAFC]">{stat.value}</div>
        </motion.div>
      ))}
    </div>
  );
};

// Main Interview Component
export default function Interview() {
  const [isInterviewing, setIsInterviewing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [showResults, setShowResults] = useState(false);

  // Interview stats
  const stats = [
    { label: "Overall", value: "87%", icon: Trophy, color: "purple" },
    { label: "Technical", value: "85%", icon: Code, color: "blue" },
    { label: "Communication", value: "92%", icon: MessageSquare, color: "green" },
    { label: "Confidence", value: "88%", icon: Zap, color: "orange" }
  ];

  useEffect(() => {
    let interval;
    if (isInterviewing) {
      interval = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isInterviewing]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startInterview = () => {
    setIsInterviewing(true);
    setCurrentQuestion(0);
    setTimeElapsed(0);
    // Simulate AI speaking
    setIsSpeaking(true);
    setTimeout(() => setIsSpeaking(false), 3000);
  };

  const stopInterview = () => {
    setIsInterviewing(false);
    setIsListening(false);
    setIsSpeaking(false);
    setShowResults(true);
  };

  const nextQuestion = () => {
    if (currentQuestion < mockInterview.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setIsSpeaking(true);
      setTimeout(() => setIsSpeaking(false), 3000);
    } else {
      stopInterview();
    }
  };

  const toggleListening = () => {
    setIsListening(!isListening);
  };

  if (showResults) {
    return (
      <div className="space-y-8">
        {/* Results Hero */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#8B5CF6]/20 via-[#070B14] to-[#070B14] border border-[#8B5CF6]/30 p-8"
        >
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#8B5CF6]/10 rounded-full blur-3xl" />
          </div>
          
          <div className="relative z-10 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-[#8B5CF6] to-[#3B82F6] mb-6"
            >
              <Trophy size={48} className="text-white" />
            </motion.div>
            
            <h1 className="font-display text-3xl lg:text-4xl font-black text-[#F8FAFC] mb-2">
              Interview Complete!
            </h1>
            <p className="text-[#94A3B8] max-w-lg mx-auto">
              Great job completing your AI mock interview. Here's your comprehensive performance analysis.
            </p>
          </div>
        </motion.section>

        {/* Stats Grid */}
        <InterviewStats stats={stats} />

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => setShowResults(false)}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#3B82F6] text-white font-semibold shadow-lg shadow-[#8B5CF6]/30 hover:shadow-xl hover:shadow-[#8B5CF6]/40 transition-all"
          >
            <RefreshCw size={18} className="inline mr-2" />
            New Interview
          </button>
          <button className="px-6 py-3 rounded-xl bg-[#0F172A] border border-[rgba(255,255,255,0.08)] text-[#F8FAFC] font-semibold hover:bg-[#1F2937] transition-all">
            <BarChart3 size={18} className="inline mr-2" />
            View Full Report
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Interview Header */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#8B5CF6]/20 via-[#070B14] to-[#070B14] border border-[#8B5CF6]/30 p-6"
      >
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#8B5CF6]/10 rounded-full blur-3xl" />
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded-lg bg-[#8B5CF6]/20 border border-[#8B5CF6]/30">
                <Brain size={16} className="text-[#8B5CF6]" />
              </div>
              <span className="text-xs font-mono uppercase tracking-widest text-[#8B5CF6]">{mockInterview.type}</span>
            </div>
            <h1 className="font-display text-2xl lg:text-3xl font-black text-[#F8FAFC]">
              AI Mock Interview
            </h1>
            <p className="text-[#94A3B8] text-sm">
              {mockInterview.difficulty} • {mockInterview.duration} • {mockInterview.questions.length} Questions
            </p>
          </div>

          <div className="flex items-center gap-4">
            {isInterviewing && (
              <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-[#0F172A] border border-[rgba(255,255,255,0.08)]">
                <Clock size={18} className="text-[#8B5CF6]" />
                <span className="font-mono text-lg font-semibold text-[#F8FAFC]">{formatTime(timeElapsed)}</span>
              </div>
            )}
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={isInterviewing ? stopInterview : startInterview}
              className={`px-6 py-3 rounded-xl font-semibold shadow-lg transition-all ${
                isInterviewing
                  ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-red-500/30 hover:shadow-red-500/40"
                  : "bg-gradient-to-r from-[#8B5CF6] to-[#3B82F6] text-white shadow-[#8B5CF6]/30 hover:shadow-xl hover:shadow-[#8B5CF6]/40"
              }`}
            >
              {isInterviewing ? (
                <>
                  <Stop size={18} className="inline mr-2" />
                  End Interview
                </>
              ) : (
                <>
                  <Play size={18} className="inline mr-2" />
                  Start Interview
                </>
              )}
            </motion.button>
          </div>
        </div>
      </motion.section>

      {/* Interview Interface */}
      <AnimatePresence mode="wait">
        {isInterviewing ? (
          <motion.div
            key="interview-active"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            {/* AI Panel */}
            <div className="lg:col-span-2 space-y-6">
              {/* AI Avatar & Waveform */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0F172A] to-[#111827] border border-[rgba(255,255,255,0.08)] p-8">
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#8B5CF6]/5 to-transparent" />
                </div>
                
                <div className="relative z-10 flex flex-col items-center">
                  <AIAvatar isSpeaking={isSpeaking} isListening={isListening} />
                  
                  <div className="w-full mt-8">
                    <VoiceWaveform isActive={isSpeaking || isListening} isListening={isListening} />
                  </div>

                  {/* Current Question */}
                  <div className="mt-8 w-full max-w-2xl">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs font-mono uppercase tracking-widest text-[#8B5CF6]">Question {currentQuestion + 1}/{mockInterview.questions.length}</span>
                      <span className="px-2 py-0.5 rounded-full bg-[#8B5CF6]/10 text-[10px] font-mono text-[#8B5CF6]">{mockInterview.questions[currentQuestion].category}</span>
                    </div>
                    <h3 className="text-lg lg:text-xl font-semibold text-[#F8FAFC] leading-relaxed">
                      {mockInterview.questions[currentQuestion].question}
                    </h3>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {mockInterview.questions[currentQuestion].hints.map((hint, i) => (
                        <span key={i} className="px-3 py-1.5 rounded-lg bg-[#0F172A] border border-[rgba(255,255,255,0.06)] text-xs text-[#94A3B8]">
                          💡 {hint}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Answer Input Area */}
              <div className="rounded-2xl bg-[#0F172A] border border-[rgba(255,255,255,0.08)] p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-[#8B5CF6]/20">
                    <MessageSquare size={18} className="text-[#8B5CF6]" />
                  </div>
                  <span className="font-semibold text-[#F8FAFC]">Your Answer</span>
                </div>
                
                <textarea
                  placeholder="Type your answer here... or click the microphone to respond verbally"
                  className="w-full h-32 bg-[#111827] border border-[rgba(255,255,255,0.06)] rounded-xl p-4 text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:border-[#8B5CF6]/50 resize-none"
                />
                
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-[#64748B]">Expected time: {mockInterview.questions[currentQuestion].expectedTime}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={toggleListening}
                      className={`p-3 rounded-xl transition-all ${
                        isListening
                          ? "bg-[#A3FF12]/20 text-[#A3FF12] border border-[#A3FF12]/30"
                          : "bg-[#8B5CF6]/20 text-[#8B5CF6] border border-[#8B5CF6]/30 hover:bg-[#8B5CF6]/30"
                      }`}
                    >
                      {isListening ? <Stop size={20} /> : <Microphone size={20} />}
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={nextQuestion}
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#3B82F6] text-white font-semibold shadow-lg shadow-[#8B5CF6]/30 hover:shadow-xl hover:shadow-[#8B5CF6]/40 transition-all"
                    >
                      Submit Answer
                      <ChevronRight size={18} className="inline ml-2" />
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>

            {/* Side Panel - Stats & Info */}
            <div className="space-y-6">
              {/* Live Stats */}
              <div className="rounded-2xl bg-gradient-to-br from-[#0F172A] to-[#111827] border border-[rgba(255,255,255,0.08)] p-6">
                <h3 className="font-display text-lg font-bold text-[#F8FAFC] mb-4 flex items-center gap-2">
                  <Activity size={20} className="text-[#8B5CF6]" />
                  Session Stats
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-[#94A3B8]">Clarity</span>
                      <span className="text-sm font-semibold text-[#A3FF12]">92%</span>
                    </div>
                    <div className="h-2 bg-[#1F2937] rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "92%" }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="h-full bg-gradient-to-r from-[#A3FF12] to-[#8B5CF6]"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-[#94A3B8]">Technical Depth</span>
                      <span className="text-sm font-semibold text-[#8B5CF6]">88%</span>
                    </div>
                    <div className="h-2 bg-[#1F2937] rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "88%" }}
                        transition={{ duration: 1, delay: 0.6 }}
                        className="h-full bg-gradient-to-r from-[#8B5CF6] to-[#3B82F6]"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-[#94A3B8]">Confidence</span>
                      <span className="text-sm font-semibold text-[#F59E0B]">85%</span>
                    </div>
                    <div className="h-2 bg-[#1F2937] rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "85%" }}
                        transition={{ duration: 1, delay: 0.7 }}
                        className="h-full bg-gradient-to-r from-[#F59E0B] to-[#EF4444]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Tips */}
              <div className="rounded-2xl bg-[#0F172A] border border-[rgba(255,255,255,0.08)] p-6">
                <h3 className="font-display text-lg font-bold text-[#F8FAFC] mb-4 flex items-center gap-2">
                  <Sparkle size={20} className="text-[#A3FF12]" />
                  AI Tips
                </h3>
                <ul className="space-y-3">
                  {[
                    "Speak clearly and at a moderate pace",
                    "Use the STAR method for behavioral questions",
                    "Take a moment to think before answering",
                    "Ask clarifying questions if needed"
                  ].map((tip, index) => (
                    <li key={index} className="flex items-start gap-3 text-sm text-[#CBD5E1]">
                      <div className="w-5 h-5 rounded-full bg-[#8B5CF6]/20 border border-[#8B5CF6]/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-[#8B5CF6]">{index + 1}</span>
                      </div>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="interview-idle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1E1B4B] to-[#070B14] border border-[rgba(255,255,255,0.08)] p-12 text-center"
          >
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#8B5CF6]/5 rounded-full blur-3xl" />
            </div>
            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 mb-6">
                <Bot size={40} className="text-[#8B5CF6]" />
              </div>
              <h2 className="font-display text-2xl lg:text-3xl font-black text-[#F8FAFC] mb-3">Ready to start your interview?</h2>
              <p className="text-[#94A3B8] max-w-lg mx-auto mb-8">Your AI interviewer is prepared to evaluate your skills. Click the start button above to begin your practice session.</p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0F172A] border border-[rgba(255,255,255,0.08)]">
                  <Target size={16} className="text-[#8B5CF6]" />
                  <span className="text-sm text-[#94A3B8]">{mockInterview.questions.length} Questions</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0F172A] border border-[rgba(255,255,255,0.08)]">
                  <Clock size={16} className="text-[#A3FF12]" />
                  <span className="text-sm text-[#94A3B8]">{mockInterview.duration}</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0F172A] border border-[rgba(255,255,255,0.08)]">
                  <Layers size={16} className="text-[#F59E0B]" />
                  <span className="text-sm text-[#94A3B8]">{mockInterview.difficulty}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
