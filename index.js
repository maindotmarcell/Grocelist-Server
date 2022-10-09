// IMPORTS
const express = require('express');
const cors = require('cors'); // cors is a middleware
const mongoose = require('mongoose');
const User = require('./models/user.model');
const Group = require('./models/group.model');
const GroupTasks = require('./models/grouptasks.model');
const GroupExpenses = require('./models/groupexpense.model');
const PersonalTodos = require('./models/todo.model');
const Reminders = require('./models/reminder.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const ObjectId = require('mongodb').ObjectId;
// ------------------------------ END OF IMPORTS --------------------------------

const app = express();

// MIDDLEWARE
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// ------------------------------ END OF MIDDLEWARE --------------------------------

mongoose.connect('mongodb://localhost:27017/asd-grocelist');

// ROUTES
app.post('/api/register', async (req, res) => {
  console.log(req.body);
  try {
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
    res.json({ status: 'ok', user: token });
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
  const token = req.headers['x-access-token'];

  try {
    const decoded = jwt.verify(token, 'secret123');
    const email = decoded.email;
    const user = await User.findOne({ email: email });

    return res.json({ status: 'ok', user });
  } catch (error) {
    // console.log(error);
    res.json({ status: 'error', error });
  }
});

app.get('/api/validate-user', async (req, res) => {
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

app.post('/api/create-group', async (req, res) => {
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

app.get('/api/get-all-groups', async (req, res) => {
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

app.post('/api/add-group-member', async (req, res) => {
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

app.post('/api/personaltodos', async (req, res) => {
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
app.get('/api/personaltodos/:id', async (req, res) => {
  try {
    console.log('todoroute');
    console.log(req.params.id);
    let o_id = new ObjectId(req.params.id);
    console.log(o_id);
    const todos = await PersonalTodos.findOne({
      o_id,
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
app.post('/api/reminders', async (req, res) => {
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
app.get('/api/reminders/:id', async (req, res) => {
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

// ------------------------- END OF ROUTES ------------------------------

app.listen(1337, () => {
  console.log('Server started');
});
