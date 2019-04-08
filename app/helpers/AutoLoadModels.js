/**
 * Created by tanmv on 20/04/2017.
 */
'use strict';
const fs = require('fs'),
	logger = require('tracer').colorConsole(),
	join = require('path').join;

module.exports = () => {
	let modelpath = join(__dirname, '../models');
	require(join(modelpath, 'plugins/Counters'));
	try{
		fs.readdirSync(modelpath)
			.filter(file => ~file.search(/^[^\.].*\.js$/))
			.forEach(file => require(join(modelpath, file)));
	}
	catch (e){
		logger.error(e);
		process.exit(1);
	}
};