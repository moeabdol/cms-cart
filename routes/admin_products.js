const express = require('express');
const router = express.Router();
const adminProducts = require('../controllers/admin_products');

router.get('/', adminProducts.index);
router.get('/new', adminProducts.newProduct);
router.post('/new', adminProducts.createProduct);
router.get('/edit/:id', adminProducts.editProduct);
router.post('/edit/:id', adminProducts.updateProduct);
router.post('/product-gallery/:id', adminProducts.updateProductGallery);
router.get('/delete-image/:image', adminProducts.deleteImage);

module.exports = router;
