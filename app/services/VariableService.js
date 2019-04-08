'use strict';

/**
 * Created by tanmv on 15/03/2017.
 */

// let ParamsData = require ("mongoose").model('params');
let Variables = require('../models/Variables');

class Services{
	constructor(redis){
		this.redis = redis;
	}

	loadData(callback){
		Variables.find({}).select('_id value').exec((err,list) => {
			if(err){
				callback(err,null);
			}
			else{
				if(list && list.length>0){
					let map={};
					for(let i=0;i<list.length;i++){
						let param_obj = list[i];
						let key = param_obj._id;
						map[key] = param_obj.value;
					}
					callback(null,map);
				}
				else callback(null,null);
			}
		});
	}
}

module.exports = Services;