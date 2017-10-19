const express = require('express');
const router = express.Router();
const adminPages = require('../controllers/admin_pages');

router.get('/', adminPages.index);

module.exports = router;
