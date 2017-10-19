const index = (req, res) => {
  res.send('admin pages');
};

const addPage = (req, res) => {
  let title = '';
  let slug = '';
  let content = '';

  res.render('admin/add_page', {
    title: title,
    slug: slug,
    content: content
  });
};

module.exports = {
  index,
  addPage
};
