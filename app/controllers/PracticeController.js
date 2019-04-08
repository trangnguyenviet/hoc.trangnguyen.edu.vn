/**
 * Created by tanmv on 16/07/2017.
 */
'use strict';
let logger = require('tracer').colorConsole();
let async = require('async');
let express = require('express');
let router = express.Router();

// router.use('/:subject', function(req, res, next) {
// 	res.locals.subject = req.params.subject;
// 	next();
// });
//
// router.use('/:subject/:round', function(req, res, next) {
// 	res.locals.subject = req.params.subject;
// 	res.locals.round = req.params.round;
// 	next();
// });

let subjects = {
	'toan': {
		id: 1,
		name: 'Luyện Toán',
		max_round: 19,
		test_count: 3,
		free: true
	},
	'tieng-anh': {
		id: 2,
		name: 'Luyện Tiếng Anh',
		max_round: 19,
		test_count: 3,
		free: true
	},
	'tieng-viet': {
		id: 3,
		name: 'Luyện Tiếng Việt',
		max_round: 19,
		test_count: 3,
		free: true
	},
	// 'tv': {
	// 	id: 4,
	// 	name: 'Tiếng Việt',
	// 	max_round: 19,
	// 	test_count: 3,
	// 	free: false
	// },
	'khoa-hoc-tu-nhien': {
		id: 5,
		name: 'Luyện Khoa học - tự nhiên',
		max_round: 19,
		test_count: 3,
		free: true
	},
	'su-dia-xa-hoi': {
		id: 6,
		name: 'Luyện Sử - địa -xã hội',
		max_round: 19,
		test_count: 3,
		free: true
	},
	'iq-toan-tieng-anh': {
		id: 7,
		name: 'Luyện IQ - Toán tiếng anh',
		max_round: 19,
		test_count: 3,
		free: true
	},
};

router.get('/', function(req, res) {
	let baseUrl = req.baseUrl;
	let param_render = {
		baseUrl: baseUrl,
		layout:'layout'
	};

	res.render('practice-list',param_render);
});

router.get('/:subject', auth.checkAuthor, (req, res) => {
	let user = req.tndata.user;
	if(user){
		let baseUrl = req.baseUrl;
		let param_render = {
			baseUrl: baseUrl,
			layout:'layout',
			title: 'Luyện tập Trạng Nguyên'
		};

		let subject = req.params.subject;
		let subject_info = subjects[subject];
		if(subject_info){
			param_render.name = subject_info.name;
			param_render.free = true;
			let subject_config = variables['subject_' + subject_info.id + '_' + user.class_id];
			param_render.current_round = subject_config.current_round;
			param_render.payment_round = subject_config.payment_round;
			param_render.subject = subject;
			param_render.rounds = JSON.stringify(subject_config.rounds);
			res.render('practice-round',param_render);
			// res.json(param_render);
		}
		else{
			res.status(404).render('404');
		}
	}
	else{
		res.status(401).send('Bạn hãy đăng nhập');
	}
});

router.get('/:subject/vong-:round', auth.checkAuthor, (req, res) => {
	res.json({
		subject: req.params.subject,
		round: req.params.round,
	});
});

router.post('/:subject/vong-:round', auth.checkAuthor, (req, res) => {
	res.json({
		subject: req.params.subject,
		round: req.params.round,
	});
});

router.get('/:subject/vong-:round/bai-:test', auth.checkAuthor, (req, res) => {
	res.json({
		subject: req.params.subject,
		round: req.params.round,
		test: req.params.test,
	});
});

module.exports = router;