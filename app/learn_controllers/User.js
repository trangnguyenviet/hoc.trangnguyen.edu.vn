'use strict';
let express = require('express');
let router = express.Router();

//path: /tai-khoan

router.get('/', function(req, res) {
	try{
		res.render('logout',{layout:'layout', title: 'Luyện tập Trạng Nguyên'});
	}
	catch(e){
		logger.error(e);
	}
});

router.post('/check-vip', auth.checkAuthor, function(req, res) {
	try{
		UserService.checkVip(req.tndata.user._id,(err, info)=>{
			if(err){
				res.json({
					error: 1000,
					message: 'server đang bận, vui lòng thử lại sau'
				});
			}
			else{
				if(info){
					if(info.vip_expire){
						if(info.vip_expire>=new Date()){
							res.json({
								error: 0,
								message: '',
								info
							});
						}
						else{
							res.json({
								error: 401,
								message: 'Tài khoản đã hết hạn luyện tập, vui lòng gia hạn thêm học phí.'
							});
						}
					}
					else{
						res.json({
							error: 401,
							message: 'Tài khoản chưa nộp học phí luyện tập, vui lòng đóng học phí.'
						});
					}
				}
				else{
					res.json({
						error: 404,
						message: 'không tìm thấy thông tin người dùng'
					});
				}
			}
		});
	}
	catch(e){
		logger.error(e);
	}
});

module.exports = router;