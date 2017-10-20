const express = require('express');
const router = express.Router();
const adminCategories = require('../controllers/admin_categories');

router.get('/', adminCategories.index);
router.get('/new', adminCategories.newCategory);
router.post('/new', adminCategories.createCategory);
router.get('/edit/:id', adminCategories.editCategory);
router.post('/edit/:id', adminCategories.updateCategory);

module.exports = router;
