'use strict';
const CryptoJS = require("crypto-js");
let express = require('express');
let router = express.Router();

//path: /luyen-tap

let subjects = {
	'toan': {
		id: 1,
		name: 'Toán',
		max_round: 19,
		test_count: 3,
		free: true
	},
	'tieng-anh': {
		id: 2,
		name: 'Tiếng Anh',
		max_round: 19,
		test_count: 3,
		free: true
	},
	'tieng-viet': {
		id: 3,
		name: 'Tiếng Việt',
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
		name: 'Khoa học - tự nhiên',
		max_round: 19,
		test_count: 3,
		free: true
	},
	'su-dia-xa-hoi': {
		id: 6,
		name: 'Sử - địa -xã hội',
		max_round: 19,
		test_count: 3,
		free: true
	},
	'iq-toan-tieng-anh': {
		id: 7,
		name: 'IQ - Toán tiếng anh',
		max_round: 19,
		test_count: 3,
		free: true
	},
};

router.get('/', function(req, res) {
	try{
		res.render('practice-home',{
			// baseUrl: req.baseUrl,
			layout:'layout',
			title: 'Luyện tập Trạng Nguyên'
		});
	}
	catch(e){
		logger.error(e);
	}
});

router.use('/:subject',(req,res,next)=>{
	let subject = req.params.subject;
	let subject_info = subjects[subject];
	if(subject_info){
		req.subject_url = subject;
		req.subject_id = subject_info.id;
		req.subject_name = subject_info.name;
		next();
	}
	else{
		res.status(404).render('404');
	}
});

//path: /luyen-tap/tieng-viet|toan|....
router.get('/:subject', auth.checkAuthor, function(req, res) {
	try{
		let class_id = req.tndata.user.class_id;
		let subject_id = req.subject_id;
		const page_size = 20;

		let class_name = class_id==0? 'Mẫu giáo': class_id;
		let param_render = {
			layout:'practice-layout',
			title: 'Luyện tập ' + req.subject_name + ' - Trạng Nguyên',
			// class_id: class_id,
			className: class_name,
			page_size: page_size,
			base_url: req.baseUrl,
			subject_url: req.subject_url,
			subject_name: req.subject_name
		};

		param_render.subject_info = JSON.stringify(global.variables['subject_' + subject_id + '_' + class_id] || {});
		res.render('practice-list', param_render);
	}
	catch(e){
		logger.error(e.stack);
	}
});

router.get('/:subject/vong-:round', auth.checkAuthor, function(req, res) {
	try{
		let user = req.tndata.user;
		let class_id = user.class_id;
		let subject_id = req.subject_id;
		let round = util.parseInt(req.params.round);
		let class_name = class_id==0? 'Mẫu giáo': class_id;
		let subject_info = global.variables['subject_' + subject_id + '_' + class_id];
		if(subject_info && subject_info.current_round>=round && round>0){
			let param_render = {
				layout:'practice-layout',
				title: 'Luyện tập ' + req.subject_name + ' - vòng ' + round + ' - Trạng Nguyên',
				subject_id,
				round,
				class_id,
				className: class_name,
				base_url: req.baseUrl,
				subject_url: req.subject_url,
				subject_name: req.subject_name,
				pass: true,
				message: ''
			};

			// if(user.mark){
				if(subject_info.payment_round<=round){
					UserService.checkVip(user._id, (err, info)=>{
						if(err){
							logger.error(err);
						}
						else{
							if(info){
								if(info.vip_expire){
									if(info.vip_expire >= new Date()){
										//nothing => pass
									}
									else{
										param_render.pass = false;
										param_render.redirect = 'https://trangnguyen.edu.vn/huong-dan/huong-dan-nop-hoc-phi-qua-ngan-hang-va-the-trang-nguyen.1260';
										param_render.message = 'Tài khoản luyện tập của bạn đã hết hạn.<br/>Bạn hãy nộp học phí';
									}
								}
								else{
									param_render.pass = false;
									param_render.redirect = 'https://trangnguyen.edu.vn/huong-dan/huong-dan-nop-hoc-phi-qua-ngan-hang-va-the-trang-nguyen.1260';
									param_render.message = 'Bạn chưa nộp học phí.<br/>Bạn hãy nộp học phí';
								}
							}
							else{
								param_render.pass = false;
								param_render.message = 'Không tìm thấy thông tin người dùng';
							}
							res.render('practice-round', param_render);
						}
					});
				}
				else{
					res.render('practice-round', param_render);
				}
			// }
			// else{
			// 	param_render.pass = false;
			// 	param_render.message = 'Bạn đăng nhập ở quá nhiều thiết bị.</br> Vui lòng liên hệ với BTC để được trợ giúp';
			// 	res.render('practice-round', param_render);
			// }
		}
		else{
			res.status(404).render('404');
		}
	}
	catch(e){
		logger.error(e.stack);
	}
});

