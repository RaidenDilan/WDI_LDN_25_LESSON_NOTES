const Book = require('../models/book');

function indexRoute(req, res) {
  Book
    .find()
    .exec()
    .then((books) => {
      res.render('books/index', { books });
    })
    .catch((err) => {
      res.status(500).end(err);
    });
}

function newRoute(req, res){
  res.render('books/new');
}

function showRoute(req, res) {
  Book
    .findById(req.params.id)
    .exec()
    .then((book) => {
      if(!book) return res.status(404).send('Not found');
      res.render('books/show', { book });
    })
    .catch((err) => {
      res.status(500).end(err);
    });
}

function createRoute(req, res) {
  Book
    .create(req.body)
    .then(() => {
      res.redirect('/books');
    })
    .catch((err) => {
      res.status(500).end(err);
    });
}

function editRoute(req, res) {
  Book
    .findById(req.params.id)
    .exec()
    .then((book) => {
      if(!book) return res.status(404).send('Not found');
      res.render('books/edit', { book });
    })
    .catch((err) => {
      res.status(500).end(err);
    });
}

function updateRoute(req, res) {
  Book
    .findById(req.params.id)
    .exec()
    .then((book) => {
      if(!book) return res.status(404).send('Not found');

      for(const field in req.body) {
        book[field] = req.body[field];
      }

      return book.save();
    })
    .then((book) => {
      res.redirect(`/books/${book.id}`);
    })
    .catch((err) => {
      res.status(500).end(err);
    });
}

function deleteRoute(req, res) {
  Book
    .findById(req.params.id)
    .exec()
    .then((book) => {
      if(!book) return res.status(404).send('Not found');

      return book.remove();
    })
    .then(() => {
      res.redirect('/books');
    })
    .catch((err) => {
      res.status(500).end(err);
    });
}

module.exports = {
  index: indexRoute,
  new: newRoute,
  show: showRoute,
  create: createRoute,
  edit: editRoute,
  update: updateRoute,
  delete: deleteRoute
};
