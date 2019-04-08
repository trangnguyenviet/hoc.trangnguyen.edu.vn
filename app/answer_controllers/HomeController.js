'use strict';
let express = require('express');
let logger = require('tracer').colorConsole();
// let async = require('async');
// let utilModule = require('util');

let router = express.Router();

/*GET home page*/
router.get('/', function(req, res) {
	try{
		//res.render('home',{layout:'layout', title: 'Luyện tập Trạng Nguyên',user: JSON.stringify({_id:1, name: 'Mạc Văn Tân', class_id: 1})});
		res.render('home',{layout:'layout', title: 'Luyện tập Trạng Nguyên'});
	}
	catch(e){
		logger.error(e.stack);
	}
});

module.exports = router;