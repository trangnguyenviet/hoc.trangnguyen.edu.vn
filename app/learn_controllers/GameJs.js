/**
 * Created by tanmv on 26/07/2017.
 */
'use strict';
const CryptoJS = require("crypto-js");
let express = require('express');
let router = express.Router();

router.get('/examAnswers.min.js', function(req, res) {
	res.header('content-type','application/x-javascript; charset=utf-8');
	let id = util.parseInt(req.tndata.id);
	// let referer = req.header('Referer');
	delete req.tndata.id;
	if(id>0){
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

router.get('/web.min.js', function(req, res) {
	res.header('content-type','application/x-javascript; charset=utf-8');
	let id = util.parseInt(req.tndata.id);
	// let referer = req.header('Referer');
	delete req.tndata.id;
	if(id>0){
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
					res.render('game/web', response);
				}
				else{
					res.send('Alert("Không có thông tin bài thi");');
				}
			}
		});
	}
	else{
		res.render('game/web',{
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