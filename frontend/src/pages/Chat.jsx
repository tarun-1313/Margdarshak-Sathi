import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChatCircleDots, Brain, Send,
  Lightbulb, Target, BookOpen, Code, Briefcase, TrendUp,
  GraduationCap, User, Microphone, Image, FileText,
  CheckCircle, Settings, Trash, Plus,
  Clock, Star, ArrowRight, Sparkles, Wand, LightbulbFilament
} from "@phosphor-icons/react";
import { Sparkle, Zap, Award, ChevronRight, Quote, PaperPlaneTilt as PaperPlaneRight, RefreshCw, Bot } from "lucide-react";

// Mock AI Responses
const mockAIResponses = {
  greeting: [
    "Hello! I'm your AI Career Mentor. I'm here to help you with career guidance, skill development, interview prep, and more. What would you like to explore today?",
    "Hi there! Ready to take your career to the next level? I can help with everything from technical skills to career transitions. What brings you here today?",
  ],
  roadmap: [
    "Based on your profile, I'd recommend starting with Python fundamentals, then moving to data analysis with Pandas. After that, machine learning with scikit-learn would be a natural progression. Would you like me to create a detailed learning roadmap for you?",
    "For your AI/ML career path, I suggest this sequence: 1) Python & Math foundations, 2) Machine Learning basics, 3) Deep Learning with TensorFlow/PyTorch, 4) NLP and LLMs. Each step should take 4-6 weeks. Should I generate a personalized timeline?",
  ],
  interview: [
    "For technical interviews, focus on: 1) Data structures & algorithms (practice on LeetCode), 2) System design principles, 3) Domain-specific knowledge. For behavioral questions, use the STAR method. Would you like me to conduct a mock interview?",
    "To ace your upcoming interview: Review the company's tech stack, prepare stories about your past projects using STAR format, and practice explaining complex concepts simply. I can simulate a technical interview right now if you're ready!",
  ],
  skills: [
    "Looking at current market trends, these skills are in high demand: 1) LLM/Generative AI development, 2) Cloud architecture (AWS/Azure/GCP), 3) MLOps and model deployment. Which area interests you most?",
    "For career growth in 2025, focus on: AI/ML engineering (especially LLMs), cloud-native development, and data engineering. These areas have 40%+ growth in job postings. Would you like resources to get started?",
  ],
  resume: [
    "To optimize your resume: 1) Use quantifiable achievements (e.g., 'Improved performance by 40%'), 2) Include relevant keywords from job descriptions, 3) Keep it to 1 page for junior roles, 2 pages for senior. I can review your resume if you share it!",
    "ATS-friendly resume tips: Use standard section headers, avoid tables/columns that confuse parsers, include a skills section with relevant keywords, and save as .docx for best compatibility. Want me to check your resume's ATS score?",
  ],
  default: [
    "That's a great question! Let me think about the best approach for your situation. Could you share a bit more about your background and specific goals? That way I can give you more targeted advice.",
    "Interesting! I have several ideas that might help. Before I dive in, tell me - what's your timeline for this goal? And do you have any specific constraints I should know about?",
  ],
};

// Suggested Questions
const suggestedQuestions = [
  { icon: BookOpen, text: "Create a learning roadmap", color: "purple" },
  { icon: Briefcase, text: "Help me prepare for interviews", color: "blue" },
  { icon: Code, text: "Which skills should I learn?", color: "green" },
  { icon: FileText, text: "Review my resume", color: "orange" },
];

// Quick Actions
const quickActions = [
  { icon: Target, label: "Set Goal", action: "goal" },
  { icon: BookOpen, label: "Resources", action: "resources" },
  { icon: TrendUp, label: "Track Progress", action: "progress" },
  { icon: Award, label: "Certificates", action: "certificates" },
];

// Chat Message Component
const ChatMessage = ({ message, isUser, timestamp }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-4 ${isUser ? "flex-row-reverse" : ""}`}
    >
      {/* Avatar */}
      <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${
        isUser 
          ? "bg-gradient-to-br from-[#8B5CF6] to-[#3B82F6]" 
          : "bg-gradient-to-br from-[#A3FF12] to-[#22C55E]"
      }`}>
        {isUser ? (
          <User size={20} className="text-white" weight="fill" />
        ) : (
          <Sparkles size={20} className="text-[#070B14]" weight="fill" />
        )}
      </div>

      {/* Message Content */}
      <div className={`flex-1 max-w-[80%] ${isUser ? "text-right" : ""}`}>
        <div className={`inline-block rounded-2xl px-5 py-3 text-left ${
          isUser
            ? "bg-gradient-to-r from-[#8B5CF6] to-[#3B82F6] text-white"
            : "bg-[#0F172A] border border-[rgba(255,255,255,0.08)] text-[#F8FAFC]"
        }`}>
          <p className="leading-relaxed text-sm">{message}</p>
        </div>
        <span className="text-[10px] text-[#64748B] mt-1 block">
          {timestamp}
        </span>
      </div>
    </motion.div>
  );
};

