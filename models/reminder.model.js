const mongoose = require('mongoose');

const reminder = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId },
    date: { type: Date },
    reminders: { type: String },
  },
  { collection: 'reminder-data' }
);

const model = mongoose.model('Reminders', reminder);

module.exports = model;
