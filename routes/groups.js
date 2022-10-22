const express = require('express');
const User = require('../models/user.model');
const Group = require('../models/group.model');
const validateUser = require('../middleware/validateUser');
const jwt = require('jsonwebtoken');

const router = express.Router();


// passing request through custom authentication middleware
router.use(validateUser);


// ------------------ Development/admin api calls ------------------------

// handles create group request, creates it in mongo db
router.post('/create-group', async (req, res) => {
	try {
		const group = await Group.create({
			name: req.body.group_name,
			dashboard: {},
			list: {},
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

// Groups page endpoints ------------------------------------------------------------------

// endpoint for retrieving groups of current user
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

// endpoint for current user to create new group
router.post('/create-new', async (req, res) => {
	try {
		const user = await User.findById(req.body.user);
		const group = await Group.create({
			name: req.body.name,
			host: user._id,
			dashboard: {},
			list: {},
		});
		await Group.updateOne({ _id: group._id }, { $push: { users: user._id } });
		await User.updateOne({ _id: user._id }, { $push: { groups: group._id } });
		// console.log('user: ', user, ' group:', group);
		res.json({ status: 'ok', user, group });
	} catch (err) {
		// console.log(err);
		res.json({ status: 'error', error: err });
	}
});

// endpoint for current user to delete a group that he/she is a host of
router.delete('/delete-group/:id', async (req, res) => {
	const token = req.headers['x-access-token'];
	const decoded = jwt.verify(token, 'secret123');
	const email = decoded.email;
	const user = await User.findOne({ email: email });
	const group = await Group.findById(req.params.id);
	console.log('host: ', group.host);
	console.log('user: ', user._id);
	try {
		if (group.host.equals(user._id)) {
			group.users.forEach(async (user) => {
				await User.updateOne({ _id: user }, { $pull: { groups: group._id } });
			});
			await Group.findByIdAndDelete(group._id);
		} else throw 'User not host';
		res.json({ status: 'ok', message: 'Group deleted' });
	} catch (err) {
		res.status(403);
		console.log(err);
		res.json({ status: 'error', error: err });
	}
});

// Group Menu endpoints ---------------------------------------------------------------------

// endpoint to get list of members in group
router.get('/get-members/:id', async (req, res) => {
	const group = await Group.findById(req.params.id);
	const promiseUsers = group.users.map(
		async (user) => (await User.findById(user)).name
	);
	const users = await Promise.all(promiseUsers);
	res.json({ users });
});

// endpoint to get the grocery list of a group
router.get('/get-list/:id', async (req,res) => {
	const group = await Group.findById(req.params.id);
	res.json({list: group.list})
})

// endpoint to get the dashboard of a group
router.get('/get-dashboard/:id', async (req,res) => {
	const group = await Group.findById(req.params.id);
	res.json({dashboard: group.dashboard})
})

module.exports = router;
