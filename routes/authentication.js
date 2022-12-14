const express = require('express');
const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const router = express.Router();

// handles register request, creates new user in mongo db
router.post('/register', async (req, res) => {
	console.log(req.body);
	try {
		if (req.body.name.length < 3) throw 'Username too short';
		const newPassword = await bcrypt.hash(req.body.password, 10);
		const user = await User.create({
			name: req.body.name,
			email: req.body.email,
			password: newPassword,
		});
		const token = jwt.sign(
			{
				name: user.name,
				email: user.email,
			},
			'secret123'
		);
		const contextUser = {
			id: user._id,
			name: user.name,
			email: user.email,
			token: token,
		};

		console.log(user);
		res.json({ status: 'ok', user: contextUser });
	} catch (err) {
		res.json({ status: 'error', error: 'Duplicate email' });
	}
});

// handles login request, verifies login information by comparing encrypted password and email
router.post('/login', async (req, res) => {
	const user = await User.findOne({
		email: req.body.email,
	});

	if (!user) {
		return { status: 'error', error: 'Invalid login' };
	}

	const isPasswordValid = await bcrypt.compare(
		req.body.password,
		user.password
	);

	if (isPasswordValid) {
		const token = jwt.sign(
			{
				name: user.name,
				email: user.email,
			},
			'secret123'
		);
		const contextUser = {
			id: user._id,
			name: user.name,
			email: user.email,
			token: token,
		};

		return res.json({ status: 'ok', user: contextUser });
	} else {
		return res.json({ status: 'error', user: false });
	}
});

// sends back the current user basaed on jwt if user exists and token hasn't been modified
router.get('/current-user', async (req, res) => {
	const token = req.headers['x-access-token'];

	try {
		const decoded = jwt.verify(token, 'secret123');
		const email = decoded.email;
		const user = await User.findOne({ email: email });
		const currentUser = {
			id: user._id,
			name: user.name,
			email: user.email,
			token,
		};
		return res.json({ status: 'ok', user: currentUser });
	} catch (error) {
		// console.log(error);
		res.json({ status: 'error', error });
	}
});

// validates jwt of current user
router.get('/validate-user', async (req, res) => {
	const token = req.headers['x-access-token'];

	try {
		const decoded = jwt.verify(token, 'secret123');
		const email = decoded.email;
		const user = await User.findOne({ email: email });

		res.status(200);
		return res.json({ status: 'ok' });
	} catch (error) {
		// console.log(error);
		res.status(403);
		res.json({ status: 'error', error: 'invalid token' });
	}
});
router.patch('/:id', async (req, res) => {
	try {
		console.log(req.params.id, req.body);
		const user = User.findByIdAndUpdate({ _id: req.params.id }, req.body);
		console.log(user);
		res.json({ status: 'ok' });
	} catch (err) {
		res.json({ status: 'error', error: err });
	}
});

module.exports = router;
