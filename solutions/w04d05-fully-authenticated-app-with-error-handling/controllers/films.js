const Film = require('../models/film');
const genres = [
  'Action',
  'Adventure',
  'Animation',
  'Biography',
  'Comedy',
  'Crime',
  'Documentary',
  'Drama',
  'Family',
  'Fantasy',
  'Horror',
  'Romance',
  'Sci',
  'Sport',
  'Thriller'
];

function filmsIndex(req, res, next) {
  Film
    .find()
    .then((films) => res.render('films/index', { films }))
    .catch(next);
}

function filmsNew(req, res) {
  res.render('films/new', { genres });
}

function filmsCreate(req, res, next) {
  Film
    .create(req.body)
    .then(() => res.redirect('/films'))
    .catch(next);
}

function filmsShow(req, res, next) {
  Film
    .findById(req.params.id)
    .then((film) => {
      if(!film) return res.notFound();
      res.render('films/show', { film });
    })
    .catch(next);
}

function filmsEdit(req, res, next) {
  Film
    .findById(req.params.id)
    .then((film) => {
      if(!film) return res.notFound();
      res.render('films/edit', { film, genres });
    })
    .catch(next);
}

function filmsUpdate(req, res, next) {
  Film
    .findById(req.params.id)
    .then((film) => {
      if(!film) return res.notFound();

      for(const field in req.body) {
        film[field] = req.body[field];
      }

      return film.save();
    })
    .then((film) => res.redirect(`/films/${film.id}`))
    .catch(next);
}

function filmsDelete(req, res, next) {
  Film
    .findById(req.params.id)
    .then((film) => {
      if(!film) return res.notFound();
      return film.remove();
    })
    .then(() => res.redirect('/films'))
    .catch(next);
}

module.exports = {
  index: filmsIndex,
  new: filmsNew,
  create: filmsCreate,
  show: filmsShow,
  edit: filmsEdit,
  update: filmsUpdate,
  delete: filmsDelete
};
