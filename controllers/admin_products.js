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

module.exports = {
  index
};
