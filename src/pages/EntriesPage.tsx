import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

interface UnifiedEntry {
  id: string;
  dateStr: string;
  timestamp: number;
  type: "mood" | "journal";
  title: string;
  subtitle: string;
}

const EntriesPage = () => {
  const navigate = useNavigate();
  const [entries, setEntries] = useState<UnifiedEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAllEntries = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = { "Authorization": `Bearer ${token}` };

        const [moodsRes, journalsRes] = await Promise.all([
          fetch(`${API_URL}/api/moods`, { headers }),
          fetch(`${API_URL}/api/journals`, { headers }),
        ]);

        if (!moodsRes.ok || !journalsRes.ok) {
          throw new Error("Failed to fetch entries");
        }

        const moodsData = await moodsRes.json();
        const journalsData = await journalsRes.json();

        const unified: UnifiedEntry[] = [
          ...moodsData.map((m: any) => ({
            id: m._id,
            dateStr: new Date(m.createdAt).toLocaleDateString(),
            timestamp: new Date(m.createdAt).getTime(),
            type: "mood" as const,
            title: `${m.emoji} ${m.label}`,
            subtitle: m.note || (m.tags && m.tags.length > 0 ? m.tags.join(", ") : "No extra details"),
          })),
          ...journalsData.map((j: any) => ({
            id: j._id,
            dateStr: new Date(j.createdAt).toLocaleDateString(),
            timestamp: new Date(j.createdAt).getTime(),
            type: "journal" as const,
            title: j.title === "Free Write" 
              ? j.content.split('\n')[0].substring(0, 40) + (j.content.length > 40 ? "..." : "") 
              : j.title === "Guided Journal" 
                ? j.prompt || "Guided Reflection" 
                : j.title,
            subtitle: j.content.slice(0, 80) + (j.content.length > 80 ? "..." : ""),
          })),
        ].sort((a, b) => b.timestamp - a.timestamp);

        setEntries(unified);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load your entries.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllEntries();
  }, []);

  return (
    <div className="px-6 py-8 max-w-5xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-full bg-card shadow-soft flex items-center justify-center">
          <ArrowLeft className="w-4 h-4 text-foreground" />
        </button>
        <h1 className="text-xl font-bold font-display text-foreground">All Entries</h1>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      ) : entries.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          No entries yet. Start logging your mood or journaling!
        </div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
          {entries.map((entry, i) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.05, 0.5) }}
              className="card-calm flex items-start gap-3"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm ${
                entry.type === "mood" ? "bg-lavender-light" : "bg-peach-light"
              }`}>
                {entry.type === "mood" ? entry.title.split(" ")[0] : "📝"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground">{entry.title}</p>
                <p className="text-xs text-muted-foreground line-clamp-1 whitespace-pre-wrap">{entry.subtitle}</p>
                <div className="flex items-center gap-1 mt-1">
                  <Calendar className="w-3 h-3 text-muted-foreground" />
                  <span className="text-[10px] text-muted-foreground">{entry.dateStr}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default EntriesPage;
