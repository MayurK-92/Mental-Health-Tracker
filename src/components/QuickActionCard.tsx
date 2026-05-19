import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface QuickActionCardProps {
  icon: LucideIcon;
  label: string;
  gradient: string;
  onClick?: () => void;
  emoji?: string;
}

const QuickActionCard = ({ icon: Icon, label, gradient, onClick, emoji }: QuickActionCardProps) => {
  return (
    <motion.button
      whileTap={{ scale: 0.93 }}
      whileHover={{ scale: 1.03 }}
      onClick={onClick}
      className="flex flex-col items-center gap-2"
    >
      <div className={`w-[72px] h-[72px] rounded-full flex items-center justify-center ${gradient} shadow-soft`}>
        {emoji ? (
          <span className="text-2xl">{emoji}</span>
        ) : (
          <Icon className="w-7 h-7 text-primary-foreground" />
        )}
      </div>
      <span className="text-xs font-semibold text-foreground">{label}</span>
    </motion.button>
  );
};

export default QuickActionCard;
