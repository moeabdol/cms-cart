const mongoose = require('../config/database');

const CategorySchema = mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String }
});

module.exports = mongoose.model('Category', CategorySchema);
