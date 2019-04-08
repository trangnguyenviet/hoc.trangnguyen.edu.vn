/**
 * Created by tanmv on 12/07/2017.
 */
'use strict';

let LessonTypes = require ("../models/LessonTypes");

const key_info = 'lesson_type_',
	key_list = 'lesson_type_list';

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
			LessonTypes.findOne({
				_id: id,
				active: true
			})
			.select('_id name name_ko_dau')
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
			LessonTypes.find({})
			.sort({sort: 1})
			.select('_id name name_ko_dau')
			.exec(function(err,list){
				callback(err, list);
			});
		}
	}
}
module.exports = Services;