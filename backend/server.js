const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const User = require('./models/User');
const MoodEntry = require('./models/MoodEntry');
const JournalEntry = require('./models/JournalEntry');
const Goal = require('./models/Goal');
const Habit = require('./models/Habit');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_for_development';
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/mental-health';

// Connect to MongoDB
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use(cors());
app.use(express.json());

// JWT auth middleware
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Not authorized, no token' });
  }

  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Not authorized, token invalid' });
  }
};

// --- Authentication Routes ---

// @route   POST /api/auth/register
// @desc    Register a user
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Please provide all required fields' });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password
    });

    if (user) {
      // Create token
      const token = jwt.sign({ id: user._id }, JWT_SECRET, {
        expiresIn: '30d',
      });

      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        notifications: user.notifications,
        token
      });
    } else {
      res.status(400).json({ error: 'Invalid user data' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/auth/login
// @desc    Login a user
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Please provide email and password' });
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Create token
    const token = jwt.sign({ id: user._id }, JWT_SECRET, {
      expiresIn: '30d',
    });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      notifications: user.notifications,
      token
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/auth/profile
// @desc    Update user profile
app.put('/api/auth/profile', verifyToken, async (req, res) => {
  try {
    const { name, email, notifications } = req.body;

    const user = await User.findById(req.userId);

    if (user) {
      user.name = name || user.name;
      user.email = email || user.email;
      if (notifications) {
        user.notifications = notifications;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        notifications: updatedUser.notifications,
      });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// --- Mood Entries Routes ---

// @route   POST /api/moods
// @desc    Save a mood entry
app.post('/api/moods', verifyToken, async (req, res) => {
  try {
    const { mood, label, emoji, tags, note } = req.body;

    if (!mood || !label || !emoji) {
      return res.status(400).json({ error: 'Mood, label, and emoji are required' });
    }

    const entry = await MoodEntry.create({
      userId: req.userId,
      mood,
      label,
      emoji,
      tags: tags || [],
      note: note || '',
    });

    res.status(201).json(entry);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/moods
// @desc    Get mood entries for current user
app.get('/api/moods', verifyToken, async (req, res) => {
  try {
    const entries = await MoodEntry.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .limit(30);
    res.json(entries);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// --- Journal Entries Routes ---

// @route   POST /api/journals
// @desc    Save a journal entry
app.post('/api/journals', verifyToken, async (req, res) => {
  try {
    const { title, content, type, prompt } = req.body;

    if (!title || !content || !type) {
      return res.status(400).json({ error: 'Title, content, and type are required' });
    }

    const entry = await JournalEntry.create({
      userId: req.userId,
      title,
      content,
      type,
      prompt: prompt || '',
    });

    res.status(201).json(entry);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/journals
// @desc    Get journal entries for current user
app.get('/api/journals', verifyToken, async (req, res) => {
  try {
    const entries = await JournalEntry.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .limit(30);
    res.json(entries);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// --- Goals Routes ---

app.get('/api/goals', verifyToken, async (req, res) => {
  try {
    const goals = await Goal.find({ userId: req.userId }).sort({ createdAt: 1 });
    res.json(goals);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/goals', verifyToken, async (req, res) => {
  try {
    const { title, emoji, category } = req.body;
    const goal = await Goal.create({ userId: req.userId, title, emoji, category });
    res.status(201).json(goal);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/api/goals/:id', verifyToken, async (req, res) => {
  try {
    const goal = await Goal.findOne({ _id: req.params.id, userId: req.userId });
    if (!goal) return res.status(404).json({ error: 'Goal not found' });
    goal.completed = !goal.completed;
    await goal.save();
    res.json(goal);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/api/goals/:id', verifyToken, async (req, res) => {
  try {
    const goal = await Goal.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!goal) return res.status(404).json({ error: 'Goal not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// --- Habits Routes ---

app.get('/api/habits', verifyToken, async (req, res) => {
  try {
    const habits = await Habit.find({ userId: req.userId }).sort({ createdAt: 1 });
    res.json(habits);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/habits', verifyToken, async (req, res) => {
  try {
    const { name, emoji } = req.body;
    const habit = await Habit.create({ userId: req.userId, name, emoji });
    res.status(201).json(habit);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/api/habits/:id', verifyToken, async (req, res) => {
  try {
    const habit = await Habit.findOne({ _id: req.params.id, userId: req.userId });
    if (!habit) return res.status(404).json({ error: 'Habit not found' });

    // Toggle completedToday logic
    if (habit.completedToday) {
      habit.completedToday = false;
      habit.streak = Math.max(0, habit.streak - 1);
    } else {
      habit.completedToday = true;
      habit.streak += 1;
    }

    // Optional: simple sync with weekLog (just set the last element for demo)
    habit.weekLog[6] = habit.completedToday;
    habit.markModified('weekLog');

    await habit.save();
    res.json(habit);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/api/habits/:id', verifyToken, async (req, res) => {
  try {
    const habit = await Habit.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!habit) return res.status(404).json({ error: 'Habit not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// --- Chat Route (Powered by Groq) ---

const SYSTEM_PROMPT = `You are a warm, empathetic mental wellness companion called "Wellness Companion". Rules:

- Keep responses SHORT: 2-4 sentences max. Be concise like a caring friend texting.
- Mix up your response style naturally:
  - Sometimes validate and ask a gentle follow-up question.
  - Sometimes just offer warm support or a quick tip WITHOUT asking anything — let the user lead.
  - Don't end every message with a question. It feels like an interrogation.
- Offer ONE specific tip or technique when relevant, not a list.
- Use a gentle, supportive tone with sparingly used emojis (💜, 🌸, ✨)
- Never diagnose or replace professional help.
- If someone mentions self-harm or suicide, immediately direct them to call 988 or text HOME to 741741.
- You are NOT a therapist. You are a supportive friend.`;

app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "messages array is required" });
    }

    const GROK_API_KEY = process.env.GROK_API_KEY;
    if (!GROK_API_KEY) {
      console.warn("GROK_API_KEY is not set. Returning mock response.");

      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      const mockText = "I see that you don't have a Grok API Key configured right now. I'm a fallback mock response just to show you that the custom Node.js backend is working correctly! 🌸 Once you add your key to the backend .env file, I'll be fully functional.";

      const words = mockText.split(' ');
      let i = 0;

      const interval = setInterval(() => {
        if (i < words.length) {
          const chunk = { choices: [{ delta: { content: words[i] + ' ' } }] };
          res.write(`data: ${JSON.stringify(chunk)}\n\n`);
          i++;
        } else {
          res.write('data: [DONE]\n\n');
          res.end();
          clearInterval(interval);
        }
      }, 100);
      return;
    }

    // Build messages array with system prompt for Grok (OpenAI-compatible format)
    const grokMessages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
    ];

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GROK_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: grokMessages,
        stream: true,
        temperature: 0.8,
        max_tokens: 256,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Groq API error:", response.status, errorText);

      if (response.status === 429) {
        return res.status(429).json({ error: "Rate limit exceeded. Please wait a moment and try again." });
      }

      return res.status(500).json({ error: "AI service error. Please try again." });
    }

    // Grok uses standard OpenAI SSE format - proxy it directly to the client
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    let buffer = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      let newlineIndex;
      while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
        const line = buffer.slice(0, newlineIndex).trim();
        buffer = buffer.slice(newlineIndex + 1);

        if (!line.startsWith("data: ")) continue;
        const jsonStr = line.slice(6).trim();
        if (jsonStr === "[DONE]") {
          res.write("data: [DONE]\n\n");
          continue;
        }

        try {
          const parsed = JSON.parse(jsonStr);
          const content = parsed.choices?.[0]?.delta?.content;
          if (content) {
            const chunk = { choices: [{ delta: { content } }] };
            res.write(`data: ${JSON.stringify(chunk)}\n\n`);
          }
        } catch {
          // partial JSON, ignore
        }
      }
    }

    res.write("data: [DONE]\n\n");
    res.end();

  } catch (e) {
    console.error("chat error:", e);
    return res.status(500).json({ error: e instanceof Error ? e.message : "Unknown error" });
  }
});

// --- Notifications Cron Job ---
const cron = require('node-cron');
const nodemailer = require('nodemailer');

// Set up Nodemailer transporter using dummy values for now.
// For real emails, use: service: 'gmail', auth: { user: 'your-email@gmail.com', pass: 'app-password' }
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'mayurk92x@gmail.com',
    pass: 'larmugtnygyeswyz'
  }
});


// Run every minute
cron.schedule('* * * * *', async () => {
  try {
    const now = new Date();
    // format as HH:MM
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const currentTimeStr = `${hours}:${minutes}`;

    // Find users who have dailyReminders enabled and matching reminderTime
    const users = await User.find({
      'notifications.dailyReminders': true,
      'notifications.reminderTime': currentTimeStr
    });

    for (const user of users) {
      console.log(`[Cron] Sending daily reminder to ${user.email} at ${currentTimeStr}`);
      // Simulated Email Sending:
      await transporter.sendMail({
        from: '"MindSpace" <mayurk92x@gmail.com>', // Replace with your Gmail
        to: user.email,                                    // This sends to whoever triggered the reminder!
        subject: 'Time for your daily Check-In 🧠',
        text: 'Take a moment to log your mood today on MindSpace!',
      });

    }
  } catch (err) {
    console.error('Error in daily reminder cron:', err);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
