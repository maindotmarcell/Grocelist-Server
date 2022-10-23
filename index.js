// ------------------ IMPORTS ----------------------------
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // cors is a middleware
const bodyParser = require('body-parser');

// Route imports
const authRoute = require('./routes/authentication');
const groupRoute = require('./routes/groups');
const todoRoute = require('./routes/personalToDo');
const reminderRoute = require('./routes/reminder');
const inviteRoute = require('./routes/invites');
// ------------------------------ END OF IMPORTS --------------------------------

// Initialising server application
const app = express();

// -----------------------------MIDDLEWARE ------------------------------
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// ROUTES
app.use('/', async (req, res) => {
  res.json({ msg: 'Hello World' });
});
app.use('/api/authentication', authRoute);
app.use('/api/groups', groupRoute);
app.use('/api/personaltodos', todoRoute);
app.use('/api/reminders', reminderRoute);
app.use('/api/invites', inviteRoute);
// ------- END OF ROUTES --------

// ------------------------------ END OF MIDDLEWARE --------------------------------

// making database connection
mongoose.connect(
  'mongodb+srv://Asd-Group8:Grocelist321@cluster0.ae5tskx.mongodb.net/?retryWrites=true&w=majority'
);

// Running server
app.listen(1337, () => {
  console.log('Server started');
});
