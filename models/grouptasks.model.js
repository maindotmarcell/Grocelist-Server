const mongoose = require('mongoose');

const groupexpense = new mongoose.Schema(
  {
    group: { type: mongoose.Schema.Types.ObjectId },
    date: { type: Date },
    dues: { type: String },
  },
  { collection: 'group-expenses' }
);

const model = mongoose.model('GroupExpense', groupexpense);

module.exports = model;
