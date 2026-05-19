require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const MoodEntry = require('./models/MoodEntry');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for seeding');

    const user = await User.findOne();
    if (!user) {
      console.log('No user found to attach data to. Please sign up first.');
      process.exit(1);
    }

    const userId = user._id;

    const moodsData = [
      { mood: 3, label: 'Okay', emoji: '😐', tags: ['work', 'sleep'], note: 'Just an average day.' },
      { mood: 2, label: 'Sad', emoji: '😢', tags: ['stress', 'work'], note: 'Long hours and stressful.' },
      { mood: 4, label: 'Good', emoji: '🙂', tags: ['exercise', 'friends'], note: 'Felt better after working out.' },
      { mood: 5, label: 'Great', emoji: '😄', tags: ['family', 'relax'], note: 'Awesome weekend!' },
      { mood: 4, label: 'Good', emoji: '🙂', tags: ['reading', 'sleep'], note: 'Slept really well.' },
      { mood: 3, label: 'Okay', emoji: '😐', tags: ['work', 'tired'], note: 'A bit exhausting.' },
      { mood: 5, label: 'Great', emoji: '😄', tags: ['exercise', 'meditation'], note: 'Crushed my goals!' }
    ];

    const entries = [];
    // Start from 6 days ago, going up to today
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      entries.push({
        userId,
        mood: moodsData[i].mood,
        label: moodsData[i].label,
        emoji: moodsData[i].emoji,
        tags: moodsData[i].tags,
        note: moodsData[i].note,
        createdAt: d
      });
    }

    await MoodEntry.insertMany(entries);
    console.log(`Successfully seeded 7 days of mood entries for user ${user.email}`);
    process.exit(0);

  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedData();
