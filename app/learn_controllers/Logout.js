'use strict';
let express = require('express');
let router = express.Router();

//path: /logout

router.get('/', function(req, res) {
	try{
		req.tndata.reset();
		res.render('logout',{layout:'layout', title: 'Logout Trạng Nguyên'});
	}
	catch(e){
		logger.error(e);
	}
});

module.exports = router;