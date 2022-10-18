const express = require('express');
const User = require('../models/user.model');
const Group = require('../models/group.model');

const router = express.Router();

// ------------------ Development/admin api calls ------------------------

// handles create group request, creates it in mongo db
router.post('/create-group', async (req, res) => {
	try {
		const user = await Group.create({
			name: req.body.group_name,
		});
		res.json({ status: 'ok' });
	} catch (err) {
		res.json({
			status: 'error',
			error: 'Oops, something went wrong! Group was not created.',
		});
	}
});

// handles get all groups request, fetches from mongo db
router.get('/get-all-groups', async (req, res) => {
	// const token = req.headers['x-access-token'];
	try {
		const groups = await Group.find();
		// console.log(groups);
		return res.status(200).json({ groups: groups });
	} catch (error) {
		console.log(error);
		res
			.status(400)
			.json({ status: 'error', error: 'Oops something went wrong' });
	}
});

// handles add group member request, adds to mongo db
router.post('/add-group-member', async (req, res) => {
	// console.log(req.body);
	try {
		const user = await User.findOne({
			email: req.body.user_email,
		});

		await Group.updateOne(
			{ _id: req.body.group_id },
			{ $push: { users: user._id } }
		);
		await User.updateOne(
			{ email: req.body.user_email },
			{ $push: { groups: req.body.group_id } }
		);

		res.json({ status: 'ok' });
	} catch (err) {
		res.json({
			status: 'error',
			error:
				'Oops, something went wrong! User was not added to the selected group.',
		});
	}
});

// ---------------------- public api calls -----------------------------------

router.get('/:id', async (req, res) => {
	try {
		const user = await User.findById(req.params.id);
		const groupIDs = user.groups;
		const groupProms = groupIDs.map(
			async (groupID) => await Group.findById(groupID)
		);
		const groups = await Promise.all(groupProms);

		res.json({ status: 'ok', groups });
	} catch (err) {
		res.json({ status: 'error', error: err });
	}
});

module.exports = router;
