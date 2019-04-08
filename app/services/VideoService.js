/**
 * Created by tanmv on 10/07/2017.
 */
'use strict';

let Videos = require ("../models/Videos");

const key_info = 'video_info_',
	key_list = 'list_video_',
	key_list_all = 'list_all_video_',
	key_count_list = 'count_list_video_',
	key_count_all = 'count_all_video';

class Services {
	constructor(redis) {
		this.redis = redis;
	}

	info(id,callback){
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
			Videos.findOne({
				_id: id,
				active: true,
				deleted: false
			})
			.select('_id name name_ko_dau video_type url thumb description content tags')
			.exec(function(err,info){
				callback(err, info);
			});
		}
	}

	getList(parent_id,page_size,page_index,callback){
		let self = this;
		let key = key_list + parent_id + '_' + page_size + '_' + page_index;
		self.redis.get(key,(err,results) => {
			if(err){
				callback(err,results);
			}
			else{
				if(results){
					callback(null,JSON.parse(results));
				}
				else{
					get_data(parent_id,page_size,page_index,(err,results) => {
						callback(err,results);
						if(results){
							self.redis.set(key,JSON.stringify(results));
							self.redis.pexpire(key,300000);//300s
						}
					});
				}
			}
		});

		function get_data(parent_id,page_size,page_index,callback){
			Videos.find({
				parent_id: parent_id,
				active: true,
				deleted: false
			})
			.select('_id name name_ko_dau thumb')
			.sort({sort:1})
			.skip(page_size*page_index)
			.limit(page_size)
			.exec(function(err,list){
				callback(err, list);
			});
		}
	}

	listAllType(page_size,page_index,callback){
		let self = this;
		let key = key_list_all + page_size + '_' + page_index;
		self.redis.get(key,function(err,results){
			if(err){
				callback(err,results);
			}
			else{
				if(results){
					if(callback) callback(null,JSON.parse(results));
				}
				else{
					get_data(page_size,page_index,(err,results) => {
						callback(err,results);
						if(results){
							self.redis.set(key,JSON.stringify(results));
							self.redis.pexpire(key,300000);//300s
						}
					});
				}
			}
		});

		function get_data(page_size,page_index,callback){
			Videos.find({
				// parent_id: parent_id,
				active: true,
				deleted: false
			})
			.select('_id name name_ko_dau thumb')
			.sort({sort:1})
			.skip(page_size*page_index)
			.limit(page_size)
			.exec(function(err,list){
				callback(err, list);
			});
		}
	}

	listRandom(page_size,skip,callback){
		Videos.find({
			active: true,
			deleted: false
		})
		.select('_id name name_ko_dau thumb')
		.sort({sort:1})
		.skip(skip)
		.limit(page_size)
		.exec(function(err,list){
			callback(err, list);
		});
	}

	countList(parent_id,callback){
		let self = this;
		let key = key_count_list + parent_id;
		self.redis.get(key,(err,count) => {
			if(err){
				callback(err,count);
			}
			else{
				if(count){
					callback(null,count);
				}
				else{
					get_data(parent_id,(err,count) => {
						callback(err,count);
						if(count){
							self.redis.set(key,count);
							self.redis.pexpire(key,300000);//300s
						}
					});
				}
			}
		});

		function get_data(parent_id, callback){
			Videos.count({
				parent_id: parent_id,
				active: true,
				deleted: false
			},function(err,count){
				callback(err, count);
			});
		}
	}

	countAll(callback){
		let self = this;
		let key = key_count_all;
		self.redis.get(key,(err,count) => {
			if(err){
				callback(err,count);
			}
			else{
				if(count){
					callback(null,count);
				}
				else{
					get_data((err,count) => {
						callback(err,count);
						if(count){
							self.redis.set(key,count);
							self.redis.pexpire(key,300000);//300s
						}
					});
				}
			}
		});

		function get_data( callback){
			Videos.count({
				active: true,
				deleted: false
			},function(err,count){
				callback(err, count);
			});
		}
	}
}

module.exports = Services;