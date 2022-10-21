const mongoose = require('mongoose');

const Dashboard = mongoose.Schema({
	items: [{ type: String, required: false }],
});

const GroceryList = mongoose.Schema({
	items: [{ type: String, required: false }],
});

const Group = new mongoose.Schema(
	{
		name: { type: String, required: true },
		users: [{ type: mongoose.Schema.Types.ObjectId, required: false }],
		host: {type: mongoose.Schema.Types.ObjectId, required: true},
		dashboard: Dashboard,
		list: GroceryList,
	},
	{ collection: 'group-data' }
);

const model = mongoose.model('GroupData', Group);

module.exports = model;
