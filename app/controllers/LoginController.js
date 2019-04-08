'use strict';
let express = require('express');
let logger = require('tracer').colorConsole();
let router = express.Router();
let request = require('request');

router.get('/', function(req, res) {
	let param = {
		layout:'layout',
		title: 'Luyện tập Trạng Nguyên',
		back: req.query.back || '/'
	};
	res.render('login', param);
});

router.post('/', (req, res) => {
	res.json(req.body);
});

router.post('/facebook', (req, res) => {
	let accessToken = util.toString(req.body.accessToken, '');
	if(accessToken && accessToken!=''){

		request('https://graph.facebook.com/me?fields=id,name,gender,picture,email&access_token=' + accessToken, (error, response, body)=>{
			if(error){
				logger.error(error);
				return res.json({
					error: 10000,
					message: 'Server đang bận, vui lòng thử lại sau'
				});
			}
			else{
				if(response && response.statusCode == 200){
					let data = util.parseJson(body);
					if(data && data.email){
						UserService.infoByEmail(data.email,(err, info)=>{
							if(err){
								logger.error(err);
							}
							else{
								if(info){
									req.tndata.user = info;
									req.tndata.login_type = 'facebook';
									return res.json({
										error: 0,
										message: ''
									});
								}
								else{
									req.tndata.fbData = data;
									return res.json({
										error: 0,
										message: '',
										isRegister: true,
										fbData: data
									});
								}
							}
						});
					}
					else{
						return res.json({
							error: 1000,
							message: 'không lấy được thông tin người dùng'
						});
					}
				}
				else{
					return res.json({
						error: 1000,
						message: 'Kết nối facebook không thành công'
					});
				}
			}
		});
	}
	else{
		return res.json({
			error: 1,
			message: 'tham số truyền không đúng'
		});
	}
});

router.post('/google', (req, res) => {
	let accessToken = util.toString(req.body.accessToken, '');
	if(accessToken && accessToken!=''){
		/*{
			"id": "109895435072020652158",
			"email": "macvantan@gmail.com",
			"verified_email": true,
			"name": "Văn Tân Mạc (MVT)",
			"given_name": "Văn Tân",
			"family_name": "Mạc",
			"link": "https://plus.google.com/+Macvantan",
			"picture": "https://lh4.googleusercontent.com/-tp50SdPnj5M/AAAAAAAAAAI/AAAAAAAAAbs/ORD8WF58ohY/photo.jpg",
			"gender": "male",
			"locale": "vi"
		}*/
		request('https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=' + accessToken, (error, response, body)=>{
			if(error){
				logger.error(error);
				return res.json({
					error: 10000,
					message: 'Server đang bận, vui lòng thử lại sau'
				});
			}
			else{
				if(response && response.statusCode == 200){
					let data = util.parseJson(body);
					if(data && data.email){
						UserService.infoByEmail(data.email,(err, info)=>{
							if(err){
								logger.error(err);
							}
							else{
								if(info){
									req.tndata.user = info;
									req.tndata.login_type = 'google';
									return res.json({
										error: 0,
										message: ''
									});
								}
								else{
									req.tndata.fbData = data;
									return res.json({
										error: 0,
										message: '',
										isRegister: true,
										googleData: data
									});
								}
							}
						});
					}
					else{
						return res.json({
							error: 1000,
							message: 'không lấy được thông tin người dùng'
						});
					}
				}
				else{
					return res.json({
						error: 1000,
						message: 'Kết nối google không thành công'
					});
				}
			}
		});
	}
	else{
		return res.json({
			error: 1,
			message: 'tham số truyền không đúng'
		});
	}
});

module.exports = router;