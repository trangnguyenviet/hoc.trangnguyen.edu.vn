/**
 * Created by tanmv on 16/07/2017.
 */
'use strict';

const async = require('async'),
	logger = require('tracer').colorConsole();
let UserExams = require ("../models/UserExams");

// const key_info = 'score_user_info_',
// 	key_list = 'score_list_',
// 	key_score_hash = 'score_user_';

class Services {
	constructor(redis) {
		this.redis = redis;
	}

	info(user_id, exam_id, callback){
		UserExams.find({
			user_id: user_id,
			exam_id: exam_id
		})
		.select('exam_id content answers play time round_id test')
		.sort({created_at: -1})
		.exec((err, info)=>{
			callback(err, info);
		});
	}

	add(user_id, exam_id, play_index,score,content,answers,play,time,round_id,test,class_id,total_time,wrong_count,client_submit,user_end_at, callback){
		let userExams = new UserExams({
			user_id: user_id,
			exam_id: exam_id,
			play_index: play_index,
			score: score,
			content: content,
			answers: answers,
			play: play,
			time: time,
			round_id: round_id,
			test: test,
			class_id: class_id,
			total_time: total_time,
			wrong_count: wrong_count,
			client_submit: client_submit,
			user_end_at: user_end_at
		});

		userExams.save((err, newInfo)=>{
			callback(err, newInfo);
		});
	}
}

module.exports = Services;