const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const config = require('./config');
const pagesRoutes = require('./routes/pages');
const adminPagesRoutes = require('./routes/admin_pages');

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
app.use(express.static(path.join(__dirname, 'node_modules')));

app.use('/', pagesRoutes);
app.use('/admin', adminPagesRoutes);

app.listen(3000, () => {
  console.log('Server started on port', 3000);
});
