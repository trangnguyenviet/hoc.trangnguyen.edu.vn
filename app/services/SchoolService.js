/**
 * Created by tanmv on 14/07/2017.
 */
'use strict';

let Schools = require ("../models/Schools");

const key_info = 'school_info_',
	key_list = 'school_';

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
							self.redis.pexpire(key,6000000);//6000s
						}
					});
				}
			}
		});

		function get_data(id, callback){
			Schools.findOne({
				_id: id
			})
			.select('_id name')
			.exec(function(err,info){
				callback(err, info);
			});
		}
	}

	listAll(callback){
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
							self.redis.pexpire(key,6000000);//6000s
						}
					});
				}
			}
		});

		function get_data(callback){
			Schools.find({})
			.select('_id name')
			.exec(function(err,list){
				callback(err, list);
			});
		}
	}
}

module.exports = Services;