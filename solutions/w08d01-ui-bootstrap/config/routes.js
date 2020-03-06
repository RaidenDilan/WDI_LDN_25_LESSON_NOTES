const router = require('express').Router();
const birds = require('../controllers/birds');
const auth = require('../controllers/auth');
const secureRoute = require('../lib/secureRoute');

router.route('/birds')
  .all(secureRoute)
  .get(birds.index)
  .post(birds.create);

router.route('/birds/:id')
  .all(secureRoute)
  .get(birds.show)
  .put(birds.update)
  .delete(birds.delete);

router.route('/register')
  .post(auth.register);

router.route('/login')
  .post(auth.login);

router.all('/*', (req, res) => res.notFound());

module.exports = router;
