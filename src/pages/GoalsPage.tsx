import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Check, Trash2, Target, Flame, Trophy, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

interface Goal {
  id: string;
  title: string;
  emoji: string;
  completed: boolean;
  category: "wellness" | "fitness" | "mindfulness" | "social" | "custom";
}

interface HabitItem {
  id: string;
  name: string;
  emoji: string;
  streak: number;
  completedToday: boolean;
  weekLog: boolean[];
}

const defaultHabits = [
  { name: "Meditate 10 min", emoji: "🧘" },
  { name: "Sleep 8 hours", emoji: "😴" },
  { name: "Drink 8 glasses", emoji: "💧" },
];

const defaultGoals = [
  { title: "Complete breathing exercise", emoji: "🌬️", category: "mindfulness" },
  { title: "Write in journal", emoji: "✍️", category: "mindfulness" },
  { title: "Take a nature walk", emoji: "🌿", category: "wellness" },
];

const suggestedGoals = [
  { emoji: "🌅", title: "Morning routine", category: "wellness" as const },
  { emoji: "📖", title: "Read 20 pages", category: "mindfulness" as const },
  { emoji: "🥗", title: "Eat healthy meal", category: "wellness" as const },
  { emoji: "🚶", title: "Walk 5000 steps", category: "fitness" as const },
  { emoji: "😊", title: "Practice gratitude", category: "mindfulness" as const },
  { emoji: "👋", title: "Connect with a friend", category: "social" as const },
];

const weekDays = ["M", "T", "W", "T", "F", "S", "S"];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
};

