import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Play, Pause, RotateCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";

const exercises = [
  { name: "Box Breathing", inhale: 4, hold: 4, exhale: 4, holdOut: 4, color: "from-lavender to-sky" },
  { name: "4-7-8 Relaxing", inhale: 4, hold: 7, exhale: 8, holdOut: 0, color: "from-mint to-sky" },
  { name: "Deep Calm", inhale: 5, hold: 5, exhale: 5, holdOut: 5, color: "from-peach to-rose" },
];

const BreathePage = () => {
  const navigate = useNavigate();
  const [exerciseIdx, setExerciseIdx] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<"inhale" | "hold" | "exhale" | "holdOut">("inhale");
  const [timer, setTimer] = useState(0);
  const [cycles, setCycles] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const ex = exercises[exerciseIdx];

  useEffect(() => {
    if (!isActive) return;

    const durations = { inhale: ex.inhale, hold: ex.hold, exhale: ex.exhale, holdOut: ex.holdOut };
    const phases: ("inhale" | "hold" | "exhale" | "holdOut")[] = ["inhale", "hold", "exhale", "holdOut"];

    let currentPhase = 0;
    let count = 0;
    setPhase("inhale");
    setTimer(ex.inhale);

    intervalRef.current = setInterval(() => {
      count++;
      const dur = durations[phases[currentPhase]];
      setTimer(dur - (count % (dur + 1)));

      if (count >= dur) {
        count = 0;
        currentPhase++;
        if (currentPhase >= phases.length || durations[phases[currentPhase]] === 0) {
          currentPhase = 0;
          setCycles((c) => c + 1);
        }
        setPhase(phases[currentPhase]);
        setTimer(durations[phases[currentPhase]]);
      }
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive, exerciseIdx]);

  const reset = () => {
    setIsActive(false);
    setPhase("inhale");
    setTimer(0);
    setCycles(0);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const phaseLabel = {
    inhale: "Breathe In",
    hold: "Hold",
    exhale: "Breathe Out",
    holdOut: "Hold",
  };

  const circleScale = phase === "inhale" ? 1.4 : phase === "exhale" ? 0.8 : 1.1;

  return (
    <div className="px-6 py-8 max-w-4xl mx-auto min-h-[calc(100vh-64px)] flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-full bg-card shadow-soft flex items-center justify-center">
          <ArrowLeft className="w-4 h-4 text-foreground" />
        </button>
        <h1 className="text-xl font-bold font-display text-foreground">Breathe</h1>
      </div>

      {/* Exercise selector */}
      <div className="flex gap-2 mb-8">
        {exercises.map((e, i) => (
          <button
            key={e.name}
            onClick={() => { setExerciseIdx(i); reset(); }}
            className={`flex-1 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
              exerciseIdx === i ? "bg-primary text-primary-foreground shadow-soft" : "bg-card text-muted-foreground"
            }`}
          >
            {e.name}
          </button>
        ))}
      </div>

      {/* Breathing circle */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="relative w-56 h-56 flex items-center justify-center">
          <motion.div
            animate={{ scale: isActive ? circleScale : 1 }}
            transition={{ duration: phase === "inhale" ? ex.inhale : phase === "exhale" ? ex.exhale : 0.5, ease: "easeInOut" }}
            className={`absolute inset-0 rounded-full bg-gradient-to-br ${ex.color} opacity-20`}
          />
          <motion.div
            animate={{ scale: isActive ? circleScale * 0.85 : 0.85 }}
            transition={{ duration: phase === "inhale" ? ex.inhale : phase === "exhale" ? ex.exhale : 0.5, ease: "easeInOut" }}
            className={`absolute inset-6 rounded-full bg-gradient-to-br ${ex.color} opacity-40`}
          />
          <motion.div
            animate={{ scale: isActive ? circleScale * 0.7 : 0.7 }}
            transition={{ duration: phase === "inhale" ? ex.inhale : phase === "exhale" ? ex.exhale : 0.5, ease: "easeInOut" }}
            className={`absolute inset-12 rounded-full bg-gradient-to-br ${ex.color} opacity-70`}
          />
          <div className="relative z-10 text-center">
            <AnimatePresence mode="wait">
              <motion.p
                key={phase}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="text-lg font-bold font-display text-foreground"
              >
                {isActive ? phaseLabel[phase] : "Ready?"}
              </motion.p>
            </AnimatePresence>
            {isActive && <p className="text-3xl font-bold text-primary mt-1">{timer}</p>}
          </div>
        </div>

        <p className="text-sm text-muted-foreground mt-6">Cycles: {cycles}</p>

        {/* Controls */}
        <div className="flex gap-4 mt-6">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsActive(!isActive)}
            className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-soft"
          >
            {isActive ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={reset}
            className="w-14 h-14 rounded-full bg-card text-foreground flex items-center justify-center shadow-soft"
          >
            <RotateCcw className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default BreathePage;
