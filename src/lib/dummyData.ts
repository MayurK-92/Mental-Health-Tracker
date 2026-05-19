export const moodHistory = [
  { date: "2026-04-13", mood: 4, emoji: "😊", label: "Good", tags: ["exercise", "sleep"], note: "Had a great morning walk" },
  { date: "2026-04-12", mood: 3, emoji: "😐", label: "Okay", tags: ["work", "stress"], note: "Busy day at work" },
  { date: "2026-04-11", mood: 5, emoji: "🤩", label: "Great", tags: ["friends", "exercise"], note: "Fun evening with friends" },
  { date: "2026-04-10", mood: 2, emoji: "😔", label: "Not Great", tags: ["sleep", "stress"], note: "Couldn't sleep well" },
  { date: "2026-04-09", mood: 4, emoji: "😊", label: "Good", tags: ["meditation"], note: "Started meditating" },
  { date: "2026-04-08", mood: 3, emoji: "😐", label: "Okay", tags: ["work"], note: "" },
  { date: "2026-04-07", mood: 4, emoji: "😊", label: "Good", tags: ["exercise", "hydration"], note: "Drank lots of water today" },
];

export const weeklyMoodData = [
  { day: "Mon", mood: 3 },
  { day: "Tue", mood: 4 },
  { day: "Wed", mood: 2 },
  { day: "Thu", mood: 4 },
  { day: "Fri", mood: 5 },
  { day: "Sat", mood: 4 },
  { day: "Sun", mood: 4 },
];

export const journalPrompts = [
  "What are you grateful for today?",
  "Describe a moment that made you smile this week.",
  "What's one thing you'd like to improve about your day?",
  "Write about a challenge you overcame recently.",
  "What does your ideal peaceful day look like?",
  "Name three things that bring you calm.",
  "What boundary do you need to set this week?",
];

export const journalEntries = [
  { id: "1", date: "2026-04-13", title: "Morning Reflections", content: "Today I woke up feeling refreshed. The sun was streaming through my window and I took a moment to appreciate the quiet morning...", type: "free" as const },
  { id: "2", date: "2026-04-12", title: "Gratitude", content: "1. My morning coffee\n2. A call from an old friend\n3. The cool breeze during my evening walk", type: "gratitude" as const },
  { id: "3", date: "2026-04-11", title: "Processing Feelings", content: "I've been thinking about how I react to stressful situations at work. I noticed that when I take a deep breath before responding...", type: "guided" as const },
];

export const badges = [
  { id: "1", name: "First Entry", emoji: "✨", earned: true },
  { id: "2", name: "7-Day Streak", emoji: "🔥", earned: true },
  { id: "3", name: "Mindful Master", emoji: "🧘", earned: true },
  { id: "4", name: "Journal Pro", emoji: "📝", earned: false },
  { id: "5", name: "Zen Mode", emoji: "☮️", earned: false },
  { id: "6", name: "30-Day Streak", emoji: "💎", earned: false },
];

export const goals = [
  { id: "1", name: "Meditate daily", progress: 5, target: 7, icon: "🧘" },
  { id: "2", name: "Journal 3x/week", progress: 2, target: 3, icon: "📝" },
  { id: "3", name: "Sleep 8 hours", progress: 4, target: 7, icon: "😴" },
  { id: "4", name: "Exercise", progress: 3, target: 5, icon: "🏃" },
];

export const tags = [
  "work", "sleep", "exercise", "stress", "relationships", 
  "meditation", "hydration", "friends", "family", "gratitude",
  "anxiety", "creativity", "nature", "reading", "self-care"
];
