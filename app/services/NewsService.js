/**
 * Created by tanmv on 07/07/2017.
 */
'use strict';

let News = require ("../models/News");

const key_info = 'news_',
	key_list = 'list_news_',
	key_count_list = 'count_list_news_',
	key_count_read = 'count_read_news_',
	key_list_other = 'list_new_other_';

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
							self.redis.pexpire(key,600000);//600s
						}
					});
				}
			}
		});

		function get_data(id, callback){
			News.findOne({
				_id: id,
				deleted: false,
				active: true
			})
			.select('_id name parent_id parent_name description content created_at tags')
			.exec(function(err,info){
				callback(err, info);
			});
		}
	}

	list(category_id,page_size,page_index,callback){
		let self = this;
		let key = key_list + category_id + '_' + page_size + '_' + page_index;
		self.redis.get(key,(err,results) => {
			if(err){
				callback(err,results);
			}
			else{
				if(results){
					callback(null,JSON.parse(results));
				}
				else{
					get_data(category_id,page_size,page_index,(err,results) => {
						callback(err,results);
						if(results){
							self.redis.set(key,JSON.stringify(results));
							self.redis.pexpire(key,600000);//600s
						}
					});
				}
			}
		});

		function get_data(category_id,page_size,page_index,callback){
			News.find({
				deleted: false,
				active: true,
				parent_id:category_id
			})
			.select('_id name name_ko_dau description thumb created_at')
			.sort({sort:1})
			.skip(page_index*page_size)
			.limit(page_size)
			.exec(function(err,list){
				callback(err, list);
			});
		}
	}

	listRandom(category_id,page_size,skip,callback){
		News.find({
			deleted: false,
			active: true,
			parent_id:category_id
		})
		.select('_id name name_ko_dau thumb')
		.sort({sort:1})
		.skip(skip)
		.limit(page_size)
		.exec(function(err,list){
			callback(err, list);
		});
	}

	getListHome(category_id, limit, callback){
		let self = this;
		let key = key_list + category_id + '_home_' + limit;
		self.redis.get(key,(err,results) => {
			if(err){
				callback(err,results);
			}
			else{
				if(results){
					callback(null,JSON.parse(results));
				}
				else{
					get_data(category_id, limit, (err,results) => {
						callback(err,results);
						if(results){
							self.redis.set(key,JSON.stringify(results));
							self.redis.pexpire(key,600000);//600s
						}
					});
				}
			}
		});

		function get_data(category_id, limit, callback){
			News.find({
				deleted: false,
				active: true,
				parent_id: category_id
			})
			.select('_id name name_ko_dau')
			.sort({sort:1,created_at:-1})
			.skip(0).limit(limit)
			.exec(function(err,results){
				callback(err, results);
			});
		}
	}

	getListHomeImage(category_id, limit, callback){
		let self = this;
		let key = key_list + category_id + '_img_' + limit;
		self.redis.get(key,(err,results) => {
			if(err){
				callback(err,results);
			}
			else{
				if(results){
					callback(null,JSON.parse(results));
				}
				else{
					get_data(category_id, limit, (err,results) => {
						callback(err,results);
						if(results){
							self.redis.set(key,JSON.stringify(results));
							self.redis.pexpire(key,600000);//600s
						}
					});
				}
			}
		});

		function get_data(category_id, limit, callback){
			News.find({
				deleted: false,
				active: true,
				parent_id: category_id
			})
			.select('_id name name_ko_dau thumb description')
			.sort({sort:1,created_at:-1})
			.skip(0).limit(limit)
			.exec(function(err,results){
				callback(err, results);
			});
		}
	}

	getListNoPage(category_id, callback){
		let self = this;
		let key = key_list + category_id + '_$';
		self.redis.get(key,(err,results) => {
			if(err){
				callback(err,results);
			}
			else{
				if(results){
					callback(null,JSON.parse(results));
				}
				else{
					get_data(category_id, limit, (err,results) => {
						callback(err,results);
						if(results){
							self.redis.set(key,JSON.stringify(results));
							self.redis.pexpire(key,600000);//600s
						}
					});
				}
			}
		});

		function get_data(category_id, limit, callback){
			News.find({
				deleted: false,
				active: true,
				parent_id: category_id
			})
			.select('_id name name_ko_dau thumb description')
			.sort({sort:1,created_at:-1})
			.skip(0).limit(limit)
			.exec(function(err,results){
				callback(err, results);
			});
		}
	}

	getListOther(parent_id, id, callback){
		let self = this;
		let key = key_list_other + parent_id + '_' + id;
		self.redis.get(key,(err,results) => {
			if(err){
				callback(err,results);
			}
			else{
				if(results){
					callback(null,JSON.parse(results));
				}
				else{
					get_data(parent_id, id,(err,results) => {
						callback(err,results);
						if(results){
							self.redis.set(key,JSON.stringify(results));
							self.redis.pexpire(key,600000);//600s
						}
					});
				}
			}
		});

		function get_data(parent_id, id, callback){
			News.find({
				parent_id: parent_id,
				deleted: false,
				active: true,
				_id: {$ne: id}
			})
			.select('_id name name_ko_dau')
			.sort({sort:1,created_at:-1})
			// .skip(page_size*page_index)
			.limit(8)
			.exec((err,results) => {
				callback(err, results);
			});
		}
	}

	countList(category_id,callback){
		let self = this;
		let key = key_count_list + category_id;
		self.redis.get(key,(err,count) => {
			if(err){
				callback(err,count);
			}
			else{
				if(count){
					callback(null,count);
				}
				else{
					get_data(category_id,(err,count) => {
						callback(err,count);
						if(count){
							self.redis.set(key,count);
							self.redis.pexpire(key,600000);//600s
						}
					});
				}
			}
		});

		function get_data(category_id, callback){
			News.count({
				deleted: false,
				active: true,
				parent_id:category_id
			},function(err,count){
				callback(err, count);
			});
		}
	}

	countRead(id, callback){
		let key = key_count_read + id;
		this.redis.incr(key,(err,count) => {
			callback(err, count);
		});
	}
}

module.exports = Services;