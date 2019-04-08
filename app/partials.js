/**
 * Created by tanmv on 19/05/2017.
 */
'use strict';
const fs = require('fs'),
	join = require('path').join;

module.exports = (app)=>{
	if(config.publish) app.enable('view cache');
	// app.set('layout', 'layout'); //set layout default
	let partials = {};
	let servicePath;
	switch(config.site_type){
		case 1:
			servicePath = join(__dirname, 'practice_views/includes/');
			break;
		case 2:
			servicePath = join(__dirname, 'answer_views/includes/');
			break;
		case 3:
			servicePath = join(__dirname, 'learn_views/includes/');
			break;
		default:
			servicePath = join(__dirname, 'views/includes/');
	}
	fs.readdirSync(servicePath)
		.filter(file => ~file.search(/^[^\.].*\.html/))
		.forEach(file =>{
			let path = file.split('.')[0];
			partials[path] = 'includes/' + path;
		});
	app.set('partials', partials);
};