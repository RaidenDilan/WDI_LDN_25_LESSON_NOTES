function indexRoute(req, res) {
  res.render('index');
}

function notFoundRoute(req, res) {
  res.render('404');
}

module.exports = {
  index: indexRoute,
  notFound: notFoundRoute
};
