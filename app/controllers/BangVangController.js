/**
 * Created by tanmv on 16/07/2017.
 */
'use strict';
let logger = require('tracer').colorConsole();
let async = require('async');
let express = require('express');
let router = express.Router();


router.get('/', function(req, res) {
	// let baseUrl = req.baseUrl;
	// let param_render = {
	// 	baseUrl: baseUrl,
	// 	layout:'layout',
	// 	title: 'Luyện tập Trạng Nguyên'
	// };
	//
	// res.render('practice-list',param_render);

	res.send('bang vang');
});

module.exports = router;