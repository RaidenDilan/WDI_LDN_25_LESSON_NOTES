const router = require('express').Router();
const cities = require('../controllers/cities');
const skyscanner = require('../controllers/skyscanner');

router.route('/cities')
  .get(cities.index)
  .post(cities.create);

router.route('/cities/:id')
  .get(cities.show)
  .put(cities.update)
  .delete(cities.delete);

router.get('/flights', skyscanner.flights);

router.all('/*', (req, res) => res.notFound());

module.exports = router;
