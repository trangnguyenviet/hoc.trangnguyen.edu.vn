'use strict';

const colors = require('colors'),
	logger = require('tracer').colorConsole(),
	// util = require('../helpers/util'),
	config = require('../config');

class GameRoom{
	constructor(redis){
		this.redis = redis;
		this.rooms = {};
	}

	join(info){
		let rooms = this.rooms;
		let room_id = info.room;
		let room_info = rooms[room_id];

		if(room_info){
			room_info.member++;
		}
		else{
			room_info = {
				_id: info.room,
				server: info.server,
				lobby: info.lobby,
				mode: info.mode,
				map: info.map,
				created_at: (new Date()).getTime()
			};
			room_info.member = 1;
			rooms[info.room] = room_info;
			console.log(colors.cyan('ROOMS:'), colors.green('new'), colors.yellow(room_id));
		}
	}

	out(room_id){
		let rooms = this.rooms;
		let room_info = rooms[room_id];

		if(room_info){
			room_info.member--;
			if(room_info.member==0){
				room_info.over_at = (new Date()).getTime();
				room_info.play_time = room_info.over_at - room_info.created_at;

				roomGameService.save(room_info, (err, newInfo)=>{
					if(err){
						logger.error(err, newInfo);
					}
					else{
						delete rooms[room_id];
					}
				});
			}
		}
		else{
			console.log(colors.cyan('ROOMS:'), colors.red('not exists: ' + room_id));
		}
	}
}

module.exports = GameRoom;