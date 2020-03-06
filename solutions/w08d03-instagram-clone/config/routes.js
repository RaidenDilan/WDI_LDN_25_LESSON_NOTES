const router = require('express').Router();
const posts = require('../controllers/posts');
const auth = require('../controllers/auth');
const imageUpload = require('../lib/imageUpload');
const secureRoute = require('../lib/secureRoute');

router.route('/posts')
  .get(posts.index)
  .post(secureRoute, imageUpload, posts.create);

router.route('/posts/:id')
  .get(posts.show)
  .delete(secureRoute, posts.delete);

router.route('/posts/:id/comments')
  .post(secureRoute, posts.addComment);

router.route('/posts/:id/comments/:commentId')
  .delete(secureRoute, posts.deleteComment);

router.route('/register')
  .post(auth.register);

router.route('/login')
  .post(auth.login);

router.all('/*', (req, res) => res.notFound());

module.exports = router;
