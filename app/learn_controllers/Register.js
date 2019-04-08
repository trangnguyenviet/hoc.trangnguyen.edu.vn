'use strict';
let express = require('express');
let router = express.Router();

//path: /dang-ky

router.get('/', function(req, res) {
	try{
		res.render('register',{layout:'layout', title: 'Đăng ký tài khoản - Trạng Nguyên'});
	}
	catch(e){
		logger.error(e);
	}
});

router.post('/', function(req, res) {
	try{
		//
	}
	catch(e){
		logger.error(e);
	}
});

module.exports = router;