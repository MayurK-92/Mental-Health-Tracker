import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ClipboardCheck, ChevronRight, RotateCcw, AlertTriangle, CheckCircle2, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

// ── Assessment Data ──

interface Question {
  text: string;
}

interface Assessment {
  id: string;
  name: string;
  description: string;
  emoji: string;
  gradient: string;
  questions: Question[];
  options: { label: string; value: number }[];
  interpret: (score: number) => { level: string; color: string; message: string; suggestions: string[] };
}

const gad7: Assessment = {
  id: "gad7",
  name: "GAD-7 Anxiety",
  description: "Generalized Anxiety Disorder 7-item scale. Over the last 2 weeks, how often have you been bothered by the following?",
  emoji: "😰",
  gradient: "from-lavender to-sky",
  questions: [
    { text: "Feeling nervous, anxious, or on edge" },
    { text: "Not being able to stop or control worrying" },
    { text: "Worrying too much about different things" },
    { text: "Trouble relaxing" },
    { text: "Being so restless that it's hard to sit still" },
    { text: "Becoming easily annoyed or irritable" },
    { text: "Feeling afraid as if something awful might happen" },
  ],
  options: [
    { label: "Not at all", value: 0 },
    { label: "Several days", value: 1 },
    { label: "More than half the days", value: 2 },
    { label: "Nearly every day", value: 3 },
  ],
  interpret: (score) => {
    if (score <= 4) return { level: "Minimal Anxiety", color: "text-accent", message: "Your anxiety levels appear to be within a healthy range. Keep up your wellness habits!", suggestions: ["Continue mindfulness practice", "Maintain regular exercise", "Keep a gratitude journal"] };
    if (score <= 9) return { level: "Mild Anxiety", color: "text-sky", message: "You may be experiencing mild anxiety. Consider incorporating relaxation techniques into your routine.", suggestions: ["Try daily breathing exercises", "Practice progressive muscle relaxation", "Limit caffeine intake", "Maintain a regular sleep schedule"] };
    if (score <= 14) return { level: "Moderate Anxiety", color: "text-secondary", message: "Your results suggest moderate anxiety. It may be helpful to speak with a healthcare professional.", suggestions: ["Consider speaking with a therapist", "Practice daily meditation", "Use the breathing exercises in this app", "Journal about your worries to externalize them"] };
    return { level: "Severe Anxiety", color: "text-destructive", message: "Your results suggest severe anxiety. We strongly recommend reaching out to a mental health professional.", suggestions: ["Please consult a mental health professional", "Call 988 Suicide & Crisis Lifeline if in crisis", "Practice grounding techniques (5-4-3-2-1)", "Reach out to a trusted friend or family member"] };
  },
};

const phq9: Assessment = {
  id: "phq9",
  name: "PHQ-9 Depression",
  description: "Patient Health Questionnaire 9-item scale. Over the last 2 weeks, how often have you been bothered by the following?",
  emoji: "😞",
  gradient: "from-peach to-rose",
  questions: [
    { text: "Little interest or pleasure in doing things" },
    { text: "Feeling down, depressed, or hopeless" },
    { text: "Trouble falling or staying asleep, or sleeping too much" },
    { text: "Feeling tired or having little energy" },
    { text: "Poor appetite or overeating" },
    { text: "Feeling bad about yourself — or that you are a failure or have let yourself or your family down" },
    { text: "Trouble concentrating on things, such as reading or watching TV" },
    { text: "Moving or speaking so slowly that other people could have noticed? Or being so fidgety or restless?" },
    { text: "Thoughts that you would be better off dead, or of hurting yourself" },
  ],
  options: [
    { label: "Not at all", value: 0 },
    { label: "Several days", value: 1 },
    { label: "More than half the days", value: 2 },
    { label: "Nearly every day", value: 3 },
  ],
  interpret: (score) => {
    if (score <= 4) return { level: "Minimal Depression", color: "text-accent", message: "Your results suggest minimal depressive symptoms. Continue taking care of your mental health!", suggestions: ["Maintain social connections", "Stay physically active", "Practice self-care routines"] };
    if (score <= 9) return { level: "Mild Depression", color: "text-sky", message: "You may be experiencing mild depression. Small lifestyle changes can make a big difference.", suggestions: ["Increase physical activity", "Establish a daily routine", "Connect with friends and family", "Try gratitude journaling"] };
    if (score <= 14) return { level: "Moderate Depression", color: "text-secondary", message: "Your results suggest moderate depression. Consider reaching out to a mental health professional.", suggestions: ["Speak with a therapist or counselor", "Consider behavioral activation techniques", "Maintain a consistent sleep schedule", "Engage in activities you used to enjoy"] };
    if (score <= 19) return { level: "Moderately Severe Depression", color: "text-destructive", message: "Your results suggest moderately severe depression. Professional support is recommended.", suggestions: ["Please consult a mental health professional", "Consider therapy and/or medication options", "Build a support network", "Use crisis resources if needed: call 988"] };
    return { level: "Severe Depression", color: "text-destructive", message: "Your results suggest severe depression. Please seek professional help as soon as possible.", suggestions: ["Seek immediate professional help", "Call 988 Suicide & Crisis Lifeline", "Go to your nearest emergency room if in danger", "Tell someone you trust how you're feeling"] };
  },
};

