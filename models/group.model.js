const mongoose = require('mongoose');

const Group = new mongoose.Schema(
  {
    name: { type: String, required: true },
    users: [{ type: mongoose.Schema.Types.ObjectId, required: false }],
    groupTasks: [{ type: mongoose.Schema.Types.ObjectId, required: false }],
    groupExpense: [{ type: mongoose.Schema.Types.ObjectId, required: false }],
  },
  { collection: 'group-data' }
);

const model = mongoose.model('GroupData', Group);

module.exports = model;
