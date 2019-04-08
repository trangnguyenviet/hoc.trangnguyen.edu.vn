/**
 * Created by tanmv on 19/05/2017.
 */
'use strict';
// const util = require('./helpers/util'),
// 	logger = require('tracer').colorConsole();

module.exports = (app)=>{
	// app.use('/dang-nhap', require('./controllers/LoginController'));
	// app.use('/dang-ky', require('./controllers/RegisterController'));
	// app.use('/logout', require('./controllers/LogoutController'));
	if(config.site_type==1){
		//luyện tập
	}else if(config.site_type==2){
		//Bài giải
	}else if(config.site_type==3){
		//Luyện + bài giải
		// app.use('/lop-:c',(req,res,next)=>{
		// 	let class_id = util.parseInt(req.params.c,-1);
		// 	if(class_id>=0 && class_id <=5){
		// 		req.class_id = req.params.c;
		// 		next();
		// 	}
		// 	else{
		// 		res.status(404).render('404');
		// 	}
		// });
		// app.use('/lop-:c', require('./learn_controllers/ExamAnswer'));
		// app.use('/game', require('./learn_controllers/GameJs'));

		app.use('/dang-nhap', require('./learn_controllers/Login'));
		app.use('/dang-ky', require('./learn_controllers/Register'));
		app.use('/logout', require('./learn_controllers/Logout'));
		app.use('/luyen-tap', require('./learn_controllers/Practice'));
		app.use('/bai-giai', require('./learn_controllers/Answer'));
		// app.use('/game', require('./learn_controllers/GameJs'));
		app.use('/user', require('./learn_controllers/User'));
		app.use('/nop-hoc-phi', require('./learn_controllers/Payment'));
		app.use('/ca-nhan', require('./learn_controllers/Profile'));
		app.use('/', require('./learn_controllers/Home'));
	}else{
		//default site
		app.use('/latex', require('./controllers/LatexController'));
		app.use('/avatar', require('./controllers/AvatarController'));
		app.use('/captcha.png', require('./controllers/CaptchaController'));
		app.use('/video', require('./controllers/VideoController'));

		// //news controller
		// if(categorys && categorys.length>0){
		// 	let NewsControler = require('./controllers/NewsControler');
		// 	categorys.forEach(category=>{
		// 		let path = '/' + category.name_ko_dau;
		//
		// 		app.use(path, (req,res,next)=>{
		// 			req.category = category;
		// 			next();
		// 		});
		//
		// 		app.use(path, NewsControler);
		// 	});
		// }
		// //end news controller

		// app.get('/script.js', (req,res)=>{
		// 	res.header('content-type','application/x-javascript; charset=utf-8').render('game/web',{});
		// });

		app.use('/luyen-tap', require('./controllers/PracticeController'));
		app.use('/bang-vang', require('./controllers/BangVangController'));
		app.use('/', require('./controllers/IndexController'));
	}

	//news controller
	if(categorys && categorys.length>0){
		let NewsControler = require('./learn_controllers/News');
		categorys.forEach(category=>{
			let path = '/' + category.name_ko_dau;
			app.use(path, (req,res,next)=>{
				req.category = category;
				next();
			});
			app.use(path, NewsControler);
		});
	}

	app.use('/danh-muc-tin', require('./learn_controllers/Categorys'));
	//end news controller

	// catch 404 and forward to error handler
	app.use((req, res) => {
		let err = new Error('Not Found');
		err.status = 404;
		res.status(404);
		try {
			res.render('404');
		}
		catch (e) {
			console.log(e);
		}
	});

	// error handler
	app.use((err, req, res) => {
		res.locals.message = err.message;
		res.locals.error = req.app.get('env') === 'development' ? err : {};

		// render the error page
		res.status(err.status || 500);
		res.render('500');
	});
};