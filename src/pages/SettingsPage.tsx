import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Camera, User, Bell, Moon, Shield, ChevronRight, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

interface UserProfile {
  name: string;
  email: string;
  avatarSeed: string;
  bio: string;
}

interface UserPreferences {
  darkMode: boolean;
  dailyReminders: boolean;
  weeklyReport: boolean;
  soundEffects: boolean;
  moodReminder: string;
}

const avatarSeeds = ["mindspace", "felix", "luna", "aria", "kai", "sage", "nova", "ember", "sky", "river", "maple", "coral"];

const defaultProfile: UserProfile = {
  name: "Friend",
  email: "",
  avatarSeed: "mindspace",
  bio: "",
};

const defaultPrefs: UserPreferences = {
  darkMode: false,
  dailyReminders: true,
  weeklyReport: true,
  soundEffects: true,
  moodReminder: "09:00",
};

const SettingsPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [profile, setProfile] = useState<UserProfile>(() => {
    // Get local UI preferences (like avatar, bio)
    const savedProfile = localStorage.getItem("mindspace-profile");
    const parsedProfile = savedProfile ? JSON.parse(savedProfile) : defaultProfile;
    
    // Get authenticated user info (name, email)
    const authUserRaw = localStorage.getItem("user");
    if (authUserRaw) {
      try {
        const authUser = JSON.parse(authUserRaw);
        return {
          ...parsedProfile,
          name: authUser.name || parsedProfile.name,
          email: authUser.email || parsedProfile.email,
        };
      } catch (e) {
        console.error("Failed to parse user from localStorage", e);
      }
    }
    
    return parsedProfile;
  });

  const [prefs, setPrefs] = useState<UserPreferences>(() => {
    const saved = localStorage.getItem("mindspace-prefs");
    return saved ? JSON.parse(saved) : defaultPrefs;
  });

  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setHasChanges(true);
  }, [profile, prefs]);

  // Apply dark mode class whenever the preference changes
  useEffect(() => {
    document.documentElement.classList.toggle("dark", prefs.darkMode);
  }, [prefs.darkMode]);

  const handleSave = async () => {
    localStorage.setItem("mindspace-profile", JSON.stringify(profile));
    localStorage.setItem("mindspace-prefs", JSON.stringify(prefs));

    // Update backend and auth user if logged in
    const authUserRaw = localStorage.getItem("user");
    if (authUserRaw) {
      try {
        const authUser = JSON.parse(authUserRaw);
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_URL}/api/auth/profile`, {
          method: "PUT",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: profile.name,
            email: profile.email,
            notifications: {
              dailyReminders: prefs.dailyReminders,
              weeklyReport: prefs.weeklyReport,
              reminderTime: prefs.moodReminder
            }
          }),
        });
        
        if (response.ok) {
          const updatedUser = await response.json();
          localStorage.setItem("user", JSON.stringify({ 
            name: updatedUser.name, 
            email: updatedUser.email, 
            id: updatedUser._id 
          }));
        } else {
            console.error("Failed to update profile to backend");
        }
      } catch (err) {
        console.error("Failed to update profile to backend", err);
      }
    }

    setHasChanges(false);
    toast({
      title: "Settings saved ✓",
      description: "Your profile and preferences have been updated.",
    });
    
    // Redirect to home page
    navigate("/");
  };

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
      <motion.div variants={item} className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-full bg-card shadow-soft flex items-center justify-center hover:shadow-md transition-shadow"
          >
            <ArrowLeft className="w-4 h-4 text-foreground" />
          </button>
          <h1 className="text-2xl font-bold font-display text-foreground">Settings</h1>
        </div>
        <Button onClick={handleSave} size="sm" className="gap-1.5">
          <Check className="w-4 h-4" />
          Save
        </Button>
      </motion.div>

      {/* Profile Section */}
      <motion.div variants={item} className="card-calm mb-6">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
          <User className="w-4 h-4" /> Profile
        </h2>

        <div className="flex flex-col sm:flex-row items-center gap-6 mb-6">
          <div className="relative group">
            <Avatar className="w-24 h-24 border-4 border-primary/20">
              <AvatarImage
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.avatarSeed}`}
                alt={profile.name}
              />
              <AvatarFallback className="bg-lavender-light text-primary text-xl font-bold">
                {profile.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <button
              onClick={() => setShowAvatarPicker(!showAvatarPicker)}
              className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-soft hover:scale-110 transition-transform"
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 w-full space-y-3">
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1 block">Display Name</label>
              <Input
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                placeholder="Your name"
                className="bg-muted/50"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1 block">Email</label>
              <Input
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                placeholder="your@email.com"
                className="bg-muted/50"
              />
            </div>
          </div>
        </div>

        {/* Avatar Picker */}
        {showAvatarPicker && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-border pt-4"
          >
            <p className="text-xs font-semibold text-muted-foreground mb-3">Choose an avatar</p>
            <div className="grid grid-cols-6 gap-3">
              {avatarSeeds.map((seed) => (
                <button
                  key={seed}
                  onClick={() => {
                    setProfile({ ...profile, avatarSeed: seed });
                    setShowAvatarPicker(false);
                  }}
                  className={`rounded-xl p-1 transition-all ${
                    profile.avatarSeed === seed
                      ? "ring-2 ring-primary bg-primary/10 scale-105"
                      : "hover:bg-muted"
                  }`}
                >
                  <Avatar className="w-full h-auto aspect-square">
                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`} />
                  </Avatar>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        <div className="mt-4">
          <label className="text-xs font-semibold text-muted-foreground mb-1 block">Bio</label>
          <textarea
            value={profile.bio}
            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
            placeholder="Tell us a bit about yourself..."
            rows={3}
            className="w-full rounded-xl border border-input bg-muted/50 px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
          />
        </div>
      </motion.div>

      {/* Notifications */}
      <motion.div variants={item} className="card-calm mb-6">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
          <Bell className="w-4 h-4" /> Notifications
        </h2>
        <div className="space-y-4">
          <SettingToggle
            label="Daily mood reminders"
            description="Get reminded to log your mood each day via email"
            checked={prefs.dailyReminders}
            onChange={(v) => setPrefs({ ...prefs, dailyReminders: v })}
          />
          <SettingToggle
            label="Weekly wellness report"
            description="Receive a summary of your week every Sunday"
            checked={prefs.weeklyReport}
            onChange={(v) => setPrefs({ ...prefs, weeklyReport: v })}
          />
          {prefs.dailyReminders && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="flex items-center justify-between pl-1"
            >
              <div>
                <p className="text-sm font-medium text-foreground">Reminder time</p>
                <p className="text-xs text-muted-foreground">When should we nudge you?</p>
              </div>
              <Input
                type="time"
                value={prefs.moodReminder}
                onChange={(e) => setPrefs({ ...prefs, moodReminder: e.target.value })}
                className="w-32 bg-muted/50"
              />
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Appearance */}
      <motion.div variants={item} className="card-calm mb-6">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
          <Moon className="w-4 h-4" /> Appearance
        </h2>
        <div className="space-y-4">
          <SettingToggle
            label="Dark mode"
            description="Switch to a darker color scheme"
            checked={prefs.darkMode}
            onChange={(v) => setPrefs({ ...prefs, darkMode: v })}
          />
          <SettingToggle
            label="Sound effects"
            description="Play sounds for interactions and breathing"
            checked={prefs.soundEffects}
            onChange={(v) => setPrefs({ ...prefs, soundEffects: v })}
          />
        </div>
      </motion.div>

      {/* Privacy */}
      <motion.div variants={item} className="card-calm mb-6">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
          <Shield className="w-4 h-4" /> Privacy & Data
        </h2>
        <div className="space-y-2">
          <button className="w-full flex items-center justify-between py-3 px-1 hover:bg-muted/50 rounded-lg transition-colors">
            <span className="text-sm font-medium text-foreground">Export my data</span>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
          <button className="w-full flex items-center justify-between py-3 px-1 hover:bg-muted/50 rounded-lg transition-colors">
            <span className="text-sm font-medium text-destructive">Delete all data</span>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </motion.div>

      {/* Account */}
      <motion.div variants={item} className="card-calm mb-6">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
          <User className="w-4 h-4" /> Account
        </h2>
        <div className="space-y-2">
          <button 
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              navigate("/auth");
            }}
            className="w-full flex items-center justify-between py-3 px-1 hover:bg-muted/50 rounded-lg transition-colors"
          >
            <span className="text-sm font-medium text-destructive">Log Out</span>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

const SettingToggle = ({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) => (
  <div className="flex items-center justify-between">
    <div>
      <p className="text-sm font-medium text-foreground">{label}</p>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
    <Switch checked={checked} onCheckedChange={onChange} />
  </div>
);

export default SettingsPage;
