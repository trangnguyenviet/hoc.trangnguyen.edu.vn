/**
 * Created by tanmv on 10/07/2017.
 */
'use strict';

let VideoTypes = require ("../models/VideoTypes");

class Services {
	constructor(redis) {
		this.redis = redis;
	}

	getAll(callback){
		let self = this;
		let key = 'category_video';
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
			VideoTypes.find({
				active: true
			})
			.select('_id name name_ko_dau')
			.sort({sort: 1})
			.exec((err, list)=>{
				callback(err, list);
			});
		}
	}
}

module.exports = Services;