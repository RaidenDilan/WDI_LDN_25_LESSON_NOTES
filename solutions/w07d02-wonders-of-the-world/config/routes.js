const router = require('express').Router();
const wondersController = require('../controllers/wonders');

router.route('/wonders')
  .get(wondersController.index)
  .post(wondersController.create);

router.route('/wonders/:id')
  .get(wondersController.show)
  .put(wondersController.update)
  .delete(wondersController.delete);

// catch all 404 response
router.all('*', (req, res) => res.notFound());

module.exports = router;
