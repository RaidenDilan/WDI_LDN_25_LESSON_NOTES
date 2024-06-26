const express = require('express');
const router = express.Router();

const statics = require('../controllers/statics');

router.route('/')
  .get(statics.index);

router.route('*')
  .get(statics.notFound);

module.exports = router;
