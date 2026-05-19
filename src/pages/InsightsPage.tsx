import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, AlertTriangle, Lightbulb, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, AreaChart, Area } from "recharts";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const InsightsPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [insightLoading, setInsightLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [aiInsight, setAiInsight] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_URL}/api/moods`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        
        if (res.ok) {
          const moods = await res.json();
          processMoodData(moods, token);
        }
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const processMoodData = async (moods: any[], token: string | null) => {
    if (moods.length === 0) {
      setData({ empty: true });
      setLoading(false);
      return;
    }

    // 1. Avg Mood
    const totalMood = moods.reduce((s, m) => s + m.mood, 0);
    const avgMood = (totalMood / moods.length).toFixed(1);

    // 2. Streak
    let streak = 0;
    const today = new Date();
    today.setHours(0,0,0,0);
    
    // Create a set of date strings (YYYY-MM-DD) that have moods in local time
    const moodDates = new Set(moods.map(m => new Date(m.createdAt).toLocaleDateString('en-CA')));
    
    let currentDate = new Date(today);
    while (true) {
      const dateStr = currentDate.toLocaleDateString('en-CA');
      if (moodDates.has(dateStr)) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        // If today is missing, check if yesterday has it before breaking streak
        if (streak === 0 && currentDate.getTime() === today.getTime()) {
           currentDate.setDate(currentDate.getDate() - 1);
           const yesterdayStr = currentDate.toLocaleDateString('en-CA');
           if (moodDates.has(yesterdayStr)) {
             streak++;
             currentDate.setDate(currentDate.getDate() - 1);
             continue;
           }
        }
        break;
      }
    }

    // 3. Weekly Data (Last 7 days)
    const weeklyData = [];
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toLocaleDateString('en-CA');
      const dayMoods = moods.filter(m => new Date(m.createdAt).toLocaleDateString('en-CA') === dateStr);
      const dayAvg = dayMoods.length > 0 ? dayMoods.reduce((s, m) => s + m.mood, 0) / dayMoods.length : 0;
      weeklyData.push({ day: dayNames[d.getDay()], mood: parseFloat(dayAvg.toFixed(1)) });
    }

    // 4. Monthly Trend (Last 4 weeks)
    const monthlyData = [];
    for (let i = 3; i >= 0; i--) {
      const weekEnd = new Date();
      weekEnd.setDate(weekEnd.getDate() - (i * 7));
      const weekStart = new Date(weekEnd);
      weekStart.setDate(weekStart.getDate() - 7);
      
      const weekMoods = moods.filter(m => {
        const d = new Date(m.createdAt);
        return d >= weekStart && d <= weekEnd;
      });
      const weekAvg = weekMoods.length > 0 ? weekMoods.reduce((s, m) => s + m.mood, 0) / weekMoods.length : 0;
      monthlyData.push({ week: `W${4-i}`, avg: parseFloat(weekAvg.toFixed(1)) });
    }

    // 5. Triggers (Tags analysis)
    const tagStats: Record<string, { count: number, totalMood: number }> = {};
    moods.forEach(m => {
      if (m.tags) {
        m.tags.forEach((tag: string) => {
          if (!tagStats[tag]) tagStats[tag] = { count: 0, totalMood: 0 };
          tagStats[tag].count += 1;
          tagStats[tag].totalMood += m.mood;
        });
      }
    });

    const triggers = Object.entries(tagStats)
      .map(([tag, stats]) => {
        const avg = stats.totalMood / stats.count;
        let impact = "mixed";
        if (avg >= 4) impact = "positive";
        else if (avg <= 2) impact = "negative";
        return { tag, count: stats.count, impact, avg };
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 4);

    setData({ avgMood, streak, weeklyData, monthlyData, triggers });
    setLoading(false);

    // Fetch AI Insight
    fetchAIInsight({ avgMood, streak, topTag: triggers[0]?.tag || "none", bottomTag: triggers.find(t => t.impact === "negative")?.tag || "none" }, token);
  };

  const fetchAIInsight = async (stats: any, token: string | null) => {
    setInsightLoading(true);
    try {
      const prompt = `Based on my mental health tracking data: Average mood is ${stats.avgMood}/5. My streak is ${stats.streak} days. My most frequent activity/tag is '${stats.topTag}'. My most negative trigger is '${stats.bottomTag}'. Give me a warm, highly concise 2-sentence psychological insight or encouraging tip based exactly on this data. Do not ask questions. Make sure you don't use any greeting, just give the insight.`;
      
      const res = await fetch(`${API_URL}/api/chat`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [{ role: "user", content: prompt }] })
      });
      
      if (!res.ok) throw new Error("Failed to fetch");

      setInsightLoading(false); // Stop loading spinner, start typing effect
      
      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let fullInsight = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');
          
          for (const line of lines) {
            if (line.startsWith('data: ') && line !== 'data: [DONE]') {
              try {
                const data = JSON.parse(line.slice(6));
                if (data.choices && data.choices[0].delta.content) {
                  fullInsight += data.choices[0].delta.content;
                  setAiInsight(fullInsight);
                }
              } catch (e) {}
            }
          }
        }
      }
      
      if (!fullInsight) {
        setAiInsight("Keep tracking your daily moods to generate deeper insights into your mental wellbeing over time.");
      }
    } catch (err) {
      console.error(err);
      setAiInsight("Unable to load AI insight at the moment. Keep up the great tracking!");
      setInsightLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (data?.empty) {
    return (
      <div className="px-6 py-8 max-w-5xl mx-auto text-center">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-full bg-card shadow-soft flex items-center justify-center">
            <ArrowLeft className="w-4 h-4 text-foreground" />
          </button>
          <h1 className="text-xl font-bold font-display text-foreground">Insights</h1>
        </div>
        <p className="text-muted-foreground py-20 bg-card rounded-2xl shadow-soft">Not enough data to generate insights yet. Start logging your mood!</p>
      </div>
    );
  }

  return (
    <div className="px-6 py-8 max-w-5xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-full bg-card shadow-soft flex items-center justify-center">
          <ArrowLeft className="w-4 h-4 text-foreground" />
        </button>
        <h1 className="text-xl font-bold font-display text-foreground">Insights</h1>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        {/* Summary cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="card-calm text-center py-5">
            <p className="text-3xl font-bold text-primary">{data.avgMood}</p>
            <p className="text-xs text-muted-foreground font-medium mt-1">Avg Mood</p>
          </div>
          <div className="card-calm text-center py-5">
            <p className="text-3xl font-bold text-accent">{data.streak}</p>
            <p className="text-xs text-muted-foreground font-medium mt-1">Day Streak</p>
          </div>
        </div>

        {/* Weekly chart */}
        <div className="card-calm">
          <h3 className="text-sm font-bold font-display text-foreground mb-4">Past 7 Days</h3>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={data.weeklyData}>
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
              <YAxis hide domain={[0, 5]} />
              <Tooltip
                contentStyle={{ borderRadius: 12, border: "none", boxShadow: "var(--shadow-card)", fontSize: 12 }}
                cursor={{ fill: 'transparent' }}
              />
              <Bar dataKey="mood" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly trend */}
        <div className="card-calm">
          <h3 className="text-sm font-bold font-display text-foreground mb-4">Monthly Trend</h3>
          <ResponsiveContainer width="100%" height={120}>
            <AreaChart data={data.monthlyData}>
              <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
              <YAxis hide domain={[0, 5]} />
              <Area type="monotone" dataKey="avg" stroke="hsl(var(--accent))" fill="hsl(var(--mint-light))" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Triggers */}
        {data.triggers.length > 0 && (
          <div className="card-calm">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-4 h-4 text-secondary" />
              <h3 className="text-sm font-bold font-display text-foreground">Top Tags & Impact</h3>
            </div>
            <div className="space-y-2">
              {data.triggers.map((t: any) => (
                <div key={t.tag} className="flex items-center justify-between">
                  <span className="text-xs font-medium text-foreground capitalize">{t.tag}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                    t.impact === "positive" ? "bg-mint-light text-accent" :
                    t.impact === "negative" ? "bg-rose-light text-destructive" :
                    "bg-sky-light text-sky"
                  }`}>
                    {t.count}x • {t.impact}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AI Insight */}
        <div className="card-calm bg-gradient-to-r from-lavender-light to-mint-light relative overflow-hidden">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-bold font-display text-foreground">AI Insight</h3>
          </div>
          {insightLoading ? (
            <div className="flex items-center gap-2 py-2">
              <Loader2 className="w-4 h-4 animate-spin text-primary" />
              <span className="text-xs text-muted-foreground">Analyzing your patterns...</span>
            </div>
          ) : (
            <p className="text-xs text-foreground leading-relaxed relative z-10">
              {aiInsight}
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default InsightsPage;
