const mongoose = require('mongoose');

const todos = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId },
    date: { type: Date },
    todo: { type: String },
    status: { type: Boolean, default: false },
  },
  { collection: 'todo-data' }
);

const model = mongoose.model('Todos', todos);

module.exports = model;
