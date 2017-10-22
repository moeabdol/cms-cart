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

const editProduct = (req, res) => {
  let errors;

  if (req.session.errors) errors = req.session.errors;
  req.session.errors = null;

  Category.find((err, categories) => {
    if (err) return console.log(err);

    Product.findById(req.params.id, (err, product) => {
      if (err) return console.log(err);

      let galleryDir = 'public/product_images/' + product._id + '/gallery';
      let galleryImages = null;

      fs.readdir(galleryDir, (err, files) => {
        if (err) return console.log(err);

        galleryImages = files;

        res.render('admin/products/edit', {
          errors: errors,
          id: product._id,
          title: product.title,
          description: product.description,
          categories: categories,
          cat: product.category.replace(/\s+/g, '-').toLowerCase(),
          price: parseFloat(product.price).toFixed(2),
          image: product.image,
          galleryImages: galleryImages
        });
      });
    });
  });
};

const updateProduct = (req, res) => {
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
  let pimage = req.body.pimage;
  let id = req.params.id;

  const errors = req.validationErrors();

  if (errors) {
    req.session.errors = errors;
    return res.redirect('/admin/products/edit/' + id);
  }

  Product.findOne({ slug: slug, _id: { '$ne': id } }, (err, product) => {
    if (err) return console.log(err);

    if (product) {
      req.flash('danger', 'Product title exists. choose another.');
      return res.redirect('/admin/products/edit/' + id );
    }

    Product.findById(id, (err, product) => {
      if (err) return console.log(err);

      product.title = title;
      product.slug = slug;
      product.description = description;
      product.price = parseFloat(price).toFixed(2);
      product.category = category;
      if (imageFile !== '') product.image = imageFile;

      product.save(err => {
        if (err) return console.log(err);

        if (imageFile !== '') {
          if (pimage !== '') {
            fs.remove('public/product_images/' + id + '/' + pimage, (err) => {
              if (err) return console.log(err);
            });
          }

          const productImage = req.files.image;
          const path = 'public/product_images/' + id + '/' + imageFile;

          productImage.mv(path, (err) => {
            if (err) return console.log(err);
          });
        }

        req.flash('success', 'Product updated.');
        res.redirect('/admin/products');
      });
    });
  });
};

module.exports = {
  index,
  newProduct,
  createProduct,
  editProduct,
  updateProduct
};
