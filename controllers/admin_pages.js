const Page = require('../models/page');

const index = (req, res) => {
  res.send('admin pages');
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

module.exports = {
  index,
  newPage,
  createPage
};
