const express = require('express');
const router = express.Router();
const adminProducts = require('../controllers/admin_products');

router.get('/', adminProducts.index);
router.get('/new', adminProducts.newProduct);
router.post('/new', adminProducts.createProduct);

module.exports = router;
