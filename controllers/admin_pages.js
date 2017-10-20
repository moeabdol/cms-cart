const Page = require('../models/page');

const index = (req, res) => {
  Page.find({}).sort({ sorting: 1 }).exec((err, pages) => {
    res.render('admin/pages/index', {
      pages: pages
    });
  });
};

const newPage = (req, res) => {
  let title = '';
  let slug = '';
  let content = '';

  res.render('admin/pages/new', {
    title: title,
    slug: slug,
    content: content
  });
};

const createPage = (req, res) => {
  req.checkBody('title', 'title must have a value').notEmpty();
  req.checkBody('content', 'content must have a value').notEmpty();

  let title = req.body.title;
  let slug = req.body.slug.replace(/\s+/g, '-').toLowerCase();
  if (slug === '') slug = title.replace(/\s+/g, '-').toLowerCase();
  let content = req.body.content;

  const errors = req.validationErrors();
  if (errors) {
    return res.render('admin/pages/new', {
      errors: errors,
      title: title,
      slug: slug,
      content: content
    });
  }

  Page.findOne({ slug: slug }, (err, page) => {
    if (page) {
      req.flash('danger', 'Page slug exists, choose another slug.');
      return res.render('admin/pages/new', {
        title: title,
        slug: slug,
        content: content
      });
    }

    const newPage = new Page({
      title: title,
      slug: slug,
      content: content,
      sorting: 0
    });

    newPage.save((err) => {
      if (err) return console.log(err);

      req.flash('success', 'Page added!');
      res.redirect('/admin/pages');
    });
  });
};

const reorderPages = (req) => {
  const ids = req.body.id;

  let count = 0;
  for (let i = 0; i < ids.length; i++) {
    let id = ids[i];
    count++;

    ((count) => {
      Page.findById(id, (err, page) => {
        page.sorting = count;
        page.save((err) => {
          if (err) return console.log(err);
        });
      });
    })(count);
  }
};

const editPage = (req, res) => {
  Page.findOne({ slug: req.params.slug }, (err, page) => {
    if (err) return console.log(err);

    res.render('admin/pages/edit', {
      title: page.title,
      slug: page.slug,
      content: page.content,
      id: page._id
    });
  });
};

const updatePage = (req, res) => {
  req.checkBody('title', 'Title must have a value.').notEmpty();
  req.checkBody('content', 'Content must have a value.').notEmpty();

  let title = req.body.title;
  let slug = req.body.slug.replace(/\s+/g, '-').toLowerCase();
  if (slug === '') slug = title.replace(/\s+/g, '-').toLowerCase();
  let content = req.body.content;
  let id = req.body.id;

  const errors = req.validationErrors();

  if (errors) {
    return res.render('admin/pages/edit', {
      title: title,
      slug: slug,
      content: content,
      id: id
    });
  }

  Page.findOne({ slug: slug, _id: { '$ne': id } }, (err, page) => {
    if (err) return console.log(err);
    if (page) {
      req.flash('danger', 'Page slug exist, choose another.');
      return res.render('admin/pages/edit', {
        title: title,
        slug: slug,
        content: content,
        id: id
      });
    }

    Page.findById(id, (err, page) => {
      if (err) return console.log(err);

      page.title = title;
      page.slug = slug;
      page.content = content;

      page.save(err => {
        if (err) return console.log(err);

        req.flash('success', 'Page edited');
        res.redirect('/admin/pages');
      });
    });
  });
};

module.exports = {
  index,
  newPage,
  createPage,
  reorderPages,
  editPage,
  updatePage
};
