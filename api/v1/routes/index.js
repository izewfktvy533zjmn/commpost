var express = require('express');
var router = express.Router();

router.use('/comments', require('./commentRoute.js'));

module.exports = router;
