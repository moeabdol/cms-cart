const Category = require('../models/category');

const index = (req, res) => {
  Category.find({}, (err, categories) => {
    if (err) return console.log(err);

    res.render('admin/categories/index', {
      categories: categories
    });
  });
};

const newCategory = (req, res) => {
  const title = '';

  res.render('admin/categories/new', {
    title: title
  });
};

const createCategory = (req, res) => {
  req.checkBody('title', 'Title must have a value.').notEmpty();

  let title = req.body.title;
  let slug = title.replace(/\s+/g, '-').toLowerCase();

  const errors = req.validationErrors();

  if (errors) {
    return res.render('admin/categories/new', {
      errors: errors,
      title: title
    });
  }

  Category.findOne({ slug: slug }, (err, category) => {
    if (err) return console.log(err);
    if (category) {
      req.flash('danger', 'Category title exists, choose another.');
      return res.render('admin/categories/new', {
        title: title
      });
    }

    const newCategory = new Category({
      title: title,
      slug: slug
    });

    newCategory.save(err => {
      if (err) return console.log(err);

      req.flash('success', 'Category added.');
      res.redirect('/admin/categories');
    });
  });
};

const editCategory = (req, res) => {
  Category.findById(req.params.id, (err, category) => {
    if (err) return console.log(err);

    res.render('admin/categories/edit', {
      id: category._id,
      title: category.title
    });
  });
};

const updateCategory = (req, res) => {
  req.checkBody('title', 'Title must have a value.').notEmpty();

  let title = req.body.title;
  let slug = title.replace(/\s+/g, '-').toLowerCase();
  let id = req.params.id;

  const errors = req.validationErrors();

  if (errors) {
    return res.render('admin/categories/edit', {
      errors: errors,
      title: title,
      id: id
    });
  }

  Category.findOne({ slug: slug, _id: { '$ne': id } }, (err, category) => {
    if (err) return console.log(err);

    if (category) {
      req.flash('danger', 'Category title exists, choose another.');
      return res.render('admin/categories/edit', {
        id: id,
        title: title
      });
    }

    Category.findById(id, (err, category) => {
      if (err) return console.log(err);

      category.title = title;
      category.slug = slug;

      category.save(err => {
        if (err) return console.log(err);

        req.flash('success', 'Category edited.');
        res.redirect('/admin/categories');
      });
    });
  });
};

module.exports = {
  index,
  newCategory,
  createCategory,
  editCategory,
  updateCategory
};
