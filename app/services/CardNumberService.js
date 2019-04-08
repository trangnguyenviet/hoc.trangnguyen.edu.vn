/**
 * Created by tanmv on 10/07/2017.
 */
'use strict';

let CardNumbers = require ("../models/CardNumbers");

class Services {
	constructor(redis) {
		this.redis = redis;
	}

	findOneAndUpdate(number, serial, user_id, callback){
		CardNumberModel.findOneAndUpdate({
			active: true,
			serial: serial,
			is_used: false,
			number: number
		},{
			$set:{
				is_used: true,
				used_at: new Date(),
				user_used: user_id
			}
		},{
			new: true,
			upsert: false
		})
		.select('day money')
		.exec((err,info)=>{
			callback(err, info);
		});
	}

}

module.exports = Services;