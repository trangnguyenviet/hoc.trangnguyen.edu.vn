'use strict';

const async = require('async'),
	colors = require('colors'),
	logger = require('tracer').colorConsole(),
	config = require('../config');

let connect_key = config.redis_key.connect_ids;
// let position_key = config.redis_key.positions;

function ConnectMgr(redis){
	this.redis = redis;
	this.listTimeout = {};
}

ConnectMgr.prototype.clearConnect = function(callback) {
	let redis = this.redis;
	redis.del(connect_key,(err,reply)=>{
		if(callback && typeof(callback) === 'function') callback(err,reply);
	});
};

ConnectMgr.prototype.connect = function(socket_id, displayName, io, callback) {
	let self = this;
	if(displayName && displayName!=''){
		let redis = this.redis;

		redis.hmget(connect_key,displayName,(err,value)=>{
			if(err){
				logger.error(err);
			}
			else{
				if(value && value.length>0 && value[0]){
					callback(value[0]);
				}

				//save map displayName: connect_id
				redis.hmset(connect_key,[displayName, socket_id],(err,reply)=>{
					if(err){
						logger.error(err, reply);
					}
				});
			}
		});

		let list_friend, list_event;
		async.parallel([
			callback => {
				relationshipService.loadListByUser(displayName, (err, list)=> {
					if (err) {
						logger.error(err);
					}
					else {
						list_friend = list;
					}
					callback(err, list);
				});
			},
			callback => {
				redis.smembers('event:' + displayName, (err, list)=>{
					if (err) {
						logger.error(err);
					}
					else {
						list_event = list;
					}
					callback(err, list);
				});
			}
		],()=>{
			if(!list_friend) list_friend = [];
			if(list_event && list_event.length>0) list_friend = list_friend.concat(list_event.filter(item=>{
				return list_friend.indexOf(item) < 0;
			}));
			if(list_friend.length>0){
				let clients = io.sockets.clients().connected;
				async.eachSeries(list,(name,callback)=>{
					self.getConnect(name,(err,connect_id)=>{
						let sk = clients[connect_id];
						if(sk) sk.emit('update-status',{
							status: 'Online',
							DisplayName: displayName
						});
						logger.info('send status online:', displayName, '=>',name);
						callback(null, name);
					});
				});
			}
		});
	}
};

ConnectMgr.prototype.disconnect = function(socket_id, displayName, io) {
	if(displayName && displayName!=''){
		let redis = this.redis;
		redis.hmget(connect_key,displayName,(err,value)=>{
			if(err){
				logger.error(err);
			}
			else{
				if(value && value[0] == socket_id){
					redis.hdel(connect_key,displayName,(err,value)=>{
						if(err){
							logger.error(err, value);
						}
					});
				}
			}
		});

		relationshipService.loadListByUser(displayName,(err,list)=>{
			let self = this;
			if(err){
				logger.error(err);
			}
			else{
				if(list && list.length>0){
					let clients = io.sockets.clients().connected;
					async.eachSeries(list,(name,callback)=>{
						self.getConnect(name,(err,connect_id)=>{
							let sk = clients[connect_id];
							if(sk) sk.emit('update-status',{
								status: 'Offline',
								DisplayName: displayName
							});
							logger.info('send status offline:', displayName, '=>',name);
							callback(null, name);
						});
					});
				}
			}
		});
	}
};

ConnectMgr.prototype.getConnect = function(displayName, callback){
	if(displayName && displayName!=''){
		let redis = this.redis;
		redis.hmget(connect_key,displayName,(err,value)=>{
			callback(err,value);
		});
	}
	else{
		callback({error: 1, message: 'display name not null'}, null);
	}
};

ConnectMgr.prototype.getListConnect = function(list_display_name, callback){
	if(list_display_name && list_display_name.length>0){
		let redis = this.redis;
		redis.hmget(connect_key,list_display_name,(err,list_id)=>{
			callback(err,list_id);
		});
	}
	else callback({error: 1, message: 'display name not null'}, null);
};

ConnectMgr.prototype.clearPosition = function() {
	let self = this;
	self.redis.keys('*:position', function (err, keys) {
		if (err) {
			logger.error(err);
		}
		else{
			if(keys && keys.length>0){
				for(let i = 0, len = keys.length; i < len; i++) {
					self.redis.del(keys[i]);
				}
			}
		}
	});
};

ConnectMgr.prototype.UpdatePosition = function(DisplayName, msg){
	let redis = this.redis;
	redis.set(DisplayName+ ':position',JSON.stringify(msg),(err,reply)=>{
		if(err){
			logger.error(err,reply);
		}
	});
};

ConnectMgr.prototype.GetPosition = function(DisplayName, callback){
	let redis = this.redis;
	redis.get(DisplayName + ':position',(err,post_info)=>{
		if(callback && typeof(callback)==='function') callback(err, post_info);
	});

	// return this.positions[position];
};

// ConnectMgr.prototype.GetPositionList = function(position, callback){
// 	let redis = this.redis;
// 	let key = position_key + position;
// 	redis.smembers(key,(err,list_id)=>{
// 		if(callback && typeof(callback)==='function') callback(err, list_id);
// 	});

// 	// return this.positions[position];
// };

ConnectMgr.prototype.setTimeout = function(key, arg, callback, time){
	let listTimeout = this.listTimeout;
	let timer = listTimeout[key];
	if(timer){
		clearTimeout(timer);
	}
	if(time && callback){
		listTimeout[key] = setTimeout(function(){
			callback(arg);
			delete listTimeout[key];
		}, time);
	}
};

module.exports = ConnectMgr;