const stressQuiz: Assessment = {
  id: "stress",
  name: "Stress Assessment",
  description: "Perceived Stress Scale (adapted). In the last month, how often have you felt the following?",
  emoji: "🤯",
  gradient: "from-mint to-sky",
  questions: [
    { text: "Been upset because of something that happened unexpectedly" },
    { text: "Felt unable to control the important things in your life" },
    { text: "Felt nervous and stressed" },
    { text: "Felt confident about your ability to handle personal problems" },
    { text: "Felt that things were going your way" },
    { text: "Found that you could not cope with all the things you had to do" },
    { text: "Been able to control irritations in your life" },
    { text: "Felt that you were on top of things" },
    { text: "Been angered because of things outside of your control" },
    { text: "Felt difficulties were piling up so high you could not overcome them" },
  ],
  options: [
    { label: "Never", value: 0 },
    { label: "Almost never", value: 1 },
    { label: "Sometimes", value: 2 },
    { label: "Fairly often", value: 3 },
    { label: "Very often", value: 4 },
  ],
  interpret: (score) => {
    if (score <= 13) return { level: "Low Stress", color: "text-accent", message: "You're managing stress well! Your coping mechanisms seem effective.", suggestions: ["Keep up your current stress management", "Continue regular exercise", "Maintain work-life balance"] };
    if (score <= 26) return { level: "Moderate Stress", color: "text-secondary", message: "You're experiencing moderate stress. Consider adding more relaxation techniques to your routine.", suggestions: ["Practice daily mindfulness meditation", "Use breathing exercises when feeling overwhelmed", "Set boundaries at work and home", "Make time for hobbies and relaxation"] };
    return { level: "High Stress", color: "text-destructive", message: "Your stress levels are high. It's important to take action to manage your stress.", suggestions: ["Consider professional stress management counseling", "Practice daily relaxation techniques", "Evaluate and reduce major stressors", "Prioritize sleep and physical health", "Use the breathing exercises in this app daily"] };
  },
};

const assessments = [gad7, phq9, stressQuiz];

// ── Component ──

type View = "list" | "quiz" | "result";

