const express = require('express');
const User = require('../models/user.model');
const Group = require('../models/group.model');
const Invite = require('../models/invite.model');
const validateUser = require('../middleware/validateUser');

const router = express.Router();

// passing request through custom authentication middleware
router.use(validateUser);

// endpoint to create an invite
router.post('/create-invite', async (req, res) => {
	try {
		const invitee = await User.findOne({ email: req.body.invitee });
		const isDuplicate = await Invite.findOne({
			group: req.body.group,
			inviter: req.body.inviter,
			invitee: invitee._id,
		});
		console.log(isDuplicate);
		const group = await Group.findById(req.body.group);
		const inviteeInGroup = group.users.some((user) => user.equals(invitee._id));
		console.log(inviteeInGroup);
		if (!isDuplicate && !inviteeInGroup) {
			const invite = await Invite.create({
				group: req.body.group,
				inviter: req.body.inviter,
				invitee: invitee._id,
			});
			res.json({ invite });
		} else throw 'Invitee is either already in group or already invited.';
	} catch (err) {
		console.log(err);
		res.json({ error: err });
	}
});

// endpoint to get invites for display
router.get('/get-invites/:id', async (req, res) => {
	console.log('hi');
	const invites = await Invite.find({ invitee: req.params.id });
	const asyncInvites = invites.map(async (invite) => {
		const inviter = await User.findById(invite.inviter);
		const invitee = await User.findById(invite.invitee);
		const group = await Group.findById(invite.group);
		return { id: invite._id, group, inviter, invitee };
	});
	const resInvites = await Promise.all(asyncInvites);
	res.json({ invites: resInvites });
});

// endpoint to accept invites
router.put('/accept-invite/:id', async (req, res) => {
	try {
		const invite = await Invite.findById(req.params.id);
		const user = await User.findById(invite.invitee);
		const group = await Group.findById(invite.group);
		await Group.updateOne({ _id: group._id }, { $push: { users: user._id } });
		await User.updateOne({ _id: user.id }, { $push: { groups: group._id } });
		await Invite.findByIdAndDelete(req.params.id);
		res.json({msg: "Invite Accepted"})
	} catch (err) {
		res.json({ error: err });
	}
});

// endpoint to decline invites
router.put('/decline-invite/:id', async (req, res) => {
	try {
		await Invite.findByIdAndDelete(req.params.id);
		res.json({msg: "Invite declined"})
	} catch (err) {
		res.json({ error: err });
	}
});

module.exports = router;
