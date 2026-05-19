import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import MoodSelector from "@/components/MoodSelector";
import { tags as allTags } from "@/lib/dummyData";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

interface MoodEntryData {
  _id: string;
  mood: number;
  label: string;
  emoji: string;
  tags: string[];
  note: string;
  createdAt: string;
}

const MoodPage = () => {
  const navigate = useNavigate();
  const [selectedMood, setSelectedMood] = useState<{ emoji: string; label: string; value: number } | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [note, setNote] = useState("");
  const [scale, setScale] = useState(5);
  const [saved, setSaved] = useState(false);
  const [entries, setEntries] = useState<MoodEntryData[]>([]);

  // Fetch existing entries on mount
  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_URL}/api/moods`, {
          headers: { "Authorization": `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          setEntries(data);
        }
      } catch (err) {
        console.error("Failed to fetch moods", err);
      }
    };
    fetchEntries();
  }, []);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSave = async () => {
    if (!selectedMood) {
      toast.error("Please select a mood first!");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/moods`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          mood: scale,
          label: selectedMood.label,
          emoji: selectedMood.emoji,
          tags: selectedTags,
          note,
        }),
      });

      if (response.ok) {
        setSaved(true);
        toast.success("Mood entry saved! ✨");
        setTimeout(() => navigate("/"), 1500);
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to save mood");
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
        <h1 className="text-xl font-bold font-display text-foreground">Log Your Mood</h1>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        {/* Mood Emoji Selector */}
        <div className="card-calm">
          <h2 className="text-sm font-semibold text-foreground mb-3">How do you feel?</h2>
          <MoodSelector onSelect={(mood) => setSelectedMood(mood)} />
        </div>

        {/* Scale */}
        <div className="card-calm">
          <h2 className="text-sm font-semibold text-foreground mb-3">Rate your mood (1–10)</h2>
          <input
            type="range"
            min={1}
            max={10}
            value={scale}
            onChange={(e) => setScale(Number(e.target.value))}
            className="w-full accent-primary"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>1</span>
            <span className="text-lg font-bold text-primary">{scale}</span>
            <span>10</span>
          </div>
        </div>

        {/* Tags */}
        <div className="card-calm">
          <h2 className="text-sm font-semibold text-foreground mb-3">What's affecting you?</h2>
          <div className="flex flex-wrap gap-2">
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  selectedTags.includes(tag)
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-lavender-light"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Note */}
        <div className="card-calm">
          <h2 className="text-sm font-semibold text-foreground mb-3">Add a note</h2>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="What's on your mind..."
            className="w-full bg-muted rounded-xl p-3 text-sm text-foreground placeholder:text-muted-foreground resize-none h-24 focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>

        {/* Save */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleSave}
          disabled={saved}
          className="w-full py-3.5 rounded-2xl bg-primary text-primary-foreground font-bold text-sm shadow-soft disabled:opacity-60"
        >
          {saved ? "✓ Saved!" : "Save Mood Entry"}
        </motion.button>

        {/* History */}
        {entries.length > 0 && (
          <div>
            <h2 className="text-sm font-semibold text-foreground mb-3">Recent Entries</h2>
            <div className="space-y-2">
              {entries.slice(0, 5).map((entry) => (
                <div key={entry._id} className="card-calm flex items-center gap-3">
                  <span className="text-2xl">{entry.emoji}</span>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-foreground">{entry.label}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {new Date(entry.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-1 flex-wrap justify-end">
                    {entry.tags.map((t) => (
                      <span key={t} className="text-[9px] px-1.5 py-0.5 rounded-full bg-lavender-light text-primary font-medium">{t}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default MoodPage;
