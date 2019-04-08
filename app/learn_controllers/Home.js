'use strict';
let express = require('express');
let router = express.Router();

//path: /

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