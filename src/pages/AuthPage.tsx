import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User as UserIcon, Loader2, Sparkles, Heart, Brain } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
    const url = `${API_URL}${endpoint}`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify({ name: data.name, email: data.email, id: data._id }));
        toast.success(isLogin ? "Welcome back to MindSpace!" : "Account created successfully!");
        navigate("/");
      } else {
        toast.error(data.error || "An error occurred");
      }
    } catch (error) {
      console.error("Auth error:", error);
      toast.error("Network error. Please make sure the backend is running.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center bg-background selection:bg-primary/20">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-lavender-light blur-3xl opacity-60 animate-pulse-soft" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-mint-light blur-3xl opacity-60 animate-pulse-soft" style={{ animationDelay: "1s" }} />
      <div className="absolute top-[20%] right-[10%] w-[20%] h-[20%] rounded-full bg-rose-light blur-3xl opacity-40 animate-float" />
      <div className="absolute bottom-[20%] left-[10%] w-[20%] h-[20%] rounded-full bg-sky-light blur-3xl opacity-40 animate-float" style={{ animationDelay: "1.5s" }} />

      <div className="w-full max-w-[1000px] flex gap-8 z-10 px-6 max-md:flex-col items-center">
        {/* Left/Top Content - Brand Area */}
        <motion.div 
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex-1 flex flex-col justify-center max-md:text-center text-left space-y-6 max-md:mt-8"
        >
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
            className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center shadow-xl max-md:mx-auto relative"
          >
            <div className="absolute inset-0 rounded-3xl bg-white/20 backdrop-blur-sm" />
            <Brain className="w-10 h-10 text-white relative z-10 animate-float" />
          </motion.div>
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-black font-display text-foreground tracking-tight">
              MindSpace
            </h1>
            <p className="text-xl text-muted-foreground font-medium max-w-md max-md:mx-auto leading-relaxed">
              Your personal sanctuary for mental wellness, mindfulness, and emotional tracking.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-4 pt-4 max-md:justify-center">
            <div className="flex items-center gap-2 bg-white/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/50 shadow-sm text-sm font-semibold text-primary">
              <Heart className="w-4 h-4 fill-primary/20" /> Mood Tracking
            </div>
            <div className="flex items-center gap-2 bg-white/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/50 shadow-sm text-sm font-semibold text-accent">
              <Sparkles className="w-4 h-4 fill-accent/20" /> AI Companion
            </div>
          </div>
        </motion.div>

        {/* Right Content - Auth Form */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
          className="w-full max-w-[420px]"
        >
          <div className="glass border border-white/40 shadow-2xl rounded-[2.5rem] p-8 md:p-10 relative overflow-hidden bg-white/60 backdrop-blur-2xl">
            {/* Inner glow */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/60 to-transparent pointer-events-none" />
            
            <div className="relative z-10">
              <div className="text-center mb-8 space-y-2">
                <h2 className="text-3xl font-bold font-display text-foreground">
                  {isLogin ? "Welcome Back" : "Create Account"}
                </h2>
                <p className="text-muted-foreground text-sm font-medium">
                  {isLogin
                    ? "Log in to continue your wellness journey"
                    : "Join us and prioritize your mental health"}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <AnimatePresence mode="popLayout">
                  {!isLogin && (
                    <motion.div
                      key="name"
                      initial={{ opacity: 0, y: -10, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: "auto" }}
                      exit={{ opacity: 0, y: -10, height: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="relative group">
                        <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Full Name"
                          required={!isLogin}
                          className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white/50 border-2 border-white/60 focus:border-primary/50 focus:bg-white transition-all outline-none shadow-sm text-foreground placeholder:text-muted-foreground/70 font-medium"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email Address"
                    required
                    className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white/50 border-2 border-white/60 focus:border-primary/50 focus:bg-white transition-all outline-none shadow-sm text-foreground placeholder:text-muted-foreground/70 font-medium"
                  />
                </div>

                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Password"
                    required
                    minLength={6}
                    className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white/50 border-2 border-white/60 focus:border-primary/50 focus:bg-white transition-all outline-none shadow-sm text-foreground placeholder:text-muted-foreground/70 font-medium"
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 mt-2 rounded-2xl bg-gradient-to-r from-primary to-accent text-white font-bold text-lg shadow-lg shadow-primary/25 flex justify-center items-center gap-2 hover:shadow-xl hover:shadow-primary/30 transition-all disabled:opacity-70 disabled:hover:scale-100"
                >
                  {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
                  {isLogin ? "Sign In" : "Get Started"}
                </motion.button>
              </form>

              <div className="mt-8 text-center relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border/50" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-card text-muted-foreground rounded-full border border-border/50 shadow-sm font-medium">
                    {isLogin ? "New to MindSpace?" : "Already a member?"}
                  </span>
                </div>
              </div>
              
              <div className="mt-6 text-center">
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-primary font-bold hover:text-accent transition-colors text-base"
                >
                  {isLogin ? "Create an account" : "Sign in to your account"}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthPage;
