const mongoose = require('mongoose');

const grouptasks = new mongoose.Schema(
  {
    group: { type: mongoose.Schema.Types.ObjectId },
    date: { type: Date },
    todo: { type: String },
  },
  { collection: 'group-tasks' }
);

const model = mongoose.model('GroupTasks', grouptasks);

module.exports = model;
