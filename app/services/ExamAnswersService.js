/**
 * Created by tanmv on 05/06/2017.
 */
'use strict';

let ExamAnswers = require ("../models/ExamAnswers");

class Services{
	constructor(redis){
		this.redis = redis;
	}

	info(id, callback){
		let self = this;
		let key = 'exam_answer_info_' + id;

		self.redis.get(key,(err,results) => {
			if(err){
				callback(err,null);
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
						}
					});
				}
			}
		});

		function get_data(id,callback){
			ExamAnswers.findOne({
				_id: id,
				active: true
			})
			.select('_id name class_id play time description answers content')
			.exec((err,info) => {
				callback(err, info);
			});
		}
	}

	getListAll(class_id, callback){
		let self = this;
		let key = 'exam_answer_list_' + class_id + '_0';

		self.redis.get(key,(err,results) => {
			if(err){
				callback(err,null);
			}
			else{
				if(results){
					callback(null,JSON.parse(results));
				}
				else{
					get_data(class_id, (err,results) => {
						callback(err,results);
						if(results){
							self.redis.set(key,JSON.stringify(results));
						}
					});
				}
			}
		});

		function get_data(class_id, callback){
			ExamAnswers.find({
				class_id: class_id,
				active: true
			})
				.select('_id name rewrite subject_rewrite thumb description created_at show_created')
				// .sort({sort:1})
				// .skip(page_size*page_index)
				// .limit(page_size)
				.exec((err,results) => {
					callback(err, results);
				});
		}
	}

	getListType(class_id, subject_id, callback){
		let self = this;
		let key = 'exam_answer_list_' + class_id + '_' + subject_id;

		self.redis.get(key,(err,results) => {
			if(err){
				callback(err,null);
			}
			else{
				if(results){
					callback(null,JSON.parse(results));
				}
				else{
					get_data(class_id, subject_id, (err,results) => {
						callback(err,results);
						if(results){
							self.redis.set(key,JSON.stringify(results));
						}
					});
				}
			}
		});

		function get_data(class_id, subject_id, callback){
			ExamAnswers.find({
				class_id: class_id,
				subject_id: subject_id,
				active: true
			})
			.select('_id name rewrite subject_rewrite thumb description created_at show_created')
			// .sort({sort:1})
			// .skip(page_size*page_index)
			// .limit(page_size)
			.exec((err,results) => {
				callback(err, results);
			});
		}
	}

	getList(class_id,page_size,page_index, callback){
		let self = this;
		let key = 'exam_answer_list_' + class_id + '_' + page_size + '_' + page_index;

		self.redis.get(key,(err,results) => {
			if(err){
				callback(err,null);
			}
			else{
				if(results){
					callback(null,JSON.parse(results));
				}
				else{
					get_data(class_id,page_size,page_index,(err,results) => {
						callback(err,results);
						if(results){
							self.redis.set(key,JSON.stringify(results));
						}
					});
				}
			}
		});

		function get_data(class_id,page_size,page_index,callback){
			ExamAnswers.find({
				class_id: class_id,
				active: true
			})
			.select('_id name rewrite created_at')
			// .sort({sort:1})
			.skip(page_size*page_index)
			.limit(page_size)
			.exec((err,results) => {
				callback(err, results);
			});
		}
	}

	countList(class_id, callback){
		let self = this;
		let key = 'exam_answer_count_list_' + class_id;

		self.redis.get(key,(err,results) => {
			if(err){
				callback(err,null);
			}
			else{
				if(results){
					callback(null,results);
				}
				else{
					get_data(class_id,(err,results) => {
						callback(err,results);
						if(results){
							self.redis.set(key,results);
						}
					});
				}
			}
		});

		function get_data(class_id, callback){
			ExamAnswers.count({
				class_id: class_id,
				active: true
			}, (err, iCount)=>{
				callback(err, iCount);
			});
		}
	}
}

module.exports = Services;