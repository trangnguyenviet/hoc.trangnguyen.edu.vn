'use strict';

module.exports = (name, socket_id)=>{
	userActiveService.check(name,(err,result)=>{
		if(!result){
			userActiveService.add(name, socket_id);
		}
	})
};