router.post('/:subject/vong-:round/check', auth.checkAuthor, function(req, res) {
	let subject_id = req.subject_id;
	let round = util.parseInt(req.params.round);
	let class_id = req.tndata.user.class_id;
	let test = util.parseInt(req.body.test);
	ExamService.info(subject_id, class_id, round, test, (err, info)=>{
		if(err){
			logger.error(err);
			res.json({
				error: 1000,
				message: 'Server đang bận, vui lòng thử lại sau'
			});
		}
		else{
			if(info){
				res.json({
					error: 0,
					message: ''
				});
			}
			else{
				res.json({
					error: 1,
					message: 'Không có thông tin bài thi'
				});
			}
		}
	});
});

router.get('/:subject/vong-:round/bai-:test.html', auth.checkAuthor, function(req, res) {
	try{
		let user = req.tndata.user;
		let class_id = user.class_id;
		let subject_id = req.subject_id;
		let round = util.parseInt(req.params.round);
		let test = util.parseInt(req.params.test);
		let class_name = class_id==0? 'Mẫu giáo': class_id;
		let subject_info = global.variables['subject_' + subject_id + '_' + class_id];
		if(subject_info && subject_info.current_round>=round){
			let param_render = {
				layout:'layout-game',
				title: 'Luyện tập ' + req.subject_name + ' - vòng ' + round + ' - Trạng Nguyên',
				round,
				className: class_name,
				base_url: req.baseUrl,
				subject_url: req.subject_url,
				subject_name: req.subject_name
			};

			let data = {};
			async.waterfall([
				//check vip
				// callback => {
				// 	//kiểm tra nếu vòng hiện tại lớn hơn vòng thu phí
				// 	if(round >= subject_info.payment_round){
				// 		UserService.checkVip(user._id, (err, info)=>{
				// 			if(err){
				// 				logger.error(err);
				// 			}
				// 			else{
				// 				if(info && info.vip_expire && info.vip_expire >= new Date()){
				// 					callback(err, data);
				// 				}
				// 				else{
				// 					res.status(401).send('401: bạn chưa nộp học phí hoặc đã hết hạn');
				// 				}
				// 			}
				// 		});
				// 	}
				// 	else{
				// 		callback(null, data);
				// 	}
				// },

				//check exam
				// (data,callback) => {
				callback => {
					ExamService.info(subject_id, class_id, round, test, (err, info)=>{
						if(err){
							logger.error(err);
						}
						else{
							if(info){
								data.exam = info;
								callback(err, info);
							}
							else{
								res.status(401).send('404: Chưa có bài thi');
							}
						}
					});
				}
			], ()=>{
				// let num = util.randomInt(10,30);
				// let s = util.randomString(num);
				// param_render.exam =  s + CryptoJS.AES.encrypt(JSON.stringify(data.exam), 'MVT2017' + s).toString() + num;
				//req.tndata.id = data.exam._id;
				req.tndata.test = test;
				if(data.exam.game_id>0){
					param_render['game_' + data.exam.game_id] = true;
					res.render('practice-play-game', param_render);
				}
				else{
					res.render('practice-play-web', param_render);
				}
			});
		}
		else{
			res.status(404).render('404');
		}
	}
	catch(e){
		logger.error(e.stack);
	}
});

router.get('/:subject/vong-:round/web.min.js', auth.checkAuthor, function(req, res) {
	if(req.tndata.test){
		res.header('content-type','application/x-javascript; charset=utf-8');
		let user = req.tndata.user;
		let class_id = user.class_id;
		let subject_id = req.subject_id;
		let round = util.parseInt(req.params.round);
		//let test = util.parseInt(req.params.test);
		let test = util.parseInt(req.tndata.test);
		let subject_info = global.variables['subject_' + subject_id + '_' + class_id];
		let param_render ={
			error: false,
			message: '',
			type_id: subject_id,
			round_id: round,
			test_id: test,
			user_id: user._id
		};
		delete req.tndata.test;
		if(subject_info && subject_info.current_round>=round){
			let data = {};
			async.waterfall([
				//check vip
				callback => {
					//kiểm tra nếu vòng hiện tại lớn hơn vòng thu phí
					if(round >= subject_info.payment_round){
						UserService.checkVip(user._id, (err, info)=>{
							if(err){
								logger.error(err);
								return res.render('game/web',{
									error: true,
									message: 'Server đang bận, vui lòng thử lại sau'
								});
							}
							else{
								if(info && info.vip_expire && info.vip_expire >= new Date()){
									callback(err, data);
								}
								else{
									return res.render('game/web',{
										error: true,
										message: 'bạn chưa nộp học phí hoặc đã hết hạn'
									});
								}
							}
						});
					}
					else{
						callback(null, data);
					}
				},

				//check mark
				// (data, callback) => {
				// 	if(user.mark){
				// 		callback(null, data)
				// 	}
				// 	else{
				// 		return res.render('game/web',{
				// 			error: true,
				// 			message: 'Bạn đăng nhập ở quá nhiều thiết bị. Vui lòng liên hệ với BTC để được trợ giúp'
				// 		});
				// 	}
				// },

				//check exam
				(data,callback) => {
					ExamService.info(subject_id, class_id, round, test, (err, info)=>{
						if(err){
							logger.error(err);
							return res.render('game/web',{
								error: true,
								message: 'Server đang bận, vui lòng thử lại sau'
							});
						}
						else{
							if(info){
								data.exam = info;
								callback(err, info);
							}
							else{
								return res.render('game/web',{
									error: true,
									message: 'Chưa có nội dung bài thi'
								});
							}
						}
					});
				}
			], ()=>{
				let num = util.randomInt(10,30);
				let s = util.randomString(num);
				param_render.exam =  s + CryptoJS.AES.encrypt(JSON.stringify(data.exam), 'MVT2017' + s).toString() + num;
				return res.render('game/web', param_render);
			});
		}
		else{
			return res.render('game/web',{
				error: true,
				message: 'Vòng này chưa được mở'
			});
		}
	}
	else{
		res.status(301).redirect('https://eth.remitano.com/vn?ref=mvthp');
	}
});