const AssessmentPage = () => {
  const navigate = useNavigate();
  const [view, setView] = useState<View>("list");
  const [activeAssessment, setActiveAssessment] = useState<Assessment | null>(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);

  const startAssessment = (a: Assessment) => {
    setActiveAssessment(a);
    setCurrentQ(0);
    setAnswers([]);
    setView("quiz");
  };

  const selectAnswer = (value: number) => {
    const newAnswers = [...answers, value];
    setAnswers(newAnswers);
    if (activeAssessment && currentQ < activeAssessment.questions.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      setView("result");
    }
  };

  const totalScore = answers.reduce((a, b) => a + b, 0);
  const maxScore = activeAssessment
    ? activeAssessment.questions.length * activeAssessment.options[activeAssessment.options.length - 1].value
    : 1;
  const result = activeAssessment ? activeAssessment.interpret(totalScore) : null;

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.06 } },
  };
  const item = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="px-6 py-8 max-w-3xl mx-auto"
    >
      {/* Header */}
      <motion.div variants={item} className="flex items-center gap-3 mb-8">
        <button
          onClick={() => {
            if (view === "list") navigate(-1);
            else { setView("list"); setActiveAssessment(null); }
          }}
          className="w-9 h-9 rounded-full bg-card shadow-soft flex items-center justify-center hover:shadow-md transition-shadow"
        >
          <ArrowLeft className="w-4 h-4 text-foreground" />
        </button>
        <h1 className="text-2xl font-bold font-display text-foreground">
          {view === "list" ? "Self-Assessments" : activeAssessment?.name}
        </h1>
      </motion.div>

      <AnimatePresence mode="wait">
        {/* ── Assessment List ── */}
        {view === "list" && (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            <motion.div variants={item} className="card-calm bg-sky-light/30 flex items-start gap-3 mb-6">
              <Info className="w-5 h-5 text-sky shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-foreground">About these assessments</p>
                <p className="text-xs text-muted-foreground mt-1">
                  These are clinically-validated screening tools, not diagnostic instruments. 
                  Results are for self-awareness only. Please consult a healthcare professional for diagnosis and treatment.
                </p>
              </div>
            </motion.div>

            {assessments.map((a) => (
              <motion.button
                key={a.id}
                variants={item}
                whileHover={{ scale: 1.01, y: -2 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => startAssessment(a)}
                className="w-full card-calm flex items-center gap-4 text-left group hover:shadow-soft transition-all"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${a.gradient} flex items-center justify-center text-2xl shrink-0 shadow-soft`}>
                  {a.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-foreground flex items-center gap-2">
                    {a.name}
                    <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">{a.questions.length} questions • ~{a.questions.length} min</p>
                </div>
              </motion.button>
            ))}
          </motion.div>
        )}

        {/* ── Quiz View ── */}
        {view === "quiz" && activeAssessment && (
          <motion.div
            key="quiz"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
          >
            <div className="mb-6">
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                <span>Question {currentQ + 1} of {activeAssessment.questions.length}</span>
                <span>{Math.round(((currentQ) / activeAssessment.questions.length) * 100)}%</span>
              </div>
              <Progress value={(currentQ / activeAssessment.questions.length) * 100} className="h-2" />
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentQ}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ type: "spring", stiffness: 300, damping: 28 }}
              >
                <div className="card-calm gradient-calm mb-6">
                  <p className="text-base font-semibold text-foreground leading-relaxed">
                    {activeAssessment.questions[currentQ].text}
                  </p>
                </div>

                <div className="space-y-3">
                  {activeAssessment.options.map((opt) => (
                    <motion.button
                      key={opt.value}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => selectAnswer(opt.value)}
                      className="w-full card-calm flex items-center gap-3 hover:shadow-soft hover:border-primary/20 border border-transparent transition-all text-left"
                    >
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground shrink-0">
                        {opt.value}
                      </div>
                      <span className="text-sm font-medium text-foreground">{opt.label}</span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        )}

        {/* ── Result View ── */}
        {view === "result" && activeAssessment && result && (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {/* Score Card */}
            <div className="card-calm gradient-calm text-center py-8">
              <div className="text-5xl mb-3">{activeAssessment.emoji}</div>
              <h2 className={`text-2xl font-bold font-display ${result.color}`}>{result.level}</h2>
              <div className="flex items-center justify-center gap-2 mt-3 mb-4">
                <span className="text-4xl font-bold text-foreground">{totalScore}</span>
                <span className="text-lg text-muted-foreground">/ {maxScore}</span>
              </div>
              <Progress value={(totalScore / maxScore) * 100} className="h-3 max-w-xs mx-auto" />
            </div>

            {/* Interpretation */}
            <div className="card-calm">
              <h3 className="text-sm font-bold text-foreground mb-2 flex items-center gap-2">
                <ClipboardCheck className="w-4 h-4 text-primary" /> Interpretation
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{result.message}</p>
            </div>

            {/* Suggestions */}
            <div className="card-calm">
              <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-accent" /> Recommendations
              </h3>
              <ul className="space-y-2">
                {result.suggestions.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="w-5 h-5 rounded-full bg-accent/10 text-accent flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>

            {/* Disclaimer */}
            <div className="card-calm bg-destructive/5 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground">
                This assessment is a screening tool, not a clinical diagnosis. If you're struggling, 
                please reach out to a qualified mental health professional. In crisis, call <strong>988</strong> or text <strong>HOME to 741741</strong>.
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => startAssessment(activeAssessment)}
                className="flex-1 gap-2"
              >
                <RotateCcw className="w-4 h-4" /> Retake
              </Button>
              <Button
                onClick={() => { setView("list"); setActiveAssessment(null); }}
                className="flex-1"
              >
                All Assessments
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AssessmentPage;
