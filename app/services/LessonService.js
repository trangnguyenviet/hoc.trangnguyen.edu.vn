/**
 * Created by tanmv on 12/07/2017.
 */
'use strict';

let Lessons = require ("../models/Lessons");

const key_info = 'lesson_info_',
	key_list = 'list_lesson_',
	key_new = 'lesson_new_',
	key_count_list_other = 'count_lesson_other_';

class Services {
	constructor(redis) {
		this.redis = redis;
	}

	info(id, callback) {
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
							// self.redis.pexpire(key,600000);//600s
						}
					});
				}
			}
		});

		function get_data(id, callback){
			Lessons.findOne({
				_id: id,
				deleted: false
			})
			.select('_id name video_type url name_ko_dau thumb description content duration_view i_view i_like total_like')
			.exec(function(err,info){
				callback(err, info);
			});
		}
	}

	list(type_id,class_id,page_size,page_index,id,callback){
		let self = this;
		let key = key_list + type_id + '_' + class_id + '_' + page_size + '_' + page_index + '_' + id;
		self.redis.get(key,(err,results) => {
			if(err){
				callback(err,results);
			}
			else{
				if(results){
					callback(null,JSON.parse(results));
				}
				else{
					get_data(type_id,class_id,page_size,page_index,id,(err,results) => {
						callback(err,results);
						if(results){
							self.redis.set(key,JSON.stringify(results));
							self.redis.pexpire(key,600000);//600s
						}
					});
				}
			}
		});

		function get_data(type_id,class_id,page_size,page_index,id,callback){
			Lessons.find({
				_id: {$ne: id},
				parent_id: type_id,
				class_id:class_id,
				deleted: false
			})
			.select('_id name name_ko_dau thumb description duration_view i_view')
			.sort({sort:1})
			.skip(page_size*page_index)
			.limit(page_size)
			.exec(function(err,list){
				callback(err, list);
			});
		}
	}

	getNew(type_id,class_id, callback){
		let self = this;
		let key = key_new + type_id + '_' + class_id;
		self.redis.get(key,(err,results) => {
			if(err){
				callback(err,results);
			}
			else{
				if(results){
					callback(null,JSON.parse(results));
				}
				else{
					get_data(type_id,class_id, (err,results) => {
						callback(err,results);
						if(results){
							self.redis.set(key,JSON.stringify(results));
							self.redis.pexpire(key,600000);//600s
						}
					});
				}
			}
		});

		function get_data(type_id,class_id, callback){
			Lessons.findOne({
				parent_id: type_id,
				class_id: class_id,
				deleted: false
			})
			.select('_id name video_type url name_ko_dau thumb description content duration_view i_view i_like total_like')
			.sort({sort:1})
			.exec(function(err,list){
				callback(err, list);
			});
		}
	}

	countListOther(type_id, class_id, callback){
		let self = this;
		let key = key_count_list_other + type_id + '_' + class_id;

		self.redis.get(key,function(err,results){
			if(err){
				callback(err,results);
			}
			else{
				if(results){
					if(callback) callback(null,results);
				}
				else{
					get_data(type_id,class_id,function(err,iCount){
						if(callback) callback(err,iCount);
						if(iCount){
							self.redis.set(key,iCount);
							self.redis.pexpire(key,300000);//300s
						}
					});
				}
			}
		});

		function get_data(type_id,class_id,callback){
			Lessons.count({
				parent_id: type_id,
				class_id:class_id,
				deleted: false
			},function(err,iCount){
				callback(err, iCount);
			});
		}
	}
}

module.exports = Services;