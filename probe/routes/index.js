const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
  res.send({ msg: 'i am alive' });
});

module.exports = router;
