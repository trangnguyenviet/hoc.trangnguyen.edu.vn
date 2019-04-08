/**
 * Created by tanmv on 14/07/2017.
 */

'use strict';
const async = require('async'),
	logger = require('tracer').colorConsole();

let Scores = require ("../models/Scores");
let Users = require ("../models/Users");

const key_info = 'score_user_info_',
	key_list = 'score_list_',
	key_score_hash = 'score_user_';

class Services {
	constructor(redis) {
		this.redis = redis;
	}

	info(user_id, type_id, round_id, callback) {
		let self = this;
		let key = key_info + type_id + '_' + round_id + '_' + user_id;
		self.redis.get(key,(err,results) => {
			if(err){
				callback(err,results);
			}
			else{
				if(results){
					callback(null,JSON.parse(results));
				}
				else{
					get_data(user_id, type_id, round_id,(err,results) => {
						callback(err,results);
						if(results){
							self.redis.set(key,JSON.stringify(results));
							self.redis.pexpire(key,5000);//5s
						}
					});
				}
			}
		});

		function get_data(user_id, type_id, round_id, callback){
			Scores.findOne({
				user_id: user_id,
				type_id: type_id,
				round_id: round_id
			})
			.select('_id time score')
			.exec(function(err,info){
				callback(err, info);
			});
		}
	}

	getList(user_id, callback){
		let self = this;
		let key = key_list + user_id;
		self.redis.get(key,(err,results) => {
			if(err){
				callback(err,results);
			}
			else{
				if(results){
					callback(null,JSON.parse(results));
				}
				else{
					get_data(user_id, (err,results) => {
						callback(err,results);
						if(results){
							self.redis.set(key,JSON.stringify(results));
							self.redis.pexpire(key,30000);//30s
						}
					});
				}
			}
		});

		function get_data(user_id, callback){
			Scores.find({
				user_id: user_id
			})
			.select('type_id round_id score time luot created_at')
			.sort({type_id:1,round_id:1})
			.exec(function(err,list){
				callback(err, list);
			});
		}
	}

	getScoreCache(type_id, round_id, user_id, callback){
		let self = this;
		let key = key_score_hash + type_id + '_' + round_id + '_' + user_id;
		self.redis.hmget(key,['score_1','score_2','score_3'],(err,results) => {
			if(err){
				callback(err,null);
			}
			else{
				if(results[0] || results[1] || results[2]){
					callback(null,results)
				}
				else callback(null,null);
			}
		});
	}

	setInit(type_id, round_id, test, time, user_id, callback){
		let self = this;
		let key = key_score_hash + type_id + '_' + round_id + '_' + user_id;
		if(test==1){
			//clear data score
			self.redis.hkeys(key,(err,list_key) => {
				if(list_key && list_key.length>0){
					for(i=0;i<list_key.length;i++){
						let key = list_key[i];
						if(key!='luot'){
							redis.hdel(key_score_user,key);
						}
					}
				}
			});
			//HINCREBY score_user_<type_id>_<round>_<user_id> luot 1
			self.redis.hincrby(key,'luot',1);//tăng lượt thi của vòng
		}
		//HMSET score_user_<type_id>_<round>_<user_id> score_<test> 0 total_time_<test> <time_exam> wrong_<test> 0
		self.redis.hmset(key,
			'score_' + test, 0,
			'totaltime_' + test, time,
			'wrong_' + test, 0
		);
		callback(false,data);
	}

	update_for_user(user_id, type_id, callback_result){
		let data = {};
		async.parallel([
			(callback)=>{
				ScoreModel.aggregate([
					{
						$match:{user_id: user_id, type_id: type_id}
					},{
						$group:{
							_id:"$user_id",
							total_score:{$sum:"$score"},
							total_time:{$sum:"$time"}
						}
					}
				],(err,results)=>{
					if(err){
						logger.error(err);
					}
					else{
						data.total_score = results[0].total_score;
						data.total_time = results[0].total_time;
						callback(null, true);
					}
				});
			},
			(callback)=>{
				Scores.find({
					user_id: user_id,
					type_id: type_id
				})
				.select('round_id')
				.sort({round_id:-1})
				.limit(1)
				.exec((err, score_info)=>{
					if(err){
						logger.error(err);
					}
					else{
						if(score_info) data.max_round = score_info[0].round_id;
						else data.max_round = 0;
						callback(null, true);
					}
				});
			}
		], ()=>{
			let set_data={};
			set_data["total_score_"+type_id] = data.total_score;
			set_data["total_time_"+type_id] = data.total_time;
			set_data["current_round_"+type_id] = data.max_round;

			Users.update({
				_id: user_id
			},{
				$set: set_data
			},{
				multi: false,
				upsert: false
			},(err, reply)=>{
				if(err){
					logger.error(err, reply);
				}
				else{
					callback_result(err, data);
				}
			});
		});
	}

