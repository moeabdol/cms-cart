const express = require('express');
const router = express.Router();
const adminPages = require('../controllers/admin_pages');

router.get('/', adminPages.index);
router.get('/new', adminPages.newPage);
router.post('/new', adminPages.createPage);
router.post('/reorder', adminPages.reorderPages);
router.get('/edit/:slug', adminPages.editPage);
router.post('/edit/:slug', adminPages.updatePage);
router.get('/delete/:id', adminPages.deletePage);

module.exports = router;
