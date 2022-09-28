// IMPORTS
const express = require('express');
const cors = require('cors'); // cors is a middleware
const mongoose = require('mongoose');
const User = require('./models/user.model');
const jwt = require('jsonwebtoken');

const passport = require('passport');
const passportLocal = require('passport-local').Strategy;
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const expressSession = require('express-session');
const bodyParser = require('body-parser');

// ------------------------------ END OF IMPORTS --------------------------------

const app = express();

// MIDDLEWARE
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
	cors({
		origin: 'http://localhost:3000',
		credentials: true,
	})
);

// ------------------------------ END OF MIDDLEWARE --------------------------------

mongoose.connect('mongodb://localhost:27017/asd-grocelist');

// ROUTES
app.post('/api/register', async (req, res) => {
	console.log(req.body);
	try {
		const newPassword = await bcrypt.hash(req.body.password, 10);
		await User.create({
			name: req.body.name,
			email: req.body.email,
			password: newPassword,
		});
		res.json({ status: 'ok' });
	} catch (err) {
		res.json({ status: 'error', error: 'Duplicate email' });
	}
});

app.post('/api/login', async (req, res) => {
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

		return res.json({ status: 'ok', user: token });
	} else {
		return res.json({ status: 'error', user: false });
	}
});

app.get('/api/current-user', async (req, res) => {
	const token = req.headers['x-access-token']

	try {
		const decoded = jwt.verify(token, 'secret123')
		const email = decoded.email
		const user = await User.findOne({ email: email })

		return res.json({ status: 'ok', name: user.name })
	} catch (error) {
		console.log(error)
		res.json({ status: 'error', error: 'invalid token' })
	}
})

// ------------------------- END OF ROUTES ------------------------------

app.listen(1337, () => {
	console.log('Server started');
});
