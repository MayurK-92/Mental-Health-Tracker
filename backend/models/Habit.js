const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  emoji: {
    type: String,
    default: '🔥',
  },
  streak: {
    type: Number,
    default: 0,
  },
  completedToday: {
    type: Boolean,
    default: false,
  },
  weekLog: {
    type: [Boolean],
    default: [false, false, false, false, false, false, false],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Habit', habitSchema);
