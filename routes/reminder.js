const express = require('express');
const Reminders = require('../models/reminder.model');

const router = express.Router();

router.post('/', async (req, res) => {
	try {
		const reminder = Reminders.create({
			user: req.body.user,
			todo: req.body.todo,
			date: req.body.date,
		});
		res.status(200);
		return res.json({ status: 'success' });
	} catch (err) {
		res.json({
			status: 'error',
			error: 'Oops, something went wrong!.',
		});
	}
});

router.get('/:id', async (req, res) => {
	try {
		let o_id = new ObjectId(req.param.id);
		const todos = await Reminders.findOne({
			o_id,
		});
		console.log(req.params.id);
		console.log(todos);
		res.status(200);
		return res.json({ status: 'success', todos });
	} catch (err) {
		res.json({
			status: 'error',
			error: err,
		});
	}
});

module.exports = router;
