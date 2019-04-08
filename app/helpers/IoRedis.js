/**
 * Created by tanmv on 14/04/2017.
 */
'use strict';
const Redis = require('ioredis');

let list_redis = [];

module.exports = (conf, callback) => {
	let connect_type = conf.connect;
	let redis;
	let bFirst = true;
	if(connect_type === 'default') {
		redis = new Redis(conf.default);
	} else if(connect_type === 'sentinel') {
		redis = new Redis(conf.sentinel);
	} else if(connect_type === 'cluster') {
		redis = new Redis(conf.cluster);
	} else{
		callback('not support connect this type',null);
		return;
	}

	if(conf.monitor) {
		redis.monitor((err, monitor) => {
			monitor.on('monitor', (time, args, source, database) => {
				console.log(time, args, source, database);
			});
		});
	}

	redis.on('connect', () => {
		console.log('redis connect ok');
		if(bFirst){
			callback(null, redis);
			bFirst = false;
			list_redis.push(redis);
		}
	});

	redis.on('error', (error) => {
		console.error('redis connect error', error);
	});

	redis.on('close',() => {
		console.log('redis close');
	});

	redis.on('reconnecting', () => {
		console.log('redis reconnecting');
	});

	process.on('SIGINT', () => {
		if(list_redis.length) {
			list_redis.forEach(redis => {
				try{
					// redis.quit();
					redis.disconnect();
				} catch (e) {
					console.error(e);
				}
			});
		}
	});
};