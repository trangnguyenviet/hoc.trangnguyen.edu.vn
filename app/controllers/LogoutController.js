'use strict';
let express = require('express');
let logger = require('tracer').colorConsole();
let router = express.Router();
let request = require('request');

router.get('/', function(req, res) {
	var loginType = req.tndata.login_type || 'default';
	req.tndata.reset();
	if(loginType=='facebook'){
		res.render('logout', {login_facebook: true});
	}
	else if(loginType=='google'){
		res.render('logout', {login_google: true});
	}
	else{
		res.redirect('/');
	}
});

module.exports = router;