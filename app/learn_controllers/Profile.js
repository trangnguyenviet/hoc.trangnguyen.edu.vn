'use strict';
let express = require('express');
let router = express.Router();

//path: /ca-nhan

router.get('/', auth.checkAuthor, function(req, res) {
	try{
		res.render('profiler',{layout:'layout-profile', title: 'Thông tin cá nhân - Trạng Nguyên'});
	}
	catch(e){
		logger.error(e.stack);
	}
});

const validate = (fullname, class_name, birthday) => {
	if(fullname==''){
		return 'Hãy nhập họ tên';
	} else if(fullname.length<3 && fullname.length>30){
		return'Họ tên không đúng, phải dài từ 3 đến 30 ký tự';
	} else if(!util.isNameVi(fullname)){
		return 'Họ tên không đúng, không có ký tự đặc biệt và số';
	}

	if(class_name==''){
		return 'Hãy nhập tên lớp';
	} else if(/^[a-zA-Z0-9\/]{1,4}$/.test(class_name)==false) {
		return 'Tên lớp không phù hợp'
	}

	if(birthday==''){
		return 'Hãy chọn ngày sinh';
	} else if(!util.isValidDate(birthday)){
		return 'Định dạng ngày tháng không đúng';
	}
	return '';
};

router.post('/', auth.checkAuthor, (req, res) => {
	let user = req.tndata.user;
	const body = req.body;
	let name = body.name || '';
	let class_name = body.class_name || '';
	let birthday = body.birthday || '';
	const msg = validate(name, class_name, birthday);
	if (msg==='') {
		birthday = util.parseDate(birthday);
		// return res.json({
		// 	error: 5000,
		// 	message: 'Tạm thời hệ thống đang khóa chức năng này'
		// });
		UserService.update(user._id, name, class_name, birthday, (err, reply) => {
			if(err) {
				logger.error(err);
				return res.json({
					error: 1000,
					message: 'Hệ thống đang bận, bạn hãy thử lại sau'
				});
			} else {
				if (reply.ok) {
					req.tndata.user.name = name;
					req.tndata.user.class_name = class_name;
					req.tndata.user.birthday = birthday;
				}
				return res.json({
					error: 0,
					message: 'done'
				});
			}
		});
	} else {
		res.json({
			error: 1,
			message: msg
		});
	}
});

/* Mật khẩu */
router.get('/mat-khau', auth.checkAuthor, function(req, res) {
	try{
		res.render('password',{layout:'layout-profile', title: 'Đổi mật khẩu cá nhân - Trạng Nguyên'});
	}
	catch(e){
		logger.error(e.stack);
	}
});

const validatePassword = (old_password, new_password, re_password) => {
	if(old_password === ''){
		return 'Hãy nhập mật khẩu cũ';
	} else if(old_password.length < 6 || old_password.length > 30){
		return 'Mật khẩu phải từ 6 đến 30 ký tự';
	}

	if(new_password === ''){
		return 'Hãy nhập mật khẩu';
	} else if(new_password.length < 6 || new_password.length>30){
		return 'Mật khẩu mới phải từ 6 đến 30 ký tự';
	}
	if(re_password === ''){
		return 'Hãy nhập nhập lại mật khẩu';
	}
	else if(new_password !== re_password){
		return 'Mật khẩu mới và nhập lại mật khẩu không trùng khớp';
	} else if(re_password.length < 6 || re_password.length>30){
		return 'Nhập lại mật khẩu phải từ 6 đến 30 ký tự';
	}

	return '';
};

router.post('/mat-khau', auth.checkAuthor, (req, res) => {
	const user = req.tndata.user;
	const body = req.body;
	const old_password = body.old_password;
	const new_password = body.new_password;
	const re_password = body.re_password;
	const msg = validatePassword(old_password, new_password, re_password);
	if (msg === '') {
		UserService.getPassword(user._id, (err, info) => {
			if(err) {
				return res.json({
					error: 1000,
					message: 'Có sự cố'
				});
			} else {
				if(info) {
					if(info.password === util.sha256(old_password)) {
						UserService.updatePassword(user._id, util.sha256(new_password), (err, result) => {
							if(err) {
								return res.json({
									error: 3,
									message: 'Có sự cố'
								});
							} else {
								return res.json({
									error: 0,
									message: 'Update thành công'
								});
							}
						});
					} else {
						return res.json({
							error: 4,
							message: 'Mật khẩu cũ không đúng'
						});
					}
				} else {
					return res.json({
						error: 2,
						message: 'tài khoản không tồn tại'
					});
				}
			}
		});
	} else {
		res.json({
			error: 1,
			message: msg
		});
	}
});

/* email */
router.get('/email', auth.checkAuthor, function(req, res) {
	try{
		res.render('email',{layout:'layout-profile', title: 'Emails - Trạng Nguyên'});
	}
	catch(e){
		logger.error(e.stack);
	}
});

router.post('/email', auth.checkAuthor, (req, res) => {
	const user = req.tndata.user;
	const body = req.body;
	const old_password = body.old_password;
	const new_password = body.new_password;
	const re_password = body.re_password;
	const msg = validatePassword(old_password, new_password, re_password);
	if (msg === '') {
		UserService.getPassword(user._id, (err, info) => {
			if(err) {
				return res.json({
					error: 1000,
					message: 'Có sự cố'
				});
			} else {
				if(info) {
					if(info.password === util.sha256(old_password)) {
						UserService.updatePassword(user._id, util.sha256(new_password), (err, result) => {
							if(err) {
								return res.json({
									error: 3,
									message: 'Có sự cố'
								});
							} else {
								return res.json({
									error: 0,
									message: 'Update thành công'
								});
							}
						});
					} else {
						return res.json({
							error: 4,
							message: 'Mật khẩu cũ không đúng'
						});
					}
				} else {
					return res.json({
						error: 2,
						message: 'tài khoản không tồn tại'
					});
				}
			}
		});
	} else {
		res.json({
			error: 1,
			message: msg
		});
	}
});

module.exports = router;