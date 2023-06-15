const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');

////// Add Routes Here ////////
posts = require('./routes/api/posts.js');
users = require('./routes/api/users.js');
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
///////////////////////////////

const port = process.env.PORT || 8082;
app.listen(port, () => console.log(`Server running on port ${port}`));