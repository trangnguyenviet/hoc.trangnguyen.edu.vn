/**
 * Created by tanmv on 07/07/2017.
 */
'use strict';
const logger = require('tracer').colorConsole(),
	async = require('async');
// let utilModule = require('util');
let express = require('express');
let router = express.Router();

router.get('/', function(req, res) {
	try{
		//title
		let param_render={
			layout:'layout',
			title: 'Trạng Nguyên - Học trực tuyến - Thi Trực Tiếp - Tiếng Việt, Olympic Toán - Tiếng Anh - Phát triển trí thông minh đa diện'
		};

		async.parallel([
			//load top score
			//class 1
			function(callback){
				UserService.topScoreClass(1,1,(err,data)=>{
					if(err){
						logger.error(err);
					}
					else{
						param_render.top_class_1 = data?data[0]:null;
					}
					callback(null, true);
				});
			},
			//class 2
			function(callback){
				UserService.topScoreClass(2,1,(err,data)=>{
					if(err){
						logger.error(err);
					}
					else{
						param_render.top_class_2 = data?data[0]:null;
					}
					callback(null, true);
				});
			},
			//class 3
			function(callback){
				UserService.topScoreClass(3,1,(err,data)=>{
					if(err){
						logger.error(err);
					}
					else{
						param_render.top_class_3 = data?data[0]:null;
					}
					callback(null, true);
				});
			},
			//class 4
			function(callback){
				UserService.topScoreClass(4,1,(err,data)=>{
					if(err){
						logger.error(err);
					}
					else{
						param_render.top_class_4 = data?data[0]:null;
					}
					callback(null, true);
				});
			},
			//class 5
			function(callback){
				UserService.topScoreClass(5,1,(err,data)=>{
					if(err){
						logger.error(err);
					}
					else{
						param_render.top_class_5 = data?data[0]:null;
					}
					callback(null, true);
				});
			},

			//count member
			function(callback){
				UserService.countMember((err,count)=>{
					if(err){
						logger.error(err);
					}
					else{
						param_render.count_member = count;
					}
					callback(err,count);
				});
			},

			//news
			function(callback) {
				//tin tức giáo dục
				NewsService.getListHome(2, 8, (err, list)=>{
					if(err){
						logger.error(err);
					}
					else{
						param_render.list_news_giaoduc = list;
					}
					callback(err, list);
				});
			},

			//provinces
			function(callback){
				ProvinceService.listAll((err, list)=>{
					if(err){
						logger.error(err);
					}
					else{
						param_render.provinces = list;
					}
					callback(err, list);
				});
			}
		],() => {
			res.render('index', param_render);
		});
	}
	catch(e){
		logger.error(e.stack);
	}
});

module.exports = router;