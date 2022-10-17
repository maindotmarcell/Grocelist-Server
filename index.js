// ------------------ IMPORTS ----------------------------
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // cors is a middleware
const bodyParser = require('body-parser');

// Route imports
const authRoute = require('./routes/authentication');
const groupRoute = require('./routes/groups');
const todoRoute = require('./routes/personalToDo')
const reminderRoute = require('./routes/reminder')
// ------------------------------ END OF IMPORTS --------------------------------

// Initialising server application
const app = express();

// -----------------------------MIDDLEWARE ------------------------------
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// ROUTES
app.use('/api/authentication', authRoute);
app.use('/api/groups', groupRoute);
app.use('/api/personaltodos', todoRoute)
app.use('/api/reminders/', reminderRoute)
// ------- END OF ROUTES --------

// ------------------------------ END OF MIDDLEWARE --------------------------------

// making database connection
mongoose.connect('mongodb://localhost:27017/asd-grocelist');


// Running server
app.listen(1337, () => {
	console.log('Server started');
});
