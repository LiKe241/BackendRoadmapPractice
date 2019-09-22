exports.getPublic = (req, res) => {
  const threads = {};
  res.render('public', { threads });
};
