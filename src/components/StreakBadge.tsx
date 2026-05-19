import { motion } from "framer-motion";
import { Flame } from "lucide-react";

interface StreakBadgeProps {
  streak: number;
}

const StreakBadge = ({ streak }: StreakBadgeProps) => {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-peach-light"
    >
      <Flame className="w-4 h-4 text-secondary" />
      <span className="text-sm font-bold text-secondary">{streak}</span>
    </motion.div>
  );
};

export default StreakBadge;
