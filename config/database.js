const mongoose = require('mongoose');
const config   = require('./');

// Connect to db
mongoose.Promise = global.Promise;
mongoose.connect(config.db, { useMongoClient: true },
  (err) => {
    if (err) return console.log(err);
    console.log('Connected to MongoDB');
  }
);

module.exports = mongoose;
