const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
require('dotenv').config();

////// Add Routes Here ////////
posts = require('./routes/api/posts.js');
users = require('./routes/api/users.js');
userdetails = require('./routes/api/userdetails.js');
comments = require('./routes/api/comments.js');
///////////////////////////

const app = express();

// Connect Database
connectDB();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ extended: false }));
app.get('/', (req, res) => res.send('Hello world!'));

////// Use Routes Here ////////
app.use('/api/posts', posts);
app.use('/api/users', users);
app.use('/api/userdetails', userdetails);
app.use('/api/comments', comments);
///////////////////////////////

const port = process.env.PORT || 8082;
app.listen(port, () => console.log(`Server running on port ${port}`));