import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart, Wind, BookOpen, Brain, MessageCircle,
  Target, FileText, ArrowRight, Settings, ClipboardCheck,
} from "lucide-react";
import MoodSelector from "@/components/MoodSelector";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
};

const features = [
  { path: "/mood", icon: Heart, label: "Mood Check-In", desc: "Log how you feel right now", gradient: "from-lavender to-rose", emoji: "💖" },
  { path: "/journal", icon: BookOpen, label: "Journal", desc: "Write freely or use prompts", gradient: "from-lavender-light to-peach-light", emoji: "📝" },
  { path: "/breathe", icon: Wind, label: "Breathe", desc: "Guided breathing exercises", gradient: "from-peach to-rose", emoji: "🌬️" },
  { path: "/goals", icon: Target, label: "Goals & Habits", desc: "Track daily wellness goals", gradient: "from-mint to-sky", emoji: "🎯" },
  { path: "/insights", icon: Brain, label: "Insights", desc: "Mood analytics & patterns", gradient: "from-sky to-mint", emoji: "📊" },
  { path: "/entries", icon: FileText, label: "All Entries", desc: "Browse your mood & journal history", gradient: "from-peach-light to-rose-light", emoji: "📋" },
  { path: "/assessments", icon: ClipboardCheck, label: "Self-Assessments", desc: "GAD-7, PHQ-9 & Stress tests", gradient: "from-lavender to-mint", emoji: "📝" },
  { path: "/chat", icon: MessageCircle, label: "AI Companion", desc: "Chat with your wellness AI buddy", gradient: "from-lavender-light to-sky", emoji: "🤖" },
];

const fortunes = [
  "You are stronger than you think, and braver than you believe.",
  "Every small step forward is still a step in the right direction.",
  "Your calm mind is the ultimate weapon against your challenges.",
  "Healing is not linear — every setback is a setup for a comeback.",
  "You deserve the same compassion you so freely give to others.",
  "Today's struggles are tomorrow's strengths.",
  "Breathe deeply. You are exactly where you need to be.",
  "The best time to plant a tree was 20 years ago. The second best time is now.",
  "Your feelings are valid. Give yourself permission to feel them.",
  "Happiness is not a destination — it's a way of traveling.",
  "Be gentle with yourself. You're doing the best you can.",
  "The sun will rise, and we will try again.",
];

