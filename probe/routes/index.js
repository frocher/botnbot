const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.send({ msg: 'i am alive' });
});

module.exports = router;
