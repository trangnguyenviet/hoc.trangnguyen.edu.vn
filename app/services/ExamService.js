/**
 * Created by tanmv on 11/07/2017.
 */
'use strict';

let Exams = require ("../models/Exams");

const key_info = 'exam_x_';

class Services {
	constructor(redis) {
		this.redis = redis;
	}

	info(type_id, class_id, round_id, test, callback){
		let self = this;
		let key = key_info + type_id + '_' + class_id  + '_' +  round_id  + '_' + test;
		self.redis.get(key,(err,results) => {
			if(err){
				callback(err,results);
			}
			else{
				if(results){
					callback(null,JSON.parse(results));
				}
				else{
					get_data(type_id, class_id, round_id, test,(err,results) => {
						callback(err,results);
						if(results){
							self.redis.set(key,JSON.stringify(results),'EX', 3600); //3600s
						}
					});
				}
			}
		});

		function get_data(type_id, class_id, round_id, test, callback){
			Exams.findOne({
				type_id: type_id,
				class_id: class_id,
				round_id: round_id,
				test: test
			})
				.select('_id play time game_id answers content')
				.exec(function(err,info){
					callback(err, info);
				});
		}
	}

	// info(type_id, class_id, round_id, test, callback){
	// 	let self = this;
	// 	let key = key_info + type_id + '_' + class_id  + '_' +  round_id  + '_' + test;
	// 	self.redis.hmget(key,['info'],(err,results) => {
	// 		if(err){
	// 			callback(err,results);
	// 		}
	// 		else{
	// 			if(results && results[0]){
	// 				callback(null,JSON.parse(results[0]));
	// 			}
	// 			else{
	// 				get_data(type_id, class_id, round_id, test,(err,results) => {
	// 					callback(err,results);
	// 					if(results){
	// 						self.redis.hmset(key,'info',JSON.stringify(results));
	// 					}
	// 				});
	// 			}
	// 		}
	// 	});
	//
	// 	function get_data(type_id, class_id, round_id, test, callback){
	// 		Exams.findOne({
	// 			type_id: type_id,
	// 			class_id: class_id,
	// 			round_id: round_id,
	// 			test: test
	// 		})
	// 		.select('_id play time game_id answers content')
	// 		.exec(function(err,info){
	// 			callback(err, info);
	// 		});
	// 	}
	// }

	// getGameId(type_id, class_id, round_id, test, callback){
	// 	let self = this;
	// 	let key = key_info + type_id + '_' + class_id  + '_' +  round_id  + '_' + test;
	// 	self.redis.hmget(key,['game_id'],(err,results) => {
	// 		if(err){
	// 			callback(err,results);
	// 		}
	// 		else{
	// 			if(results && results[0]){
	// 				callback(null,parseInt(results[0]));
	// 			}
	// 			else{
	// 				get_data(type_id, class_id, round_id, test,(err,results) => {
	// 					callback(err,results);
	// 					if(results){
	// 						self.redis.hmset(key,'game_id',results.game_id);
	// 					}
	// 				});
	// 			}
	// 		}
	// 	});
	//
	// 	function get_data(type_id, class_id, round_id, test, callback){
	// 		Exams.findOne({
	// 			type_id: type_id,
	// 			class_id: class_id,
	// 			round_id: round_id,
	// 			test: test
	// 		})
	// 		.select('game_id')
	// 		.exec(function(err,info){
	// 			callback(err, info);
	// 		});
	// 	}
	// }
}
module.exports = Services;