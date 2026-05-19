import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Sparkles, Pencil, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { journalPrompts } from "@/lib/dummyData";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

type TabType = "free" | "guided" | "gratitude";

interface JournalEntryData {
  _id: string;
  title: string;
  content: string;
  type: string;
  prompt: string;
  createdAt: string;
}

const JournalPage = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState<TabType>("free");
  const [content, setContent] = useState("");
  const [gratitudes, setGratitudes] = useState(["", "", ""]);
  const [promptIdx, setPromptIdx] = useState(0);
  const [saved, setSaved] = useState(false);
  const [entries, setEntries] = useState<JournalEntryData[]>([]);

  const tabs: { key: TabType; label: string; icon: typeof Pencil }[] = [
    { key: "free", label: "Free Write", icon: Pencil },
    { key: "guided", label: "Guided", icon: Sparkles },
    { key: "gratitude", label: "Gratitude", icon: Heart },
  ];

  // Fetch existing entries on mount
  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_URL}/api/journals`, {
          headers: { "Authorization": `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          setEntries(data);
        }
      } catch (err) {
        console.error("Failed to fetch journals", err);
      }
    };
    fetchEntries();
  }, [saved]); // refetch when saved

  const handleSave = async () => {
    let finalTitle = "";
    let finalContent = "";
    let finalPrompt = "";

    if (tab === "free") {
      if (!content.trim()) return toast.error("Entry cannot be empty.");
      finalTitle = content.split('\n')[0].substring(0, 40) + (content.length > 40 ? '...' : '');
      finalContent = content;
    } else if (tab === "guided") {
      if (!content.trim()) return toast.error("Entry cannot be empty.");
      finalTitle = journalPrompts[promptIdx];
      finalContent = content;
      finalPrompt = journalPrompts[promptIdx];
    } else if (tab === "gratitude") {
      const validGratitudes = gratitudes.filter((g) => g.trim() !== "");
      if (validGratitudes.length === 0) return toast.error("Add at least one gratitude.");
      finalTitle = "Daily Gratitude";
      finalContent = validGratitudes.map((g, i) => `${i + 1}. ${g}`).join("\n");
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/journals`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: finalTitle,
          content: finalContent,
          type: tab,
          prompt: finalPrompt,
        }),
      });

      if (response.ok) {
        setSaved(true);
        toast.success("Journal entry saved! ✨");
        setContent("");
        setGratitudes(["", "", ""]);
        setTimeout(() => setSaved(false), 2000);
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to save journal");
      }
    } catch (err) {
      console.error("Save error:", err);
      toast.error("Network error. Please try again.");
    }
  };

  return (
    <div className="px-6 py-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-full bg-card shadow-soft flex items-center justify-center">
          <ArrowLeft className="w-4 h-4 text-foreground" />
        </button>
        <h1 className="text-xl font-bold font-display text-foreground">Journal</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => { setTab(t.key); setContent(""); setGratitudes(["", "", ""]); }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
              tab === t.key
                ? "bg-primary text-primary-foreground shadow-soft"
                : "bg-card text-muted-foreground hover:bg-lavender-light"
            }`}
          >
            <t.icon className="w-3.5 h-3.5" />
            {t.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          {tab === "free" && (
            <div className="card-calm">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Start writing your thoughts..."
                className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground resize-none h-48 focus:outline-none leading-relaxed"
              />
            </div>
          )}

          {tab === "guided" && (
            <div className="space-y-4">
              <div className="card-calm gradient-calm">
                <p className="text-xs text-primary font-semibold mb-1">Today's Prompt</p>
                <p className="text-base font-display font-bold text-foreground">{journalPrompts[promptIdx]}</p>
                <button
                  onClick={() => { setPromptIdx((i) => (i + 1) % journalPrompts.length); setContent(""); }}
                  className="mt-3 text-xs text-primary font-semibold hover:underline"
                >
                  ↻ New prompt
                </button>
              </div>
              <div className="card-calm">
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your response..."
                  className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground resize-none h-36 focus:outline-none leading-relaxed"
                />
              </div>
            </div>
          )}

          {tab === "gratitude" && (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">What are 3 things you're grateful for today?</p>
              {gratitudes.map((g, i) => (
                <div key={i} className="card-calm flex items-center gap-3">
                  <span className="text-lg">
                    {i === 0 ? "🌟" : i === 1 ? "💛" : "🌸"}
                  </span>
                  <input
                    value={g}
                    onChange={(e) => {
                      const next = [...gratitudes];
                      next[i] = e.target.value;
                      setGratitudes(next);
                    }}
                    placeholder={`Gratitude ${i + 1}...`}
                    className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                  />
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={handleSave}
        disabled={saved}
        className="w-full mt-6 py-3.5 rounded-2xl bg-primary text-primary-foreground font-bold text-sm shadow-soft disabled:opacity-60"
      >
        {saved ? "✓ Saved!" : "Save Entry"}
      </motion.button>

      {/* Past Entries */}
      {entries.length > 0 && (
        <div className="mt-8">
          <h3 className="text-sm font-bold font-display text-foreground mb-3">Recent Entries</h3>
          <div className="space-y-2">
            {entries.slice(0, 5).map((entry) => (
              <div key={entry._id} className="card-calm">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-semibold text-foreground">
                    {entry.title === "Free Write" 
                      ? entry.content.split('\n')[0].substring(0, 40) + (entry.content.length > 40 ? "..." : "") 
                      : entry.title === "Guided Journal" 
                        ? entry.prompt || "Guided Reflection" 
                        : entry.title}
                  </p>
                  <span className={`text-[9px] px-2 py-0.5 rounded-full font-medium ${
                    entry.type === "gratitude" ? "bg-peach-light text-secondary" :
                    entry.type === "guided" ? "bg-lavender-light text-primary" :
                    "bg-mint-light text-accent"
                  }`}>
                    {entry.type}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2 whitespace-pre-wrap">{entry.content}</p>
                <p className="text-[10px] text-muted-foreground mt-1">{new Date(entry.createdAt).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default JournalPage;
