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

module.exports = {
  index,
  newProduct
};
