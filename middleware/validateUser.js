const User = require('../models/user.model');
const Group = require('../models/group.model');
const jwt = require('jsonwebtoken');

async function validateUser(req, res, next) {
	const token = req.headers['x-access-token'];
	// console.log('token: ', token);
	// console.log('validate user ran');
	try {
		const decoded = jwt.verify(token, 'secret123');
		const email = decoded.email;
		const user = await User.findOne({ email: email });
		next();
	} catch (error) {
		console.log(error);
		res.status(403);
		res.json({ status: 'error', error: 'invalid token' });
	}
}

module.exports = validateUser;
