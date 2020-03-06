function indexRoute(req, res) {
  res.render('statics/index');
}

module.exports = {
  index: indexRoute
};