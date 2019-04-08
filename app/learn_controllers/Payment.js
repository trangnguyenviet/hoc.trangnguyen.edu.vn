'use strict';
let express = require('express');
let router = express.Router();

//path: /

router.get('/', function(req, res) {
	try{
		res.render('payment',{layout:'layout', title: 'Luyện tập Trạng Nguyên'});
	}
	catch(e){
		logger.error(e.stack);
	}
});

module.exports = router;