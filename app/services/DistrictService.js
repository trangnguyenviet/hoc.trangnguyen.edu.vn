/**
 * Created by tanmv on 10/07/2017.
 */
'use strict';

let Districts = require ("../models/Districts");

const key_info = 'district_info_',
	key_list = 'district_';

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
							// self.redis.pexpire(key,300000);//300s
						}
					});
				}
			}
		});

		function get_data(id, callback){
			Districts.findOne({
				_id: id
			})
			.select('_id name')
			.exec(function(err,info){
				callback(err, info);
			});
		}
	}

	list(province_id, callback){
		let self = this;
		let key = key_list + province_id;
		self.redis.get(key,(err,results) => {
			if(err){
				callback(err,results);
			}
			else{
				if(results){
					callback(null,JSON.parse(results));
				}
				else{
					get_data(province_id,(err,results) => {
						callback(err,results);
						if(results){
							self.redis.set(key,JSON.stringify(results));
							// self.redis.pexpire(key,300000);//300s
						}
					});
				}
			}
		});

		function get_data(province_id,callback){
			Districts.find({
				province_id: province_id
			})
			.select('_id name')
			.exec(function(err,list){
				callback(err, list);
			});
		}
	}
}

module.exports = Services;