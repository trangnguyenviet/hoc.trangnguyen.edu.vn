/**
 * Created by tanmv on 10/07/2017.
 */
'use strict';

let ExamEventTypes = require ("../models/ExamEventTypes");

const key_info = 'exam_event_info_',
	key_list = 'exam_event_list';

class Services {
	constructor(redis) {
		this.redis = redis;
	}

	info(id, callback){
		let self = this;
		let key = key_info + id;
		self.redis.get(key,(err,results) => {
			if(err){
				callback(err,results);
			}
			else{
				if(results){
					callback(null,JSON.parse(results));
				}
				else{
					get_data(id,(err,results) => {
						callback(err,results);
						if(results){
							self.redis.set(key,JSON.stringify(results));
							self.redis.pexpire(key,300000);//300s
						}
					});
				}
			}
		});

		function get_data(id, callback){
			ExamEventTypes.findOne({
				_id: id,
				active: true
			})
			.select('_id name name_ko_dau active time_begin time_end type')
			.exec(function(err,info){
				callback(err, info);
			});
		}
	}

	getList(callback){
		let self = this;
		let key = key_list;
		self.redis.get(key,(err,results) => {
			if(err){
				callback(err,results);
			}
			else{
				if(results){
					callback(null,JSON.parse(results));
				}
				else{
					get_data((err,results) => {
						callback(err,results);
						if(results){
							self.redis.set(key,JSON.stringify(results));
							self.redis.pexpire(key,300000);//300s
						}
					});
				}
			}
		});

		function get_data(callback){
			ExamEventTypes.find({})
			.select('_id name name_ko_dau')
			.exec(function(err,list){
				callback(err, list);
			});
		}
	}
}
module.exports = Services;