const express = require('express');
const User = require('../models/user.model');
const PersonalTodos = require('../models/todo.model');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const todos = PersonalTodos.create({
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
    console.log(req.params.id);
    const todos = await PersonalTodos.find({
      user: req.params.id,
    });

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

router.patch('/:id', async (req, res) => {
  try {
    console.log(req.params.id);
    const todos = await PersonalTodos.findByIdAndUpdate(
      {
        _id: req.params.id,
      },
      req.body
    );

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

router.delete('/:id', async (req, res) => {
  try {
    console.log(req.params.id);
    const todos = await PersonalTodos.findByIdAndDelete(
      {
        _id: req.params.id,
      },
      req.body
    );

    console.log(todos);
    res.status(200);
    return res.json({ status: 'success' });
  } catch (err) {
    res.json({
      status: 'error',
      error: err,
    });
  }
});

module.exports = router;
