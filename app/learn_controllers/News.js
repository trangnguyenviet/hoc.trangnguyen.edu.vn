/**
 * Created by tanmv on 09/07/2017.
 */
'use strict';
let logger = require('tracer').colorConsole();
let async = require('async');
let express = require('express');
let router = express.Router();

const page_size = 20;

router.get('/', function(req, res) {
	let baseUrl = req.baseUrl;
	let page_index = util.parseInt(req.query.trang);
	let category = req.category;

	let param_render = {
		baseUrl: baseUrl,
		base_name: category.name
	};

	async.parallel([
		callback => {
			NewsService.list(category._id, page_size, page_index,(err, list)=>{
				if(err){
					logger.error(err);
				}
				else{
					param_render.list = list;
					callback(err, list);
				}
			});
		},
		callback => {
			NewsService.countList(category._id,(err, count)=>{
				if(err){
					logger.error(err);
				}
				else{
					if(count>0){
						param_render.page_html = util.GenPageHtml(count,page_size,page_index,'pagination','active',8);
					}
					callback(err, count);
				}
			});
		}
	],()=>{
		param_render.layout = 'layout';
		param_render.title = category.name + ' - Trạng Nguyên';
		res.render('news-list', param_render);
	});
});

router.get('/:rewrite.:id?', function(req, res) {
	let id = req.params.id;
	if(util.isOnlyNumber(id)){
		id = util.parseInt(id);

		let baseUrl = req.baseUrl;
		let category = req.category;

		let param_render = {
			baseUrl: baseUrl,
			base_name: category.name
		};

		async.waterfall([
			callback => {
				NewsService.info(id,(err, info)=>{
					if(err){
						logger.error(err);
					}
					else{
						if(info){
							param_render.info = info;
							callback(err, info);
						}
						else{
							return res.status(404).render('404');
						}
					}
				});
			},
			(data, callback) => {
				NewsService.countRead(id,(err, count)=>{
					if(err){
						logger.error(err);
					}
					else{
						if(count>0){
							param_render.icount = count;
						}
						callback(err, data);
					}
				});
			},
			(data, callback) => {
				NewsService.getListOther(category._id, id, (err, list)=>{
					if(err){
						logger.error(err);
					}
					else{
						param_render.others = list;
						callback(err, data);
					}
				});
			}
		],()=>{
			// res.json(param_render);
			param_render.layout = 'layout';
			param_render.title = param_render.info.name + ' - Trạng Nguyên';
			res.render('news-detail', param_render);
		});
	}
	else{
		res.status(404).render('404');
	}
});

module.exports = router;