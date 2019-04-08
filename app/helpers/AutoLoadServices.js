/**
 * Created by tanmv on 20/04/2017.
 */
'use strict';
const fs = require('fs'),
	logger = require('tracer').colorConsole(),
	join = require('path').join;

module.exports = (redis) => {
	let servicePath = join(__dirname, '../services');
	fs.readdirSync(servicePath)
		.filter(file => ~file.search(/^[^\.].*\.js$/))
		.forEach(file =>{
			try{
				let module = file.split('.')[0];
				// module = module.replaceAt(0, module.charAt(0).toLowerCase());
				let Service = require(join(servicePath, file));
				global[module] = new Service(redis);
			}
			catch (e){
				logger.error(file, e);
				process.exit(1);
			}
		});
};

// String.prototype.replaceAt=function(index, replacement) {
// 	return this.substr(0, index) + replacement+ this.substr(index + replacement.length);
// };