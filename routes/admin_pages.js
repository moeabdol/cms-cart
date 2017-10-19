const express = require('express');
const router = express.Router();
const adminPages = require('../controllers/admin_pages');

router.get('/', adminPages.index);
router.get('/add-page', adminPages.addPage);

module.exports = router;
