const router = require('express').Router();
const staticsController = require('../controllers/statics');
const sessionsController = require('../controllers/sessions');
const registrationsController = require('../controllers/registrations');
const filmsController = require('../controllers/films');
const secureRoute = require('../lib/secureRoute');

router.route('/')
  .get(staticsController.index);

router.route('/films')
  .get(filmsController.index)
  .post(secureRoute, filmsController.create);

router.route('/films/new')
  .get(secureRoute, filmsController.new);

router.route('/films/:id')
  .get(filmsController.show)
  .put(secureRoute, filmsController.update)
  .delete(secureRoute, filmsController.delete);

router.route('/films/:id/edit')
  .get(secureRoute, filmsController.edit);

router.route('/register')
  .get(registrationsController.new)
  .post(registrationsController.create);

router.route('/login')
  .get(sessionsController.new)
  .post(sessionsController.create);

router.route('/logout')
  .get(sessionsController.delete);

// catch all 404 error page
router.all('*', (req, res) => res.notFound());

module.exports = router;