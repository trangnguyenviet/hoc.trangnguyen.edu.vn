'use strict';

const logger = require('tracer').colorConsole(),
	config = require('../config'),
	connect_key = config.redis_key.connect_ids;

module.exports = (redis)=>{
	let readCCU = (callback) => {
		redis.hlen(connect_key,(err, count)=>{
			callback(err, count);
		});
	};

	let saveCCU = () => {
		readCCU((err, count)=>{
			if(err){
				logger.error(err);
			}
			else{
				let date = new Date();
				concurrentUserService.save({
					date: date.getTime(),
					ccu: count
				},(err, new_info) => {
					if(err) logger.error(err, new_info);
				});
			}
		});
	};

	setTimeout(()=>{
		saveCCU();
	},15000);
	setInterval(()=>{
		saveCCU();
	},config.interval_save_ccu);
};