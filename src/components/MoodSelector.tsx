import { useState } from "react";
import { motion } from "framer-motion";

const moods = [
  { emoji: "🤩", label: "Great", value: 5, color: "bg-mint-light text-accent" },
  { emoji: "😊", label: "Good", value: 4, color: "bg-lavender-light text-primary" },
  { emoji: "😐", label: "Okay", value: 3, color: "bg-sky-light text-sky" },
  { emoji: "😔", label: "Not Great", value: 2, color: "bg-peach-light text-secondary" },
  { emoji: "😢", label: "Bad", value: 1, color: "bg-rose-light text-destructive" },
];

interface MoodSelectorProps {
  onSelect?: (mood: { emoji: string; label: string; value: number }) => void;
  selected?: number | null;
}

const MoodSelector = ({ onSelect, selected }: MoodSelectorProps) => {
  const [selectedMood, setSelectedMood] = useState<number | null>(selected ?? null);

  const handleSelect = (mood: typeof moods[0]) => {
    setSelectedMood(mood.value);
    onSelect?.(mood);
  };

  return (
    <div className="flex justify-center gap-2 w-full">
      {moods.map((mood) => (
        <motion.button
          key={mood.value}
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.05 }}
          onClick={() => handleSelect(mood)}
          className={`flex items-center justify-center gap-1 px-2.5 py-2 rounded-full border-2 transition-all font-semibold text-xs whitespace-nowrap flex-1 min-w-0 ${
            selectedMood === mood.value
              ? `${mood.color} border-current shadow-soft`
              : "bg-card border-border text-muted-foreground hover:border-primary/30"
          }`}
        >
          <span className="text-lg">{mood.emoji}</span>
          <span>{mood.label}</span>
        </motion.button>
      ))}
    </div>
  );
};

export default MoodSelector;