router.get('/:subject/vong-:round/game.min.js', auth.checkAuthor, function(req, res) {
	if(req.tndata.test){
		res.header('content-type','application/x-javascript; charset=utf-8');
		let user = req.tndata.user;
		let class_id = user.class_id;
		let subject_id = req.subject_id;
		let round = util.parseInt(req.params.round);
		let test = util.parseInt(req.tndata.test);
		let subject_info = global.variables['subject_' + subject_id + '_' + class_id];
		let param_render ={
			error: false,
			message: '',
			type_id: subject_id,
			round_id: round,
			test_id: test,
			user_id: user._id
		};
		delete req.tndata.test;
		if(subject_info && subject_info.current_round>=round){
			let data = {};
			async.waterfall([
				//check vip
				callback => {
					//kiểm tra nếu vòng hiện tại lớn hơn vòng thu phí
					if(round >= subject_info.payment_round){
						UserService.checkVip(user._id, (err, info)=>{
							if(err){
								logger.error(err);
								return res.render('game/web',{
									error: true,
									message: 'Server đang bận, vui lòng thử lại sau'
								});
							}
							else{
								if(info && info.vip_expire && info.vip_expire >= new Date()){
									callback(err, data);
								}
								else{
									return res.render('game/web',{
										error: true,
										message: 'bạn chưa nộp học phí hoặc đã hết hạn'
									});
								}
							}
						});
					}
					else{
						callback(null, data);
					}
				},

				//check mark
				// (data, callback) => {
				// 	if(user.mark){
				// 		callback(null, data)
				// 	}
				// 	else{
				// 		return res.render('game/web',{
				// 			error: true,
				// 			message: 'Bạn đăng nhập ở quá nhiều thiết bị. Vui lòng liên hệ với BTC để được trợ giúp'
				// 		});
				// 	}
				// },

				//check exam
				(data,callback) => {
					ExamService.info(subject_id, class_id, round, test, (err, info)=>{
						if(err){
							logger.error(err);
							return res.render('game/web',{
								error: true,
								message: 'Server đang bận, vui lòng thử lại sau'
							});
						}
						else{
							if(info){
								data.exam = info;
								callback(err, info);
							}
							else{
								return res.render('game/web',{
									error: true,
									message: 'Chưa có nội dung bài thi'
								});
							}
						}
					});
				}
			], ()=>{
				let num = util.randomInt(10,30);
				let s = util.randomString(num);
				param_render.exam =  s + CryptoJS.AES.encrypt(JSON.stringify(data.exam), 'MVT2017' + s).toString() + num;
				let game_id = data.exam.game_id;
				if(game_id === 1){
					return res.render('game/mouse', param_render);
				} else if(game_id === 2){
					return res.render('game/buffalo', param_render);
				} else if(game_id === 3){
					return res.render('game/tiger', param_render);
				} else if(game_id === 4){
					return res.render('game/cat', param_render);
				} else if(game_id === 7){
					return res.render('game/horse', param_render);
				}
			});
		}
		else{
			return res.render('game/web',{
				error: true,
				message: 'Vòng này chưa được mở'
			});
		}
	}
	else{
		res.status(301).redirect('https://eth.remitano.com/vn?ref=mvthp');
	}
});

// router.post('/:subject/vong-:round/bai-:test', auth.checkAuthor, function(req, res) {
//
// });

module.exports = router;