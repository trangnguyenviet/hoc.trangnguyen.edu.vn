/**
 * Created by tanmv on 08/07/2017.
 */
'use strict';

let Provinces = require ("../models/Provinces");

const key_info = 'province_info_',
	key_list = 'province';

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
			Provinces.findOne({
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
			Provinces.find({})
			.select('_id name')
			.exec(function(err,list){
				callback(err, list);
			});
		}
	}
}

module.exports = Services;