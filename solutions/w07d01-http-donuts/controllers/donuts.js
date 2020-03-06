const Donut = require('../models/donut');

function indexRoute(req, res, next) {
  Donut
    .find()
    .then((donuts) => res.json(donuts))
    .catch(next);
}

function createRoute(req, res, next) {
  Donut
    .create(req.body)
    .then((donut) => res.status(201).json(donut))
    .catch(next);
}

function showRoute(req, res, next) {
  Donut
    .findById(req.params.id)
    .then((donut) => {
      if(!donut) return res.notFound();
      res.json(donut);
    })
    .catch(next);
}

function updateRoute(req, res, next) {
  Donut
    .findById(req.params.id)
    .then((donut) => {
      if(!donut) return res.notFound();

      for(const field in req.body) {
        donut[field] = req.body[field];
      }

      return donut.save();
    })
    .then((donut) => res.json(donut))
    .catch(next);
}

function deleteRoute(req, res, next) {
  Donut
    .findById(req.params.id)
    .then((donut) => {
      if(!donut) return res.notFound();
      return donut.remove();
    })
    .then(() => res.status(204).end())
    .catch(next);
}

module.exports = {
  index: indexRoute,
  create: createRoute,
  show: showRoute,
  update: updateRoute,
  delete: deleteRoute
};