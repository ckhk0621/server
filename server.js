const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');
const notices = require('./routes/api/notices');
const memo = require('./routes/api/memo');
const inout = require('./routes/api/inout');
const passport = require('passport');
const ridebooking = require('./routes/api/ridebooking');

const app = express();

const cors = require('cors');

app.use(cors({ origin: 'http://localhost:8000', credentials: true }));

// Body parser middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json({limit: "50mb"}));

// DB Config
const db = require('./config/keys').mongoURI;

// Connect to MongoDB
mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// Passport middleware
app.use(passport.initialize());

// Passport Config
require('./config/passport')(passport);

app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);
app.use('/api/notices', notices);
app.use('/api/memo', memo);
app.use('/api/inout', inout);
app.use('/api/ridebooking', ridebooking);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`SERVER RUNNING ON PORT ${port}`));