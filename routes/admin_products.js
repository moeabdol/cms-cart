const express = require('express');
const router = express.Router();
const adminProducts = require('../controllers/admin_products');

router.get('/', adminProducts.index);

module.exports = router;
