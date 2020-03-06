const User = require('../models/user');

function newRoute(req, res) {
  res.render('registrations/new');
}

function createRoute(req, res, next) {
  User
    .create(req.body)
    .then((user) => {
      req.flash('success', `Thanks for registering, ${user.username}!`);
      res.redirect('/login');
    })
    .catch((err) => {
      if(err.name === 'ValidationError') {
        req.flash('danger', 'Passwords do not match');
        res.redirect('/register');
      }
      next(err);
    });
}

module.exports = {
  new: newRoute,
  create: createRoute
};
