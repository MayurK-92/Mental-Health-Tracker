import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Sun, BookOpen, Wind, Target, FileText, Heart, Brain, MessageCircle, LogOut } from "lucide-react";
import StreakBadge from "@/components/StreakBadge";

const navLinks = [
  { path: "/", label: "Home", icon: Sun },
  { path: "/mood", label: "Check-In", icon: Heart },
  { path: "/journal", label: "Journal", icon: BookOpen },
  { path: "/breathe", label: "Breathe", icon: Wind },
  { path: "/goals", label: "Goals", icon: Target },
  { path: "/insights", label: "Insights", icon: Brain },
  { path: "/entries", label: "Entries", icon: FileText },
  { path: "/chat", label: "AI Chat", icon: MessageCircle },
];

const TopNav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 glass border-b border-border">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
        {/* Logo */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 shrink-0"
        >
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
            <span className="text-lg">🧠</span>
          </div>
          <span className="text-lg font-bold font-display text-foreground hidden sm:block">
            MindSpace
          </span>
        </button>

        {/* Nav Links */}
        <nav className="flex items-center gap-1 overflow-x-auto scrollbar-none">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <button
                key={link.path}
                onClick={() => navigate(link.path)}
                className="relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNavTab"
                    className="absolute inset-0 bg-primary/10 rounded-lg"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <link.icon
                  className={`relative z-10 w-4 h-4 ${
                    isActive ? "text-primary" : "text-muted-foreground"
                  }`}
                />
                <span
                  className={`relative z-10 hidden md:inline ${
                    isActive ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {link.label}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Right section */}
        <div className="flex items-center gap-3 shrink-0">
          {/* StreakBadge will be dynamically computed once mood tracking is persisted */}
          <button
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              navigate("/auth");
            }}
            className="w-9 h-9 rounded-xl bg-destructive/10 text-destructive flex items-center justify-center hover:bg-destructive/20 transition-colors"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default TopNav;