// Typing Indicator
const TypingIndicator = () => {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-[#A3FF12] to-[#22C55E] flex items-center justify-center">
        <Sparkles size={20} className="text-[#070B14]" weight="fill" />
      </div>
      <div className="flex-1">
        <div className="inline-flex items-center gap-1 rounded-2xl px-5 py-3 bg-[#0F172A] border border-[rgba(255,255,255,0.08)]">
          <motion.span
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
            className="w-2 h-2 rounded-full bg-[#8B5CF6]"
          />
          <motion.span
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
            className="w-2 h-2 rounded-full bg-[#8B5CF6]"
          />
          <motion.span
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
            className="w-2 h-2 rounded-full bg-[#8B5CF6]"
          />
        </div>
      </div>
    </div>
  );
};

// Welcome Card Component
const WelcomeCard = ({ onQuestionClick, quickActions }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Welcome Header */}
      <div className="text-center py-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.2 }}
          className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-[#8B5CF6] to-[#3B82F6] mb-6 shadow-2xl shadow-[#8B5CF6]/30"
        >
          <Brain size={40} className="text-white" weight="duotone" />
        </motion.div>
        <h1 className="font-display text-3xl lg:text-4xl font-black text-[#F8FAFC] mb-3">
          Welcome to AI Mentor
        </h1>
        <p className="text-[#94A3B8] max-w-lg mx-auto text-lg">
          Your personal AI-powered career companion. Get guidance on skills, career paths, interview prep, and more.
        </p>
      </div>

      {/* Suggested Questions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {suggestedQuestions.map((q, idx) => (
          <motion.button
            key={idx}
            initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + idx * 0.1 }}
            whileHover={{ scale: 1.02, y: -2 }}
            onClick={() => onQuestionClick(q.text)}
            className={`group relative overflow-hidden rounded-xl border p-5 text-left transition-all ${
              q.color === "purple"
                ? "bg-gradient-to-br from-[#8B5CF6]/20 to-[#8B5CF6]/5 border-[#8B5CF6]/30 hover:border-[#8B5CF6]/50"
                : q.color === "blue"
                ? "bg-gradient-to-br from-[#3B82F6]/20 to-[#3B82F6]/5 border-[#3B82F6]/30 hover:border-[#3B82F6]/50"
                : q.color === "green"
                ? "bg-gradient-to-br from-[#A3FF12]/20 to-[#A3FF12]/5 border-[#A3FF12]/30 hover:border-[#A3FF12]/50"
                : "bg-gradient-to-br from-[#F59E0B]/20 to-[#F59E0B]/5 border-[#F59E0B]/30 hover:border-[#F59E0B]/50"
            }`}
          >
            <div className="relative z-10">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${
                q.color === "purple"
                  ? "bg-[#8B5CF6]/20"
                  : q.color === "blue"
                  ? "bg-[#3B82F6]/20"
                  : q.color === "green"
                  ? "bg-[#A3FF12]/20"
                  : "bg-[#F59E0B]/20"
              }`}>
                <q.icon
                  size={20}
                  className={
                    q.color === "purple"
                      ? "text-[#8B5CF6]"
                      : q.color === "blue"
                      ? "text-[#3B82F6]"
                      : q.color === "green"
                      ? "text-[#A3FF12]"
                      : "text-[#F59E0B]"
                  }
                />
              </div>
              <p className="font-medium text-[#F8FAFC] group-hover:text-white transition-colors">
                {q.text}
              </p>
              <ChevronRight
                size={16}
                className="absolute bottom-0 right-0 text-[#94A3B8] group-hover:text-[#8B5CF6] transform group-hover:translate-x-1 transition-all"
              />
            </div>
          </motion.button>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {quickActions.map((action, idx) => (
          <motion.button
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 + idx * 0.1 }}
            whileHover={{ scale: 1.05 }}
            onClick={() => onQuestionClick(`Help me with ${action.label.toLowerCase()}`)}
            className="p-4 rounded-xl bg-[#0F172A] border border-[rgba(255,255,255,0.08)] hover:border-[#8B5CF6]/30 hover:bg-[#8B5CF6]/5 transition-all text-center group"
          >
            <action.icon
              size={24}
              className="mx-auto mb-2 text-[#8B5CF6] group-hover:scale-110 transition-transform"
            />
            <span className="text-xs font-medium text-[#94A3B8] group-hover:text-[#F8FAFC]">
              {action.label}
            </span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

// Main Chat Component
export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef(null);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle sending a message
  const handleSendMessage = async (text) => {
    if (!text.trim()) return;

    // Add user message
    const userMessage = {
      id: Date.now(),
      text: text,
      isUser: true,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate AI thinking and response
    setTimeout(() => {
      const lowerText = text.toLowerCase();
      let responseText = "";

      if (lowerText.includes("roadmap") || lowerText.includes("learn") || lowerText.includes("path")) {
        responseText = mockAIResponses.roadmap[Math.floor(Math.random() * mockAIResponses.roadmap.length)];
      } else if (lowerText.includes("interview") || lowerText.includes("prep")) {
        responseText = mockAIResponses.interview[Math.floor(Math.random() * mockAIResponses.interview.length)];
      } else if (lowerText.includes("skill") || lowerText.includes("tech")) {
        responseText = mockAIResponses.skills[Math.floor(Math.random() * mockAIResponses.skills.length)];
      } else if (lowerText.includes("resume")) {
        responseText = mockAIResponses.resume[Math.floor(Math.random() * mockAIResponses.resume.length)];
      } else {
        responseText = mockAIResponses.default[Math.floor(Math.random() * mockAIResponses.default.length)];
      }

      const aiMessage = {
        id: Date.now() + 1,
        text: responseText,
        isUser: false,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  // Handle suggested question click
  const handleSuggestedQuestion = (question) => {
    handleSendMessage(question);
  };

  // Handle voice input
  const toggleListening = () => {
    setIsListening(!isListening);
    // In a real implementation, this would use Web Speech API
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col" data-testid="chat-root">
      {messages.length === 0 ? (
        // Welcome State
        <div className="flex-1 overflow-y-auto">
          <WelcomeCard 
            onQuestionClick={handleSuggestedQuestion}
            quickActions={quickActions}
          />
        </div>
      ) : (
        // Chat Interface
        <>
          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto space-y-6 px-4 py-6">
            <AnimatePresence>
              {messages.map((message, index) => (
                <ChatMessage
                  key={message.id}
                  message={message.text}
                  isUser={message.isUser}
                  timestamp={message.timestamp}
                />
              ))}
            </AnimatePresence>
            
            {isTyping && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions */}
          <div className="px-4 py-3 border-t border-[rgba(255,255,255,0.06)]">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {suggestedQuestions.slice(0, 3).map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSuggestedQuestion(q.text)}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#0F172A] border border-[rgba(255,255,255,0.08)] text-xs text-[#94A3B8] hover:text-[#F8FAFC] hover:border-[#8B5CF6]/50 whitespace-nowrap transition-all"
                >
                  <q.icon size={14} className="text-[#8B5CF6]" />
                  {q.text}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Input Area */}
      <div className="p-4 border-t border-[rgba(255,255,255,0.06)]">
        <div className="max-w-4xl mx-auto">
          <div className="relative flex items-end gap-3 bg-[#0F172A] rounded-2xl border border-[rgba(255,255,255,0.08)] p-2 focus-within:border-[#8B5CF6]/50 transition-all">
            {/* Attachment Button */}
            <button className="p-2.5 rounded-xl text-[#64748B] hover:text-[#F8FAFC] hover:bg-[#1F2937] transition-all">
              <Plus size={20} />
            </button>

            {/* Text Input */}
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(inputValue);
                }
              }}
              placeholder="Ask me anything about your career, skills, or job search..."
              rows={1}
              className="flex-1 py-3 px-2 bg-transparent text-[#F8FAFC] placeholder-[#64748B] resize-none focus:outline-none max-h-32"
              style={{ minHeight: "44px" }}
            />

            {/* Voice Button */}
            <button
              onClick={toggleListening}
              className={`p-2.5 rounded-xl transition-all ${
                isListening
                  ? "bg-red-500/20 text-red-400 animate-pulse"
                  : "text-[#64748B] hover:text-[#F8FAFC] hover:bg-[#1F2937]"
              }`}
            >
              <Microphone size={20} weight={isListening ? "fill" : "regular"} />
            </button>

            {/* Send Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSendMessage(inputValue)}
              disabled={!inputValue.trim() || isTyping}
              className={`p-3 rounded-xl transition-all ${
                inputValue.trim() && !isTyping
                  ? "bg-gradient-to-r from-[#8B5CF6] to-[#3B82F6] text-white shadow-lg shadow-[#8B5CF6]/30 hover:shadow-xl hover:shadow-[#8B5CF6]/40"
                  : "bg-[#1F2937] text-[#64748B] cursor-not-allowed"
              }`}
            >
              <PaperPlaneRight size={20} weight="fill" />
            </motion.button>
          </div>

          {/* Footer Text */}
          <p className="text-center text-xs text-[#64748B] mt-3">
            AI Mentor can make mistakes. Consider verifying important information.
          </p>
        </div>
      </div>
    </div>
  );
}
