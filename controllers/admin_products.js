const Product   = require('../models/product');
const Category  = require('../models/category');
const mkdirp    = require('mkdirp');
const fs        = require('fs-extra');
const resizeImg = require('resize-img');

const index = (req, res) => {
  let count;

  Product.count((err, c) => {
    if (err) return console.log(err);
    count = c;

    Product.find((err, products) => {
      if (err) return console.log(err);

      res.render('admin/products', {
        products: products,
        count: count
      });
    });
  });
};

const newProduct = (req, res) => {
  let title = '';
  let description = '';
  let price = '';

  Category.find((err, categories) => {
    if (err) return console.log(err);

    res.render('admin/products/new', {
      title: title,
      description: description,
      price: price,
      categories: categories
    });
  });
};

const createProduct = (req, res) => {
  const imageFile =
    typeof req.files.image !== 'undefined' ? req.files.image.name : '';

  req.checkBody('title', 'Title must have a value.').notEmpty();
  req.checkBody('description', 'Description must have a value.').notEmpty();
  req.checkBody('price', 'Price must have a value.').isDecimal();
  req.checkBody('image', 'You must upload an image.').isImage(imageFile);

  let title = req.body.title;
  let slug = title.replace(/\s+/g, '-').toLowerCase();
  let description = req.body.description;
  let price = req.body.price;
  let category = req.body.category;

  const errors = req.validationErrors();

  if (errors) {
    Category.find((err, categories) => {
      if (err) return console.log(err);

      return res.render('admin/products/new', {
        errors: errors,
        title: title,
        description: description,
        price: price,
        categories: categories
      });
    });
  }

  Product.findOne({ slug: slug }, (err, product) => {
    if (err) return console.log(err);

    if (product) {
      req.flash('danger', 'Product title exists.');
      Category.find((err, categories) => {
        if (err) return console.log(err);

        return res.render('admin/products/new', {
          title: title,
          description: description,
          price: price,
          categories: categories
        });
      });
    }
  });

  price = parseFloat(price).toFixed(2);
  const newProduct = new Product({
    title: title,
    slug: slug,
    description: description,
    price: price,
    category: category,
    image: imageFile
  });

  newProduct.save(err => {
    if (err) return console.log(err);

    mkdirp('public/product_images/' + newProduct._id, err => {
      if (err) return console.log(err);
    });

    mkdirp('public/product_images/' + newProduct._id + '/gallery', err => {
      if (err) return console.log(err);
    });

    mkdirp('public/product_images/' + newProduct._id + '/gallery/thumbs', err => {
      if (err) return console.log(err);
    });

    if (imageFile !== '') {
      const productImage = req.files.image;
      const path = 'public/product_images/' + newProduct._id + '/' + imageFile;

      productImage.mv(path, err => {
        if (err) return console.log(err);
      });
    }

    req.flash('success', 'Product added.');
    res.redirect('/admin/products');
  });
};

module.exports = {
  index,
  newProduct,
  createProduct
};
