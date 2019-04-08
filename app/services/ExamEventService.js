/**
 * Created by tanmv on 10/07/2017.
 */
'use strict';

let ExamEvents = require ("../models/ExamEvents");

const key_info = 'exam_event_game_';

class Services {
	constructor(redis) {
		this.redis = redis;
	}

	info(type_id,class_id,callback){
		let self = this;
		let key = key_info + type_id + '_' + class_id;
		self.redis.get(key,(err,results) => {
			if(err){
				callback(err,results);
			}
			else{
				if(results){
					callback(null,JSON.parse(results));
				}
				else{
					get_data(type_id,class_id,(err,results) => {
						callback(err,results);
						if(results){
							self.redis.set(key,JSON.stringify(results));
							self.redis.pexpire(key,300000);//300s
						}
					});
				}
			}
		});

		function get_data(type_id,class_id, callback){
			ExamEvents.findOne({
				type_id: type_id,
				class_id: class_id
			})
			.select('_id game_id play time spq answers content')
			.exec(function(err,info){
				callback(err, info);
			});
		}
	}
}

module.exports = Services;