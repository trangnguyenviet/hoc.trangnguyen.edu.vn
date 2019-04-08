'use strict';
let express = require('express');
let logger = require('tracer').colorConsole();
let router = express.Router();

router.get('/', function(req, res) {
	res.render('register',{});
});

module.exports = router;