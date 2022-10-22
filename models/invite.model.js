const mongoose = require('mongoose');

const Invite = new mongoose.Schema(
	{
		group: { type: mongoose.Schema.Types.ObjectId, required: true },
		inviter: { type: mongoose.Schema.Types.ObjectId, required: true },
		invitee: { type: mongoose.Schema.Types.ObjectId, required: true },
	},
	{ collection: 'invite-data' }
);

const model = mongoose.model('InviteData', Invite)

module.exports = model;
