const express = require('express');
const router = express.Router();
const adminCategories = require('../controllers/admin_categories');

router.get('/', adminCategories.index);

module.exports = router;
