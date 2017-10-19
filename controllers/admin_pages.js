const index = (req, res) => {
  res.render('index', {
    title: 'Admin'
  });
};

module.exports = {
  index
};
