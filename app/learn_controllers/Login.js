'use strict';
const express = require('express');
const router = express.Router();
const request = require('request');
const LogUsersModel = require('../models/LogUsersModel');

//path: /dang-nhap

router.get('/', function(req, res) {
	try{
		if(req.tndata.user){
			res.redirect('/');
		}
		else{
			res.render('login',{
				layout:'layout',
				title: 'Đăng nhập - Trạng Nguyên',
				back: req.query.back? req.query.back: '/'
			});
		}
	}
	catch(e){
		logger.error(e);
	}
});

router.post('/', function(req, res) {
	try{
		const username = util.parseString(req.body.username);
		let password = util.parseString(req.body.password);
		const captcha = util.parseString(req.body.captcha);
		const ip = req.headers['x-forwarded-for']? req.headers['x-forwarded-for']: req.connection.remoteAddress;

		if(!username || !password) {
			return res.json({
				error: 200,
				message: 'Chưa nhập đủ thông tin'
			});
		} else if(!util.isUsername(username)) {
			return res.json({
				error: 101,
				message: 'định dạng username không đúng'
			});
		} else if(!util.isPassword(password)) {
			return res.json({
				error: 201,
				message: 'định dạng password không đúng'
			});
		} else {
			password = util.sha256(password);
			request.post({
				url:'https://www.google.com/recaptcha/api/siteverify',
				form: {
					secret: '6Ld4EwsTAAAAAHn0TP89WveSDpDJEDivsuzlaBPh',
					response: captcha,
					remoteip: ip
				}
			}, (err, response, body) => {
				if(err) {
					logger.error(err);
					return res.json({
						error: 1000,
						message: 'Server đang bận, vui lòng thử lại sau'
					});
				} else {
					if(response && response.statusCode === 200) {
						let captchaRes = util.parseJson(body);
						if(captchaRes && captchaRes.success) {
							UserService.login(username, password, (err, info) => {
								if(err) {
									logger.error(err);
									return res.json({
										error: 1000,
										message: 'Server đang bận, vui lòng thử lại sau'
									});
								} else {
									if(info && !info.deleted) {
										//set value user
										let ujs = info.toJSON();
										delete ujs.marks;
										response.user = ujs;

										//set marks
										// const user_id = info._id;
										// let cookie_name = '_' + user_id;
										// let mark_get = req.cookies[cookie_name];
										// let marks = info.marks || [];
										// if(!mark_get) {
										// 	if(marks.length < 4) {
										// 		let mark = util.getMarks();
										// 		res.cookie(cookie_name, mark, {
										// 			domain: '.trangnguyen.edu.vn',
										// 			maxAge: new Date().getTime() + 63072000,
										// 			httpOnly: true
										// 		});
										// 		UserService.addMark(user_id, mark, (err) => {
										// 			if(err) logger.error(err);
										// 		});
										// 		ujs.mark = true;
										// 	}
										// } else {
										// 	if(marks.indexOf(mark_get) >= 0) {
										// 		ujs.mark = true;
										// 	}
										// }
										//end set marks

										//session
										req.tndata.user = ujs;

										//set marks
										const user_id = info._id;
										const cookie_name = '_i_';
										let token_value = req.cookies[cookie_name];
										if(!token_value){
											token_value = util.getMarks();
											res.cookie(cookie_name, token_value, {
												domain: '.trangnguyen.edu.vn',
												maxAge: Infinity,
												httpOnly: true
											});
										}
										const log = new LogUsersModel({
											user_id,
											ip,
											action: 'login',
											token: token_value,
											client_info: {
												use_agent: req.headers['user-agent'],
												referer: req.headers['referer'],
												position: req.body.position
											}
										});
										log.save((err, info) => {});
										redis_token.set(user_id, token_value); // redis_token is global
										//end set marks

										return res.json({
											error: 0,
											message: '',
											info
										});
									} else {
										return res.json({
											error: 3,
											message: 'Tên đăng nhập hoặc mật khẩu không đúng'
										});
									}
								}
							});
						} else {
							return res.json({
								error: 2,
								message: 'Xác nhận người dùng chưa đúng'
							});
						}
					} else {
						logger.error('status:', response.statusCode);
						return res.json({
							error: 1000,
							message: 'Server đang bận, vui lòng thử lại sau'
						});
					}
				}
			});
		}
	} catch(e) {
		logger.error(e);
	}
});

module.exports = router;