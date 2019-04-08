/**
 * Created by tanmv on 11/07/2017.
 */
'use strict';

let ExampleCode = require ("../models/ExampleCode");

// const key_info = 'exam_event_info_',
// 	key_list = 'exam_event_list';

class Services {
	constructor(redis) {
		this.redis = redis;
	}

	info(code, type, callback) {
		ExampleCode.findOne({
			_id: code,
			type: type,
			active: true
		})
		.select('school_id district_id district_id province_id begin_use end_use')
		.exec((err,info)=>{
			callback(err, info);
		});
	}
}

module.exports = Services;