	// updateRank(province_id, district_id, school_id, type_id, round_id, class_id, user_id, code,callback_result){
	// 	let isFree = type_id!=4;
	// 	let self = this;
	// 	let key_score_user = key_score_hash + type_id + '_' + round_id + '_' + user_id;
	// 	self.redis.hmget(key_score_user,['score_1','score_2','score_3','luot','totaltime_1','totaltime_2','totaltime_3'],function(err,results){
	// 		if(err) {
	// 			if(callback) callback(err,null);
	// 		}
	// 		else{
	// 			//total score this round
	// 			let total_score = parseInt(results[0]) + parseInt(results[1]) + parseInt(results[2]);
	// 			let total_time= parseInt(results[4]) + parseInt(results[5]) + parseInt(results[6]);
	// 			let luot = results[3]?parseInt(results[3]):1;
	//
	// 			if(total_score > 300) total_score = 1;
	//
	// 			async.waterfall([
	// 					function(callback){
	// 						if(total_score>=150 || total_score==1 || (code && code!='')){
	// 							//save score user
	// 							self.GetScoreInfo(user_id,type_id,round_id,function(err,score_info){
	// 								if(err){
	// 									logger.error(err);
	// 									callback(err,null);
	// 								}
	// 								else{
	// 									if(!score_info){
	// 										if(isFree){
	// 											callback(null,{});
	// 										}
	// 										else{
	// 											let scoreModel = new ScoreModel({
	// 												//alias: type_id + '-' + round_id + '-' + user_id,
	// 												user_id: user_id,
	// 												type_id: type_id,
	// 												round_id: round_id,
	// 												score: total_score,
	// 												time: total_time,
	// 												luot:luot,
	// 												code:code
	// 											});
	// 											scoreModel.save(function(err,info){
	// 												if(err){
	// 													logger.error(err);
	// 												}
	// 												else{
	// 													let score_rank = 0;
	// 													// let time_rank = 0;
	// 													let key_rank_type = utilModule.format(config.redis_key.rank.type, type_id);
	// 													//self.redis.zscore(key_rank_type,user_id,function(err,sum_score){
	// 													//ScoreModel.db.db.eval("update_scores("+user_id+","+type_id+")",function(err,sum_score_info){
	// 													update_scores(user_id, type_id, (err,sum_score_info)=>{
	// 														//console.log(err,sum_score_info); => { total_score: 300, total_time: 50, max_round: 1 }
	// 														if(err) logger.error(err);
	// 														else{
	// 															// if(sum_score_info){
	// 															// 	score_rank = Math.floor(sum_score);
	// 															// 	time_rank = 1/(sum_score-score_rank);
	// 															// }
	// 															// score_rank+= (total_score+1/(total_time+time_rank));
	// 															if(sum_score_info){
	// 																score_rank+= sum_score_info.total_score+1/sum_score_info.total_time;
	//
	// 																//rank type
	// 																self.redis.zadd(key_rank_type,score_rank,user_id);
	//
	// 																//rank province
	// 																let key_rank_province = utilModule.format(config.redis_key.rank.province,type_id,province_id);
	// 																self.redis.zadd(key_rank_province,score_rank,user_id);
	//
	// 																//rank district
	// 																let key_rank_district = utilModule.format(config.redis_key.rank.district,type_id,district_id);
	// 																self.redis.zadd(key_rank_district,score_rank,user_id);
	//
	// 																//rank school
	// 																let key_rank_school = utilModule.format(config.redis_key.rank.school,type_id,school_id);
	// 																self.redis.zadd(key_rank_school,score_rank,user_id);
	//
	// 																//rank class
	// 																let key_rank_class = utilModule.format(config.redis_key.rank.xclass,type_id,class_id);
	// 																self.redis.zadd(key_rank_class,score_rank,user_id);
	// 															}
	// 															else{
	// 																//
	// 															}
	// 														}
	// 													});
	// 												}
	// 												callback(err,info);
	// 											});
	// 										}
	// 									}
	// 									else{
	// 										callback(true,null);
	// 									}
	// 								}
	// 							});
	// 						}
	// 						else{
	// 							//clear data score in cache
	// 							self.redis.hkeys(key_score_user,function(err,list_key){
	// 								if(list_key && list_key.length>0){
	// 									for(i=0;i<list_key.length;i++){
	// 										let key = list_key[i];
	// 										if(key!='luot'){
	// 											self.redis.hdel(key_score_user,key);
	// 										}
	// 									}
	// 								}
	// 							});
	// 							callback(true,null);
	// 						}
	// 					},
	// 					function(data,callback){
	// 						if(!isFree){
	// 							//del info round pre
	// 							let key = utilModule.format(config.redis_key.score_user.score_info,type_id,round_id-1,user_id);
	// 							self.redis.del(key);
	//
	// 							key = utilModule.format(config.redis_key.score_user.score_info,type_id,round_id,user_id);
	// 							let info = {
	// 								_id: data._id,
	// 								time: data.time,
	// 								score: data.score
	// 							};
	// 							self.redis.set(key,JSON.stringify(info));
	// 							self.redis.pexpire(key,5000);
	// 						}
	// 						callback(null,null);
	// 					}
	// 				],
	// 				function(){
	// 					if(callback_result){
	// 						callback_result(null,{
	// 							type_id: type_id,
	// 							round_id: round_id,
	// 							luot: results[3],
	// 							total_score: total_score,
	// 							total_time: total_time,
	// 							round_info: [
	// 								{
	// 									score: results[0],
	// 									total_time: results[4]
	// 								},
	// 								{
	// 									score: results[1],
	// 									total_time: results[5]
	// 								},
	// 								{
	// 									score: results[2],
	// 									total_time: results[6]
	// 								},
	// 							]
	// 						});
	// 					}
	// 					else{
	// 						logger.debug('no callback');
	// 					}
	// 					self.UpdateCurrentRound(user_id,type_id)
	// 				});
	// 		}
	// 	});
	// }
}

module.exports = Services;