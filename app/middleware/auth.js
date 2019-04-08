/**
 * Created by tanmv on 09/07/2017.
 */
'use strict';
const fs = require('fs'),
	jwt = require('jsonwebtoken');

//openssl genrsa -out private.key 2048
let cert = fs.readFileSync(__dirname + '/../../config/private.key');

module.exports = {
	sign: (data) => {
		return jwt.sign(data, cert, {
			expiresIn: '1d',
			// algorithm: 'RS256'
		});
	},
	verify: (token) => {
		return jwt.verify(token, cert, {});
		// jwt.verify(token, cert, {}, (err, decoded) => {
		// 	console.log(err, decoded);
		// });
	},
	checkAuthor: function (req, res, next){
		let user = req.tndata.user;
		if(user){
			next();
		}
		else{
			let method = req.method;
			if(method=='GET'){
				res.redirect('/dang-nhap?back=' + encodeURI(req.originalUrl));
			}
			else{
				res.json({
					error: 401,
					message: 'Bạn phải đăng nhập'
				});
			}
		}
	},
	checkAuthorJs: function (req, res, next){
		let token = req.cookies['token'] || req.body.token || req.param('token') || req.headers['x-access-token'];
		jwt.verify(token, cert, {}, (err, info)=>{
			if(info){
				res.locals.user = info._doc;
				req.user = info._doc;
				next();
			}
			else{
				if(req.method == 'GET'){
					res.status(401).render('401');
				}
				else{
					res.json({
						error: -1,
						message: 'not login'
					});
				}
			}
		});
	}
};