/**
 * Created by tanmv on 16/07/2017.
 */
'use strict';

const async = require('async'),
	logger = require('tracer').colorConsole();
let UserScoreEvents = require ("../models/UserScoreEvents");

const key_info = 'user_score_event_info_',
	key_list = 'user_score_event_list_',
	key_rank = 'user_score_event_rank_';

class Services {
	constructor(redis) {
		this.redis = redis;
	}

	info(user_id, event_id, callback){
		let self = this;
		let key = key_info + user_id + '_' + event_id;
		self.get(key, (err, result)=>{
			if(err) logger.error(err);
			else{
				if(result){
					callback(err, JSON.parse(result));
				}
				else{
					get_data(user_id, event_id, (err,result)=>{
						callback(err,result);
						if(result){
							self.redis.set(key, JSON.stringify(result));
							self.redis.pexpire(key, 60000); //60s
						}
					});
				}
			}
		});

		function get_data(user_id, event_id, callback){
			UserScoreEvents.findOne({
				use_id: user_id,
				event_id: event_id
			})
			.select('user_id event_id score time')
			.exec((err, result)=>{
				callback(err, result);
			});
		}
	}

	list(user_id, callback){
		let self = this;
		let key = key_list + user_id;
		self.get(key, (err, result)=>{
			if(err) logger.error(err);
			else{
				if(result){
					callback(err, JSON.parse(result));
				}
				else{
					get_data(user_id, (err,result)=>{
						callback(err,result);
						if(result){
							self.redis.set(key, JSON.stringify(result));
							self.redis.pexpire(key, 60000); //60s
						}
					});
				}
			}
		});

		function get_data(user_id, callback){
			UserScoreEvents.find({
				use_id: user_id
			})
			.sort({event_id: 1})
			.select('user_id event_id score time')
			.exec((err, result)=>{
				callback(err, result);
			});
		}
	}

	rank(event_id, callback){
		let self = this;
		let key = key_rank + event_id;
		self.get(key, (err, result)=>{
			if(err) logger.error(err);
			else{
				if(result){
					callback(err, JSON.parse(result));
				}
				else{
					get_data(event_id, (err,result)=>{
						callback(err,result);
						if(result){
							self.redis.set(key, JSON.stringify(result));
							self.redis.pexpire(key, 60000); //60s
						}
					});
				}
			}
		});

		function get_data(event_id, callback){
			UserScoreEvents.find({
				event_id: event_id
			})
			.sort({score: -1, time: 1})
			.select('user_id event_id score time')
			.exec((err, result)=>{
				callback(err, result);
			});
		}
	}

	add(user_id, event_id, score, time, callback){
		let userScoreEvents = new UserScoreEvents({
			user_id: user_id,
			event_id: event_id,
			score: score,
			time: time
		});

		userScoreEvents.save((err, newInfo)=>{
			callback(err, newInfo);
		});
	}
}

module.exports = Services;