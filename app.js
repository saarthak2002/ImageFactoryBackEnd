const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');

////// Add Routes Here ////////

// EXAMPLE: const items = require('./routes/api/items.js');

///////////////////////////

const app = express();

// Connect Database
connectDB();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ extended: false }));
app.get('/', (req, res) => res.send('Hello world!'));

////// Use Routes Here ////////

// EXAMPLE: app.use('/api/items', items);

///////////////////////////////

const port = process.env.PORT || 8082;
app.listen(port, () => console.log(`Server running on port ${port}`));