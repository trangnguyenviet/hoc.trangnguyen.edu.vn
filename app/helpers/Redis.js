/**
 * Created by tanmv on 19/04/2017.
 */
'use strict';
let redis = require('redis').createClient;
module.exports = (conf, callback) => {
	let bFirst = true;
	let redis_client = redis(conf.port,conf.server,conf.options);
	redis_client.on("error", (err) => {
		if(callback) callback(err,null);
	});

	redis_client.on("connect", (err) => {
		if(bFirst && callback){
			callback(err,redis_client);
			bFirst = false;
		}
	});

	if(conf.monitor){
		let monitor_client = redis_client.duplicate();
		monitor_client.on("monitor", function (time, args, raw_reply) {
			console.log(colors.cyan('REDIS:'), colors.magenta(raw_reply));
		});
		monitor_client.monitor(function (err, res) {
			console.log("Entering monitoring mode.", err, res);
		});
	}
};