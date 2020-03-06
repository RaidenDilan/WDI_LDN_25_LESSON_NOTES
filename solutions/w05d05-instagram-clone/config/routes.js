const router = require('express').Router();
const registrations = require('../controllers/registrations');
const sessions = require('../controllers/sessions');
const secureRoute = require('../lib/secureRoute');
const users = require('../controllers/users');
const oauth = require('../controllers/oauth');
const upload = require('../lib/upload');

router.get('/', (req, res) => res.render('statics/index'));

router.route('/user')
  .get(secureRoute, users.show);

router.route('/user/images/new')
  .get(secureRoute, users.newImage);

router.route('/user/images')
  .post(secureRoute, upload.single('filename'), users.createImage);

router.route('/register')
  .get(registrations.new)
  .post(registrations.create);

router.route('/login')
  .get(sessions.new)
  .post(sessions.create);

router.route('/oauth/github')
  .get(oauth.github);

router.all('*', (req, res) => res.notFound());

module.exports = router;