const GoalsPage = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [habits, setHabits] = useState<HabitItem[]>([]);
  const [newGoal, setNewGoal] = useState("");
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [newHabit, setNewHabit] = useState("");
  const [showAddHabit, setShowAddHabit] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = { "Authorization": `Bearer ${token}` };

        const [goalsRes, habitsRes] = await Promise.all([
          fetch(`${API_URL}/api/goals`, { headers }),
          fetch(`${API_URL}/api/habits`, { headers }),
        ]);

        if (goalsRes.ok) {
          let goalsData = await goalsRes.json();
          
          // Seed default goals if empty
          if (goalsData.length === 0) {
             const seededGoals = [];
             for (const g of defaultGoals) {
               const res = await fetch(`${API_URL}/api/goals`, {
                 method: "POST",
                 headers: { ...headers, "Content-Type": "application/json" },
                 body: JSON.stringify({ title: g.title, emoji: g.emoji, category: g.category })
               });
               if (res.ok) {
                 seededGoals.push(await res.json());
               }
             }
             goalsData = seededGoals;
          }
          setGoals(goalsData.map((g: any) => ({ ...g, id: g._id })));
        }

        if (habitsRes.ok) {
          let habitsData = await habitsRes.json();
          
          // Seed default habits if empty
          if (habitsData.length === 0) {
             const seededHabits = [];
             for (const h of defaultHabits) {
               const res = await fetch(`${API_URL}/api/habits`, {
                 method: "POST",
                 headers: { ...headers, "Content-Type": "application/json" },
                 body: JSON.stringify({ name: h.name, emoji: h.emoji })
               });
               if (res.ok) {
                 seededHabits.push(await res.json());
               }
             }
             habitsData = seededHabits;
          }
          setHabits(habitsData.map((h: any) => ({ ...h, id: h._id })));
        }
      } catch (err) {
        console.error("Failed to fetch goals/habits", err);
      }
    };
    fetchData();
  }, []);

  const completedCount = goals.filter((g) => g.completed).length;
  const completionPct = goals.length > 0 ? Math.round((completedCount / goals.length) * 100) : 0;
  const habitsCompletedToday = habits.filter((h) => h.completedToday).length;

  const toggleGoal = async (id: string) => {
    // Optimistic UI update
    setGoals((prev) => prev.map((g) => (g.id === id ? { ...g, completed: !g.completed } : g)));
    try {
      const token = localStorage.getItem("token");
      await fetch(`${API_URL}/api/goals/${id}`, {
        method: "PUT",
        headers: { "Authorization": `Bearer ${token}` }
      });
    } catch (err) {
      console.error(err);
      // Revert on error
      setGoals((prev) => prev.map((g) => (g.id === id ? { ...g, completed: !g.completed } : g)));
    }
  };

  const deleteGoal = async (id: string) => {
    // Optimistic UI update
    const previousGoals = [...goals];
    setGoals((prev) => prev.filter((g) => g.id !== id));
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/goals/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to delete");
    } catch (err) {
      console.error(err);
      setGoals(previousGoals); // Revert on error
    }
  };

  const addGoal = async (title: string, emoji = "🎯") => {
    if (!title.trim()) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/goals`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim(), emoji, category: "custom" })
      });
      if (res.ok) {
        const newGoalData = await res.json();
        setGoals((prev) => [...prev, { ...newGoalData, id: newGoalData._id }]);
        setNewGoal("");
        setShowAddGoal(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const toggleHabit = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/habits/${id}`, {
        method: "PUT",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const updated = await res.json();
        setHabits((prev) => prev.map((h) => (h.id === id ? { ...updated, id: updated._id } : h)));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const addHabit = async (name: string, emoji = "🔥") => {
    if (!name.trim()) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/habits`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), emoji })
      });
      if (res.ok) {
        const newHabitData = await res.json();
        setHabits((prev) => [...prev, { ...newHabitData, id: newHabitData._id }]);
        setNewHabit("");
        setShowAddHabit(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteHabit = async (id: string) => {
    const previousHabits = [...habits];
    setHabits((prev) => prev.filter((h) => h.id !== id));
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/habits/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to delete");
    } catch (err) {
      console.error(err);
      setHabits(previousHabits);
    }
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="px-6 py-8 max-w-5xl mx-auto"
    >
      {/* Header */}
      <motion.div variants={item} className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Target className="w-5 h-5 text-primary" />
          <h1 className="text-2xl font-bold font-display text-foreground">Today's Goals</h1>
        </div>
        <p className="text-muted-foreground text-sm">Track your daily wellness goals & habits</p>
      </motion.div>

      {/* Progress Overview */}
      <motion.div variants={item} className="card-calm gradient-calm mb-6 relative overflow-hidden">
        <div className="absolute top-2 right-3 text-2xl animate-float">🏆</div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs font-semibold text-primary tracking-wider uppercase">Daily Progress</p>
              <p className="text-3xl font-bold font-display text-foreground mt-1">{completionPct}%</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <p className="text-lg font-bold text-foreground">{completedCount}/{goals.length}</p>
                <p className="text-[10px] text-muted-foreground">Goals</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-foreground">{habitsCompletedToday}/{habits.length}</p>
                <p className="text-[10px] text-muted-foreground">Habits</p>
              </div>
            </div>
          </div>
          <Progress value={completionPct} className="h-2.5 bg-muted/50" />
        </div>
      </motion.div>

      {/* Daily Goals */}
      <motion.div variants={item} className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold font-display text-foreground flex items-center gap-1.5">
            <Check className="w-4 h-4 text-accent" /> Daily Goals
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAddGoal(!showAddGoal)}
            className="text-primary text-xs h-7 px-2"
          >
            <Plus className="w-3.5 h-3.5 mr-1" /> Add
          </Button>
        </div>

        {/* Add goal input */}
        <AnimatePresence>
          {showAddGoal && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-3"
            >
              <div className="flex gap-2 mb-2">
                <Input
                  value={newGoal}
                  onChange={(e) => setNewGoal(e.target.value)}
                  placeholder="What's your goal today?"
                  className="text-sm bg-card border-border"
                  onKeyDown={(e) => e.key === "Enter" && addGoal(newGoal)}
                />
                <Button size="sm" onClick={() => addGoal(newGoal)} className="shrink-0">
                  Add
                </Button>
              </div>
              <button
                onClick={() => setShowSuggestions(!showSuggestions)}
                className="text-xs text-muted-foreground flex items-center gap-1 hover:text-primary transition-colors"
              >
                Suggestions {showSuggestions ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
              <AnimatePresence>
                {showSuggestions && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {suggestedGoals.map((sg) => (
                        <button
                          key={sg.title}
                          onClick={() => addGoal(sg.title, sg.emoji)}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-lavender-light text-xs font-medium text-foreground hover:bg-primary/20 transition-colors"
                        >
                          {sg.emoji} {sg.title}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Goal list */}
        <div className="space-y-2">
          <AnimatePresence>
            {goals.map((goal) => (
              <motion.div
                key={goal.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20, height: 0 }}
                className={`card-calm flex items-center gap-3 transition-all ${
                  goal.completed ? "opacity-60" : ""
                }`}
              >
                <button
                  onClick={() => toggleGoal(goal.id)}
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                    goal.completed
                      ? "bg-accent border-accent"
                      : "border-muted-foreground/30 hover:border-primary"
                  }`}
                >
                  {goal.completed && <Check className="w-3.5 h-3.5 text-accent-foreground" />}
                </button>
                <span className="text-lg">{goal.emoji}</span>
                <span
                  className={`flex-1 text-sm font-medium ${
                    goal.completed ? "line-through text-muted-foreground" : "text-foreground"
                  }`}
                >
                  {goal.title}
                </span>
                <button
                  onClick={() => deleteGoal(goal.id)}
                  className="text-muted-foreground/40 hover:text-destructive transition-colors p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
          {goals.length === 0 && (
            <p className="text-center text-sm text-muted-foreground py-6">
              No goals yet. Add one to get started! ✨
            </p>
          )}
        </div>
      </motion.div>

      {/* Habit Tracker */}
      <motion.div variants={item} className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold font-display text-foreground flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-secondary" /> Habit Tracker
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAddHabit(!showAddHabit)}
            className="text-primary text-xs h-7 px-2"
          >
            <Plus className="w-3.5 h-3.5 mr-1" /> Add
          </Button>
        </div>

        {/* Add habit input */}
        <AnimatePresence>
          {showAddHabit && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-3"
            >
              <div className="flex gap-2 mb-2">
                <Input
                  value={newHabit}
                  onChange={(e) => setNewHabit(e.target.value)}
                  placeholder="What habit do you want to build?"
                  className="text-sm bg-card border-border"
                  onKeyDown={(e) => e.key === "Enter" && addHabit(newHabit)}
                />
                <Button size="sm" onClick={() => addHabit(newHabit)} className="shrink-0">
                  Add
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-2">
          {habits.map((habit) => (
            <motion.div
              key={habit.id}
              layout
              className="card-calm"
            >
              <div className="flex items-center gap-3 mb-2">
                <button
                  onClick={() => toggleHabit(habit.id)}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                    habit.completedToday
                      ? "bg-accent/20 shadow-sm"
                      : "bg-muted/50"
                  }`}
                >
                  <span className="text-lg">{habit.emoji}</span>
                </button>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-semibold ${habit.completedToday ? "text-accent" : "text-foreground"}`}>
                    {habit.name}
                  </p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Flame className="w-3 h-3 text-secondary" />
                    <span className="text-[10px] font-bold text-secondary">{habit.streak} day streak</span>
                  </div>
                </div>
                <button
                  onClick={() => toggleHabit(habit.id)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                    habit.completedToday
                      ? "bg-accent text-accent-foreground"
                      : "bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary"
                  }`}
                >
                  {habit.completedToday ? "Done ✓" : "Do it"}
                </button>
                <button
                  onClick={() => deleteHabit(habit.id)}
                  className="text-muted-foreground/40 hover:text-destructive transition-colors p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              {/* Week view */}
              <div className="flex gap-1.5 ml-[52px]">
                {weekDays.map((day, i) => (
                  <div key={i} className="flex flex-col items-center gap-0.5">
                    <span className="text-[9px] text-muted-foreground">{day}</span>
                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] ${
                        i === 6
                          ? habit.completedToday
                            ? "bg-accent text-accent-foreground font-bold"
                            : "bg-muted/80 text-muted-foreground"
                          : habit.weekLog[i]
                          ? "bg-primary/20 text-primary font-bold"
                          : "bg-muted/40 text-muted-foreground/40"
                      }`}
                    >
                      {(i === 6 ? habit.completedToday : habit.weekLog[i]) ? "✓" : "·"}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Motivational footer */}
      <motion.div variants={item} className="text-center py-4">
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Trophy className="w-4 h-4 text-primary" />
          <span>Small steps lead to big changes 💜</span>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default GoalsPage;
