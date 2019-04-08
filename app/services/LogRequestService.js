/**
 * Created by tanmv on 12/07/2017.
 */
'use strict';

const logger = require('tracer').colorConsole();
let LogRequests = require ("../models/LogRequests");

class Services {
	constructor(redis) {
		// this.redis = redis;
	}

	log(user_id, url, method, ip, request, response){
		let logRequests = new LogRequests({
			user_id: user_id,
			url: url,
			method: method,
			ip: ip,
			request: request,
			response: response
		});

		logRequests.save((err, newInfo)=>{
			if(err) logger.error(err, newInfo);
		});
	}
}

module.exports = Services;