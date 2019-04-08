/**
 * Created by tanmv on 09/07/2017.
 */
'use strict';

let Categorys = require ("../models/Categorys");

class Services {
	constructor(redis) {
		this.redis = redis;
	}

	getAll(callback){
		Categorys.find({
			active: true
		})
		.select('_id name name_ko_dau')
		.sort({sort:1})
		.exec((err, list)=>{
			callback(err, list);
		});
	}
}

module.exports = Services;