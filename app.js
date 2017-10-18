const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const config = require('./config');

mongoose.connect(config.db, { useMongoClient: true },
  (err) => {
    if (err) return console.log(err);
    console.log('Connected to MongoDB');
  }
);

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.send('Workding!');
});

app.listen(3000, () => {
  console.log('Server started on port', 3000);
});
