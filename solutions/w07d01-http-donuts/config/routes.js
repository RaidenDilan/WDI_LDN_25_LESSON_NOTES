const router = require('express').Router();
const donutsController = require('../controllers/donuts');

router.route('/donuts')
  .get(donutsController.index)
  .post(donutsController.create);

router.route('/donuts/:id')
  .get(donutsController.show)
  .put(donutsController.update)
  .delete(donutsController.delete);

// catch all 404 response
router.all('*', (req, res) => res.notFound());

module.exports = router;