const Index = () => {
  const navigate = useNavigate();
  const [moodLogged, setMoodLogged] = useState(false);
  const [fortuneIndex, setFortuneIndex] = useState(() => Math.floor(Math.random() * fortunes.length));
  const [isCracked, setIsCracked] = useState(false);
  const fortune = fortunes[fortuneIndex];
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";
  
  const authUserRaw = localStorage.getItem("user");
  const authUser = authUserRaw ? JSON.parse(authUserRaw) : null;
  const profileRaw = localStorage.getItem("mindspace-profile");
  const profile = profileRaw ? JSON.parse(profileRaw) : null;
  const displayName = authUser?.name || profile?.name || "Friend";

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="px-6 py-8 max-w-7xl mx-auto"
    >
      {/* Top Bar */}
      <motion.div variants={item} className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <span className="text-xl">🧠</span>
          </div>
          <h2 className="text-xl font-bold font-display text-foreground">MindSpace</h2>
        </div>
        <div className="flex items-center gap-2">
          <Avatar onClick={() => navigate("/settings")} className="w-9 h-9 border-2 border-primary/20 cursor-pointer hover:border-primary/50 transition-colors">
            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${JSON.parse(localStorage.getItem("mindspace-profile") || '{}').avatarSeed || "mindspace"}`} alt="User" />
            <AvatarFallback className="bg-lavender-light text-primary text-xs font-bold">MS</AvatarFallback>
          </Avatar>
        </div>
      </motion.div>

      {/* Hero Section */}
      <motion.div variants={item} className="gradient-hero rounded-3xl p-8 md:p-12 mb-10 relative overflow-hidden">
        <div className="hidden sm:block absolute top-4 right-6 text-4xl animate-float">🌈</div>
        <div className="hidden sm:block absolute bottom-6 right-20 text-3xl animate-float" style={{ animationDelay: "0.5s" }}>⭐</div>
        <div className="hidden sm:block absolute top-6 right-1/3 text-3xl animate-float" style={{ animationDelay: "1s" }}>💜</div>

        <div className="relative z-10 w-full flex flex-col items-center text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold font-display text-foreground mb-2">
            {greeting}, {displayName}! 👋
          </h1>

          <div className="card-calm gradient-calm p-4 sm:p-6 w-full max-w-xl">
            <p className="text-xs font-semibold text-primary tracking-wider uppercase mb-2 flex items-center justify-center gap-1">
              <SunIcon className="w-3.5 h-3.5" /> Daily Check-In
            </p>
            <h2 className="text-base sm:text-lg font-bold font-display text-foreground mb-4">
              How are you feeling today?
            </h2>
            <MoodSelector onSelect={() => setMoodLogged(true)} />
            {moodLogged && (
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center text-sm text-accent font-semibold mt-3"
              >
                ✓ Mood logged! Keep it up 🎉
              </motion.p>
            )}
          </div>
        </div>
      </motion.div>

      {/* Feature Grid */}
      <motion.div variants={item} className="mb-10">
        <h3 className="text-lg font-bold font-display text-foreground mb-4">Your Wellness Toolkit</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f) => (
            <motion.button
              key={f.path}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(f.path)}
              className={`card-calm flex items-center gap-4 text-left group hover:shadow-soft transition-all`}
            >
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${f.gradient} flex items-center justify-center text-2xl shrink-0 shadow-soft`}>
                {f.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-foreground flex items-center gap-2">
                  {f.label}
                  <ArrowRight className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">{f.desc}</p>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Fortune Cookie */}
      <motion.div variants={item} className="mb-10">
        <div className="card-calm bg-gradient-to-br from-peach-light to-lavender-light p-6 sm:p-8 text-center relative overflow-hidden min-h-[220px] flex flex-col items-center justify-center">
          <p className="text-[10px] font-semibold text-primary tracking-widest uppercase mb-4">Fortune Cookie</p>

          <AnimatePresence mode="wait">
            {!isCracked ? (
              <motion.div
                key="uncracked"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5, rotate: 20 }}
                className="flex flex-col items-center gap-3"
              >
                <motion.button
                  onClick={() => setIsCracked(true)}
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                  className="text-7xl sm:text-8xl animate-wobble cursor-pointer select-none drop-shadow-lg"
                  aria-label="Crack the fortune cookie"
                >
                  🥠
                </motion.button>
                <p className="text-xs font-semibold text-muted-foreground">Tap the cookie!</p>
              </motion.div>
            ) : (
              <motion.div
                key="cracked"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-4"
              >
                {/* Cracked cookie halves */}
                <div className="flex items-center justify-center gap-1 relative">
                  <motion.span
                    initial={{ rotate: 0, x: 0, opacity: 1 }}
                    animate={{ rotate: -35, x: -18, y: -6, opacity: 0.7 }}
                    transition={{ type: "spring", stiffness: 200, damping: 12 }}
                    className="text-5xl sm:text-6xl inline-block"
                    style={{ transformOrigin: "bottom right" }}
                  >
                    🥠
                  </motion.span>
                  <motion.span
                    initial={{ rotate: 0, x: 0, opacity: 1 }}
                    animate={{ rotate: 35, x: 18, y: -6, opacity: 0.7 }}
                    transition={{ type: "spring", stiffness: 200, damping: 12 }}
                    className="text-5xl sm:text-6xl inline-block scale-x-[-1]"
                    style={{ transformOrigin: "bottom left" }}
                  >
                    🥠
                  </motion.span>
                  {/* Sparkles */}
                  {["✨", "⭐", "💫"].map((s, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, scale: 0, y: 0 }}
                      animate={{
                        opacity: [0, 1, 0],
                        scale: [0, 1.2, 0.5],
                        y: [-10, -30 - i * 10],
                        x: [0, (i - 1) * 25],
                      }}
                      transition={{ duration: 0.8, delay: i * 0.1 }}
                      className="absolute text-lg"
                    >
                      {s}
                    </motion.span>
                  ))}
                </div>

                {/* Paper slip with fortune */}
                <motion.div
                  initial={{ opacity: 0, y: 20, scaleY: 0 }}
                  animate={{ opacity: 1, y: 0, scaleY: 1 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 200, damping: 18 }}
                  className="bg-cream/80 backdrop-blur-sm rounded-xl px-6 py-4 max-w-md shadow-soft border border-primary/10"
                  style={{ transformOrigin: "top" }}
                >
                  <p className="text-base sm:text-lg font-display font-bold text-foreground leading-relaxed">
                    "{fortune}"
                  </p>
                </motion.div>

                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  onClick={() => {
                    setIsCracked(false);
                    setFortuneIndex((i) => (i + 1) % fortunes.length);
                  }}
                  className="text-xs font-semibold text-primary hover:underline transition-colors mt-1"
                >
                  🥠 Get a new cookie
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
};

const SunIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>
);

export default Index;
