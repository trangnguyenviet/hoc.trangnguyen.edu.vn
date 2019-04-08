/**
 * Created by tanmv on 19/04/2017.
 */
'use strict';

// let UsersData = require ("mongoose").model('users');
let Users = require ("../models/Users");

class Services{
	constructor(redis){
		this.redis = redis;
	}

	info(username, callback){

	}

	infoByEmail(email, callback){
		Users.findOne({
			email
		}).select('_id username name avatar birthday class_id class_name province_name district_name school_name birthday')
			.exec((err,info)=>{
				callback(err, info);
			});
	}

	login(username, password, callback){
		Users.findOne({
			username, password
		})
		.select('_id username name banned avatar province_id province_name district_id district_name school_id school_name class_id class_name birthday marks')
		.exec((err,info)=>{
			callback(err, info);
		});
	}

	infoByFecebookId(username, callback){

	}

	infoByGoogleId(username, callback){

	}

	checkVip(_id, callback){
		Users.findOne({
			_id
		})
		.select('_id vip_expire')
		.exec((err,info)=>{
			callback(err, info);
		});
	}

	topScoreClass(class_id, top, callback){
		let self = this;
		let key = 'top_score-' + class_id + '-' + top;

		self.redis.get(key,(err,results) => {
			if(err){
				callback(err,results);
			}
			else{
				if(results){
					callback(null,JSON.parse(results));
				}
				else{
					get_data(class_id, top, (err,results) => {
						callback(err,results);
						if(results){
							self.redis.set(key,JSON.stringify(results));
							self.redis.pexpire(key,600000);//600s
						}
					});
				}
			}
		});

		function get_data(class_id, top, callback){
			Users.find({
				class_id: class_id,
				deleted: false
			})
			.select('_id name birthday class_id class_name province_name district_name school_name birthday')
			.sort({total_score_4:-1,total_time_4:1,current_round_4:1})
			.limit(top)
			.exec((err,results) => {
				callback(err, results);
			});
		}
	}

	checkMask(_id, mask, callback){
		Users.count({
			_id,
			masks: mask
		}, (err, count)=>{
			callback(err, count);
		})
	}

	addMark(_id, mark, callback){
		Users.update({ _id }, { $push: { marks: mark }}, (err, reply)=>{
			callback(err, reply);
		});
	}

	countMember(callback){
		let self = this;
		let key = config.redis_key.count_member;
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
							// self.redis.pexpire(key,600000);//600s
						}
					});
				}
			}
		});

		function get_data(callback){
			Users.count({},function(err,count){
				callback(err,count);
			});
		}
	}

	update(_id, name, class_name, birthday, callback) {
		Users.update({ _id }, {
			$set: {
				name,
				class_name,
				birthday
			}
		}, (err, reply)=>{
			callback(err, reply);
		});
	}

	getPassword(_id, callback) {
		Users.findOne({
			_id,
			deleted: false
		})
		.select('password')
		.exec((err,results) => {
			callback(err, results);
		});
	}

	updatePassword(_id, password, callback) {
		Users.update({ _id }, {
			$set: {
				password
			}
		}, (err, reply)=>{
			callback(err, reply);
		});
	}

}

module.exports = Services;