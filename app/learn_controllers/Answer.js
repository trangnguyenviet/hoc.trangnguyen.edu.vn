'use strict';
const CryptoJS = require("crypto-js");
let express = require('express');
let router = express.Router();

//path: /bai-giai

let subjects = {
	'toan': {
		id: 2,
		name: 'Toán',
		max_round: 19,
		test_count: 3,
		free: true
	},
	'tieng-anh': {
		id: 3,
		name: 'Tiếng Anh',
		max_round: 19,
		test_count: 3,
		free: true
	},
	'tieng-viet': {
		id: 1,
		name: 'Tiếng Việt',
		max_round: 19,
		test_count: 3,
		free: true
	},
	'khoa-hoc-tu-nhien': {
		id: 4,
		name: 'Khoa học - tự nhiên',
		max_round: 19,
		test_count: 3,
		free: true
	},
	'su-dia-xa-hoi': {
		id: 5,
		name: 'Sử - địa -xã hội',
		max_round: 19,
		test_count: 3,
		free: true
	},
	'iq-toan-tieng-anh': {
		id: 6,
		name: 'IQ - Toán tiếng anh',
		max_round: 19,
		test_count: 3,
		free: true
	},
};

router.get('/', function(req, res) {
	try{
		res.render('answer-home',{layout:'layout', title: 'Bài giải Trạng Nguyên'});
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

router.get('/:subject', auth.checkAuthor, function(req, res) {
	try{
		let user_id = req.tndata.user._id;
		let class_id = req.tndata.user.class_id;
		let subject_id = req.subject_id;
		const page_size = 20;

		let class_name = class_id==0?'mẫu giáo':class_id;
		let param_render = {
			layout:'answer-layout',
			title: 'Bài giải ' + req.subject_name + ' - Trạng Nguyên',
			class_id: class_id,
			className: class_name,
			page_size: page_size,
			base_url: req.baseUrl,
			subject_url: req.subject_url,
			subject_name: req.subject_name
		};

		/*async.parallel([
			callback => {
				ExamAnswersService.GetList(class_id, page_size, 0, (err, list)=>{
					if(err) logger.error(err);
					else{
						param_render.list = list;
						callback(null, true);
					}
				});
			},
			callback => {
				ExamAnswersService.CountList(class_id, (err, iCount)=>{
					if(err) logger.error(err);
					else{
						param_render.total_row = iCount;
						callback(null, true);
					}
				});
			}
		],()=>{
			res.render('select-questions', param_render);
		});*/
		async.parallel([
			callback=>{
				ExamAnswersService.getListType(class_id, subject_id, (err, list)=>{
					if(err) logger.error(err);
					else{
						param_render.list = list;
						callback(err, list);
					}
				});
			},
			callback =>{
				UserService.checkVip(user_id, (err, info)=>{
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
						callback(err, info);
					}
				});
			}
		],()=>{
			res.render('answer-list', param_render);
		});
	}
	catch(e){
		logger.error(e.stack);
	}
});

router.get('/:subject/:rewrite?.:id.html', auth.checkAuthor, function(req, res) {
	try {
		let class_id = req.tndata.user.class_id;
		let id = req.params.id;

		let param_render = {
			layout: 'answer-layout',
			title: 'Luyện tập lớp ' + class_id + ' Trạng Nguyên',
			class_id: class_id,
			className: class_id == 0 ? 'mẫu giáo' : class_id,
			base_url: req.baseUrl,
			subject_url: req.subject_url,
			subject_name: req.subject_name
		};

		ExamAnswersService.info(id, (err, info)=>{
			if(err) logger.error(err);
			else{
				if(info){
					if(info.class_id == class_id){
						req.tndata.id = id;
						param_render.title = info.name + ' - lớp ' + class_id + ' - Trạng Nguyên';
						param_render.pageName = info.name;
						param_render.ads = false;
						// let num = util.randomInt(10,30);
						// let s = util.randomString(num);
						// param_render.info =  s + CryptoJS.AES.encrypt(JSON.stringify(info), 'MVT2017' + s).toString() + num;
						res.render('answer-play', param_render);
					}
					else{
						res.status(401).render('error',{
							error: 401,
							message: 'Bài thi này không giành cho lớp của bạn'
						});
					}
				}
				else{
					res.status(404).render('error',{
						error: 404,
						message: 'Địa chỉ này không tồn tại'
					});
				}
			}
		});
	}
	catch(e){
		logger.error(e.stack);
	}
});

router.get('/:subject/play.min.js', auth.checkAuthor, function(req, res) {
	res.header('content-type','application/x-javascript; charset=utf-8');
	let id = util.parseInt(req.tndata.id);
	let user = req.tndata.user;
	let user_id = user._id;
	// let referer = req.header('Referer');
	delete req.tndata.id;
	if(id>0){
		async.waterfall([
			callback=>{
				UserService.checkVip(user_id, (err, info)=>{
					if(err){
						logger.error(err);
					}
					else{
						if(info){
							if(info.vip_expire){
								if(info.vip_expire >= new Date()){
									callback(null, {});
								}
								else{
									res.send('Alert("Tài khoản luyện tập của bạn đã hết hạn.<br/>Bạn hãy nộp học phí");');
								}
							}
							else{
								res.send('Alert("Bạn chưa nộp học phí.<br/>Bạn hãy nộp học phí");');
							}
						}
						else{
							res.send('Alert("Không tìm thấy thông tin người dùng");');
						}
					}
				});
			},

			//check mark
			// (data, callback) => {
			// 	if(user.mark){
			// 		callback(null, data)
			// 	}
			// 	else{
			// 		res.send('Alert("Bạn đăng nhập ở quá nhiều thiết bị.\nVui lòng liên hệ với BTC để được trợ giúp");');
			// 	}
			// },

			(data,callback)=>{
				ExamAnswersService.info(id, (err, info)=>{
					if(err) logger.error(err);
					else{
						if(info) {
							let num = util.randomInt(10, 30);
							let s = util.randomString(num);

							let response = {
								layout: null,
								name: info.name,
								description: (info.description && info.description!='')? info.description: 'Nếu là câu trắc nghiệm hãy chọn đáp án đúng nhất.<br/>Nếu là câu điền, hãy nhập vào ô đáp án của bạn.<br/>Click vào nút <strong>Bắt đầu</strong> để bắt đầu luyện.',
								play: info.play,
								time: info.time,
								spq: 10
							};
							delete info._id;
							delete info.name;
							delete info.play;
							delete info.time;
							response.info = s + CryptoJS.AES.encrypt(JSON.stringify(info), 'MVT2017' + s).toString() + num;
							res.render('game/examAnswers', response);
						}
						else{
							res.send('Alert("Không có thông tin bài thi");');
						}
					}
				});
			}
		]);
	}
	else{
		res.render('game/examAnswers',{
			layout: null,
			info:'btm290doxnh9xU2FsdGVkX1+jGL+AONfxUmTxLWNRznJ22GH0OmC9dt8NignsTmKij2ybNEOEfAcJJl21Z7cObXq6U5VRsV9lGnAxyW5v1A2S1QxrRxVqVschn9N+QSPbKR4JiitzRn4HLjk9s8KA+H7Y0/yW6D5DI2l1lCFPsxKHQW97WQDS/F39Q7jl5ByRgIXGpM6B2SqmJBktWwmihaPejGZRf5byL2B0AuBNedBQAt/ZPaP5RmzFrVdAxPyNmaP0C70iljrPCTqK/50DKfEercNP2vCTz0Ad3EQ3elJRjb9i4RLbSujHvrrul+JVny8iIZvvJnJyePvznTrUHyN4K+BNYN39KiwkOhCMVMLyALF2p7ZFI5UXc2FX3J4A0S+eI0HE755pb8l5oHj6qZKfWUfzq+wfj00VWtjOOe03KxJMXq3euGz8NNcIISCwAmjfFSgv499NCAUs1XmYr3nQ8pEuwqeGM1dZ/D9Te/zhHb7QjU5lLVffKOT+LCmbLhgswhgBp1D0aiSh5oA3QV2Xmt/xjElCcTQKK/HdKPKOvJc1AiM6nBbk9hOz8dRiiEP2EOJjygaGZ9jo1xlbjmVrWsJRsXa15Z7L6PhxI3JH7hZ9BfUJJASJGqusvzSSJaN4Hk6SzmXvbUmHjzFg3wyfY5QWMB3SK7UkDPdUk+8ZQUu3kQxeNfBSUcmUVB/d0V5NBh5dnIjx4ZifRjjcQPwuYFRbRJwYwzhvoyAv8L4Y/UAdymWxKV5QbUE21YwrHhn+qG+mATJvuVc2MM+a5scZDJDJsNUhUX4PYFsaMJFSCuoGnmc1lZu5Aff83WwbN26tgBFU5kIxSfbdP2c8uv4PQTDFXFiNUP7dfxHsao+9M0gu1bhtcL2kJ1RD1alJWKfOpVtEZPonhJ92fiuDSD9x5OTrY0i7uM5jh9qpCQk1YT4l+yh10EjfpcLs4AUNQU6iTrKsAkoLFLwpiLRQfoW2xfkB+LOOso8prT5xEiUM0abLGazebKWAD++Xw7tW0UJP4wX+ONm9FZVknqkw0cF5vJBb1l1bW1YEhZG3BnfOYf9T/AVFtC/VH2Jy0gjn+Yn+C2ZdRS+qJ7O01G7Jvl+AAM6yYGFSHSWuD6UdqeblHJbagi+u0ue5ykIDXDPTYtL9Cm54UluR0MdxHgzxu+wUNjFd2pvsiigq1DZLmHZfwtzOoih3MVRDpDwzFRKp6d6XmKUilUR2cLyeOcFmgupqmhDpLm6R1HotLxWLllF3h4WmZvChdjb2dqOTWjCZbYXMDSSf2APS1eWNABMJp6pYiJeyF01nrjV2Y88u9cjI+2dYhOQzfDOFBP88xXTthFwcPKYNz14fKGaj5wAJp20HHjL5Hzv0Pc+waIAe7y8Y+Emna1XirUXHFusUwbhYxfBHfhqk5ST3fDcUlIQOKV7nZWaftrKwe9TCwdryjjT99uDQTWyZ70cbMtIwnl5TEh6wBpSldTYm+M6Jtco/7t7ggBdpiaAkviFoznxE4+nCx3Yd9C94FiORK8MFsDz/3jYqDSmpQedyMrThR7hXQYzRtAu+EhD6zURsulQxnKXuIAhUalFY3Pe1TjIRokFn++yf8wXcoBTtLwBh0GAsm0MGSGkcriLUbdaJox+3bzafzwucaGjnj82xF0yoG+Ow4ZCxLmApvLddy/ICqNdhU0UDKN07HIzKDKE6sJECys2NS8/2DV3+EBhuS3g+9ZYr2/8kMigbMyf3pGmjCv7nmBLPNLooCnqdLD68yK1JdGXmIwd6rvGa7G9JL+o04wtcOEQNMpwDJMwT13',
			name: 'Trạng Nguyên Tiếng Việt',
			description: 'play thôi',
			play: 0,
			time: 10000,
			spq: 1
		});
	}
});

module.exports = router;