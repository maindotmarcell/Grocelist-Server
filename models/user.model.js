const mongoose = require('mongoose');

const User = new mongoose.Schema(
	{
		name: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		groups: [{ type: mongoose.Schema.Types.ObjectId, required: false }],
	},
	{ collection: 'user-data' }
);

const model = mongoose.model('UserData', User);

module.exports = model;
