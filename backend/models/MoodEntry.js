const mongoose = require('mongoose');

const moodEntrySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  mood: {
    type: Number,
    required: true,
    min: 1,
    max: 10,
  },
  label: {
    type: String,
    required: true,
  },
  emoji: {
    type: String,
    required: true,
  },
  tags: {
    type: [String],
    default: [],
  },
  note: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('MoodEntry', moodEntrySchema);
