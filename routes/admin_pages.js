const express = require('express');
const router = express.Router();
const adminPages = require('../controllers/admin_pages');

router.get('/pages', adminPages.index);
router.get('/pages/new', adminPages.newPage);
router.post('/pages/new', adminPages.createPage);

module.exports = router;
