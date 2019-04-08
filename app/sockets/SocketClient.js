'use strict';

const async = require('async');
const util = require('../helpers/util');
const colors = require('colors');
const logger = require('tracer').colorConsole();
let UserActive = require('./UserActive');

function SocketClient(socket, ip, io, redis, user_name, cpuWork, RoomMgr, connectMgr){
	let last_api_login = new Date().getTime();
	const socket_id = socket.id;
	socket.interdepend = [];

	console.log(colors.cyan('Socket:'), 'new connect:', colors.yellow(socket_id), 'IP:', colors.yellow(ip), 'user:', colors.yellow(user_name));

	// let tTimeout = setTimeout(() => {
	// 	console.log(user_name, 'client not support!');
	// 	socket.emit('server-msg',{error: 6,message:'client not support!'});
	// 	socket.disconnect();
	// },10000);

	// let data_realy ={
	// 	ip: ip,
	// 	auth: 'MVTHP-2016',
	// 	version: '1.0.0.0',
	// 	build: '20160927'
	// };

	// socket.emit('server-ready',data_realy, (client_post) => {
	// 	console.log(client_post);
	// 	if(client_post){
	// 		clearTimeout(tTimeout);
			userService.info(user_name, (err, user_info) => {
				if(err){
					logger.error(err);
				}
				else{
					if(user_info){
						UserActive(user_name, socket_id);

						console.log(colors.cyan('Socket: '), 'user:',colors.yellow(user_name), 'DisplayName:', colors.yellow(user_info.DisplayName));
						if(user_info.DisplayName && user_info.DisplayName!=''){
							let DisplayName = user_info.DisplayName;

							connectMgr.connect(socket_id, DisplayName, io, (old_socket_id)=>{
								if(old_socket_id){
									console.log(colors.cyan('Socket: '), colors.red('Double connect'),'new IP:', colors.yellow(ip),colors.yellow(user_name), 'DisplayName:', colors.yellow(DisplayName));
									let clients = io.sockets.clients().connected;
									let client = clients[old_socket_id];
									if(client){
										client.emit('double-connect',{
											new_ip: ip
										});
										client.disconnect();
									}
								}
								// if(list_old_socket && list_old_socket.length>0){
								// 	console.log(colors.cyan('Socket: '), colors.red('Double connect'),'new IP:', colors.yellow(ip),colors.yellow(user_name), 'DisplayName:', colors.yellow(DisplayName));
								// 	let clients = io.sockets.clients().connected;
								// 	for(let i=0, sid; sid = list_old_socket[i]; i++){
								// 		let client = clients[sid];
								// 		if(client){
								// 			client.emit('double-connect',{
								// 				new_ip: ip
								// 			});
								// 			client.disconnect();
								// 		}
								// 	}
								// }
							});

							let user = {
								name: user_name,
								ip: ip,
								socket_id: socket_id,
								DisplayName: DisplayName,
								position: 'home',
								last_position_at: new Date(),
								location:{
									ip: ip,
									socket_id: socket_id,
									home: 0,
									inventory: 0,
									shop: 0,
									spin: 0,
									lobby_quick: 0,
									lobby_normal: 0,
									game: 0,
									total_online: 0,
									login_at: new Date()
								},
								game_mode:{}
							};
							socket.user = user;

							//default room new connect
							socket.join('home');

							socket.on('forward-message', (message , callback) => {
								console.log(colors.cyan('Socket: '), 'fw:',colors.green(message));
								let msg;
								if (message) {
									if(typeof message === 'string'){
										msg = util.parseJson(message);
									}
									else{
										msg = message;
									}
									if(msg){
										if(msg.to && msg.to!=''){
											if(typeof msg.to === 'string'){
												if(msg.message){
													findDisplayName(msg.to, connectMgr, io, (list_socket)=>{
														if(list_socket && list_socket.length>0){
															for(let i=0, client; client = list_socket[i]; i++){
																client.emit('forward-message',{
																	from: DisplayName,
																	message: msg.message
																});
																logger.info('fw ok!');
															}
															if(callback) callback({error: 0, message: 'done', count: list_socket.length});
														}
														else{
															if(callback) callback({error: 5, message: 'friend not online or not exists'});
														}
													});
												}
												else{
													if(callback) callback({error: 4, message: 'message not null'});
												}
											}
											else{
												if(callback) callback({error: 3, message: 'to friend must be string'});
											}
										}
										else{
											if(callback) callback({error: 2, message: 'to friend not null'});
										}
									}
									else{
										console.log(colors.cyan('Socket: '), 'fw:',colors.yellow(DisplayName),colors.green(message));
										if(callback) callback({error: 6, message: 'message not format json'});
									}
								}
								else{
									if(callback) callback({error: 1, message: 'message not null'});
								}
							});

							socket.on('update-position', (msg,callback) => {
								//ques_02 update position: {"position":"GAME","server":"s1","lobby":"l1","mode":"CSVR_GhostMode","map":"Map_Train","room":"d5e52109-d8fd-438d-8f99-ee87af2864cc"}
								//Sai1 update position: {"position":"GAME","server":"s1","lobby":"l1","mode":"CSVR_ZombieMode","map":"Map_Ngatu","room":"8b95b04d-1ea1-445f-aa3f-3603d84f45b1"}
								console.log(colors.cyan('Socket: '), 'update position:',colors.yellow(DisplayName),colors.green(msg));
								if (msg) {
									if(typeof msg === 'string'){
										msg = util.parseJson(msg);
									}
									if(msg && msg.position && msg.position!=''){
										if(typeof msg.position === 'string'){
											let new_post = msg.position.toLocaleLowerCase();
											let old_post = user.position;
											if(old_post!=new_post){
												let location = user.location;
												if(location[new_post]!=undefined){
													if(location[old_post]) location[old_post] = 0;
													let new_date = new Date();

													//calculator
													location[old_post]+=(new_date - user.last_position_at);

													//Game room log
													if(new_post == 'game'){
														user.game_mode.room_id = msg.room;
														RoomMgr.join(msg);
													}
													else{
														if(old_post == 'game'){
															RoomMgr.out(user.game_mode.room_id);
														}
													}

													//set new position
													user.last_position_at = new_date;
													user.position = new_post;

													//callback to client
													if(callback) callback({error: 0, message: 'done'});

													socket.join(new_post);
													socket.leave(old_post);

													//save position on cache
													connectMgr.UpdatePosition(DisplayName, msg);
												}
												else{
													if(callback) callback({error: 4, message: 'position not defined: ' + new_post});
													console.log(colors.cyan('Socket: '), colors.yellow(DisplayName),colors.red('position not defined'),colors.green(new_post));
												}
											}
											else{
												if(callback) callback({error: 0, message: 'done'});
											}
										}
										else{
											if(callback) callback({error: 3, message: 'position must be string'});
										}
									}
									else{
										if(callback) callback({error: 2, message: 'position not null'});
									}
								}
								else{
									if(callback) callback({error: 1, message: 'message not null'});
								}
							});

							socket.on('user-broadcast', (msg) => {
								console.log(colors.cyan('Socket: '), colors.yellow(DisplayName),'broadcast',colors.green(msg));
								if(typeof msg === 'string'){
									msg = util.parseJson(msg);
								}
								if (msg && msg.message && msg.message!='') {
									//socket.broadcast.emit('user-broadcast', {
									io.emit('user-broadcast', {
										error: 0,
										from: DisplayName,
										message: msg.message
									});
								}
								else{
									console.log(colors.cyan('Socket: '), colors.yellow(DisplayName),colors.red('message null'));
								}
							});

							socket.on('set-interdepend', (msg, callback) => {
								console.log(colors.cyan('Socket: '), colors.yellow(DisplayName),'interdepend',colors.green(msg));
								if(msg){
									if(typeof msg === 'string'){
										msg = util.parseJson(msg);
									}
									if(msg){
										if(msg.interdepend && typeof msg.interdepend === 'object' && msg.interdepend.length>0){
											socket.interdepend = msg.interdepend;
											if(callback) callback({error: 0, message: 'set list interdepend done'});
										}
										else{
											socket.interdepend = [];
											if(callback) callback({error: 0, message: 'remove list interdepend done'});
										}
									}
									else{
										if(callback) callback({error: 2, message: 'interdepend not null or empty'});
									}
								}
								else{
									if(callback) callback({error: 1, message: 'message not null'});
								}
							});

							socket.on('remove-interdepend', (msg, callback) => {
								console.log(colors.cyan('Socket: '), colors.yellow(DisplayName),'remove list interdepend',colors.green(msg));
								socket.interdepend = [];
								if(callback) callback({error: 0, message: 'remove list interdepend done'});
							});

							socket.on('watch-user', (msg, callback) => {
								console.log(colors.cyan('Socket: '), colors.yellow(DisplayName),'watch-user',colors.green(msg));
								if(msg){
									if(typeof msg === 'string'){
										msg = util.parseJson(msg);
									}
									if(msg){
										if(msg.users && Array.isArray(msg.users) && msg.users.length>0){
											//add list watch for self
											redis.sadd('watch:' + DisplayName, msg.users, (err, reply)=>{
												if(err){
													logger.error(err, reply);
													if(callback) callback({error: 1000, message: 'server busy'});
												}
												else{
													console.log(colors.cyan('Socket: '), colors.yellow(DisplayName),'save watch ok!');

													//add event for friend
													async.eachSeries(msg.users,(user, callback_user)=>{
														redis.sadd('event:' + user, DisplayName, (err, reply)=>{
															if(err){
																logger.error(err, reply);
															}
															callback_user(err, user);
														});
													});
													if(callback) callback({error: 0, message: 'done'});
												}
											});
										}
										else{
											if(callback) callback({error: 3, message: 'users not null'});
										}
									}
									else{
										if(callback) callback({error: 2, message: 'message not is json format'});
									}
								}
								else{
									if(callback) callback({error: 1, message: 'message not null'});
								}
							});

							socket.on('watch-user-clear', (msg, callback) => {
								console.log(colors.cyan('Socket: '), colors.yellow(DisplayName),'watch-user-clear',colors.green(msg));
								let key = 'watch:' + DisplayName;

								//get list watch of self
								redis.smembers(key, (err, list)=>{
									if(err){
										logger.error(err, reply);
										if(callback) callback({error: 1000, message: 'server busy'});
									}
									else{
										if(list && Array.isArray(list) && list.length>0){

											//remove event list of friend
											async.eachSeries(msg.users,(user, callback_user)=>{
												redis.srem('event:' + user, DisplayName,(err, reply)=>{
													if(err) logger.error(err, reply);
													callback_user(err, reply);
												});
											});

											//remove list watch of self
											redis.del(key,(err, reply)=>{
												if(err) logger.error(err, reply);
											});
										}
										if(callback) callback({error: 0, message: 'done'});
									}
								});
							});

							socket.on('item-bundle', (msg, callback) => {
								console.log(colors.cyan('Socket: '), colors.yellow(DisplayName),'item bundle',colors.green(msg));
								if (msg) {
									if(typeof msg === 'string'){
										msg = util.parseJson(msg);
									}
									if(msg){
										let item_id;
										if(item_id = msg.item_id){
											connectMgr.setTimeout('item-bundle-' + item_id, item_id, function(ItemId){
												itemService.getBundle(ItemId, (err, info)=>{
													if(err){
														logger.error(err);
													}
													else{
														if(info && info.CustomData && info.CustomData.items && Object.keys(info.CustomData.items).length>0){
															for(let key in info.CustomData.items){
																let itemInfo = info.CustomData.items[key];
																//if(itemInfo.ItemId == 'jackpotGold' || itemInfo.ItemId == 'jackpotCoin'){
																if(itemInfo.ItemId == '01_02_gold' || itemInfo.ItemId == '01_01_coin'){
																	io.in('spin').emit('item-bundle',{
																		DisplayName: DisplayName,
																		ItemId: ItemId,
																		number: itemInfo.number
																	});
																	break;
																}
															}
														}
													}
												});
											},1000);
										}
										else{
											if(callback) callback({error: 3, message: 'item_id not null'});
										}
									}
									else{
										if(callback) callback({error: 2, message: 'message not format json type'});
									}
								}
								else{
									if(callback) callback({error: 1, message: 'message not null'});
								}
							});

							socket.on('client-hack', (msg, callback) => {
								console.log(colors.cyan('Socket: '), colors.yellow(DisplayName),'client-hack',colors.green(msg));
								if(socket.tHack){
									//if(callback) callback({error: 1, message: 'error'});
								}
								else{
									let info = {
										username: user_name,
										display_name: DisplayName,
										timeout: 60000
									};
									if (msg) {
										if(typeof msg === 'string'){
											msg = util.parseJson(msg);
										}
										if(msg) info.data = msg;
									}
									hackService.save(info,(err,new_info)=>{
										if(err){
											logger.error(err, new_info);
										}
										else{
											if(callback) callback({error: 0, message: 'done'});
										}
									});
									socket.tHack = setTimeout(()=>{
										socket.tHack = undefined;
									},60000);
								}
							});

							socket.on('get-time', (msg,callback) => {
								try{
									if(callback && typeof(callback) ==='function'){
										let timestamp = io.timestamp;
										if(!timestamp){
											let date = new Date();
											timestamp = date.getTime();
											io.timestamp = timestamp;
											setTimeout(function(){
												io.timestamp = null;
											},1000);
										}
										callback({
											//error: 0,
											//message: '',
											timestamp: timestamp
										});
										console.log(colors.cyan('Socket: '), colors.yellow(DisplayName),'get-time', colors.green(timestamp));
									}
									else{
										console.log(colors.cyan('Socket: '), colors.yellow(DisplayName),'get-time', 'callback:', callback);
									}
								}
								catch(err){
									logger.error(err);
								}
							});

							socket.on('get-user-online', (msg,callback) => {
								try{
									console.log(colors.cyan('Socket: '), colors.yellow(DisplayName),'get-user-online', colors.green(msg));
									if(callback && typeof(callback) === 'function') {
										if (msg) {
											if (typeof msg === 'string') {
												msg = util.parseJson(msg);
											}
											if (msg) {
												let list_users = msg.list_users;
												let getStatus = (listUsers) => {
													if (listUsers && listUsers.length > 0) {
														connectMgr.getListConnect(listUsers, (err, list_socket) => {
															if (err) {
																logger.error(err);
															}
															else {
																let list_online = [];
																if (list_socket && list_socket.length > 0) {
																	let clients = io.sockets.clients().connected;
																	let length = list_socket.length;
																	for (let i = 0; i < length; i++) {
																		let sid = list_socket[i];
																		let client = clients[sid];
																		if (client) {
																			let user = client.user;
																			if (user && user.DisplayName) {
																				list_online.push(user.DisplayName);
																			}
																		}
																		else {
																			connectMgr.disconnect(listUsers[i], sid);
																		}
																	}
																}
																let list_res = [];
																if (list_online.length > 0) {
																	async.eachSeries(list_online, (dn, callback) => {
																		connectMgr.GetPosition(dn, (err, post_info) => {
																			if (err) {
																				logger.error(err);
																			}
																			else {
																				if (post_info) {
																					post_info = util.parseJson(post_info);
																					if (post_info) {
																						post_info.DisplayName = dn;
																						post_info.status = 'Online';
																					}
																					else {
																						post_info = {
																							DisplayName: dn,
																							status: 'Online',
																						}
																					}
																				}
																				else {
																					post_info = {
																						DisplayName: dn,
																						status: 'Online',
																					}
																				}
																				list_res.push(post_info);
																			}
																			callback(null, dn);
																		});
																	}, () => {
																		callback({error: 0, message: 'ok', list_online: list_res});
																		logger.info('User online:', DisplayName, list_res);
																	});
																}
																else {
																	//callback({error: 0, message: 'not user online', list_online: list_res});
																	logger.info('not callback');
																}
															}
														});
													}
													else {
														callback({error: 3, message: 'list_id not null'});
													}
												};

												if (!list_users || list_users.length == 0) {
													relationshipService.loadListFriend(DisplayName, (err, list) => {
														if (err) {
															logger.error(err);
														}
														else {
															getStatus(list);
														}
													});
												}
												else {
													getStatus(list_users);
												}
											}
											else {
												callback({error: 2, message: 'message not format json type'});
											}
										}
										else {
											callback({error: 1, message: 'message not null'});
										}
									}
									else{
										logger.error('callback not type function');
									}
								}
								catch(err){
									logger.error(err);
								}
							});

							socket.on('clan-message', (msg, callback) => {
								console.log(colors.cyan('Socket: '), colors.yellow(DisplayName),'clan message',colors.green(msg));
								if (msg) {
									if(typeof msg === 'string'){
										msg = util.parseJson(msg);
									}
									if(msg){
										let message = msg.message;
										if(message && message!=''){
											userService.GetClan(user_name,(err,user_info)=>{
												if(err){
													logger.error(err);
												}
												else{
													if(user_info && user_info.clanName && user_info.clanName!=''){
														let clanName = user_info.clanName;
														clanService.getMember(clanName,(err,clan_info)=>{
															if(err){
																logger.error(err);
															}
															else{
																if(clan_info){
																	if(clan_info.members && clan_info.members.length>0){
																		let clients = io.sockets.clients().connected;
																		let message_post = {
																			DisplayName: DisplayName,
																			message: message
																		};

																		async.eachSeries(clan_info.members,(name,callback)=>{
																			connectMgr.getConnect(name, (err, list_id)=>{
																				if(err){
																					logger.error(err);
																				}
																				else{
																					if(list_id && list_id.length>0){
																						for(let j=0, sid; sid = list_id[j]; j++){
																							let client = clients[sid];
																							if(client){
																								client.emit('clan-message', message_post);
																							}
																						}
																						callback(null, name);
																					}
																				}
																			});
																		});

																		if(callback) callback({error: 0, message: 'done'});
																	}
																	else{
																		if(callback) callback({error: 6, message: 'clan not exists members'});
																	}
																}
																else{
																	if(callback) callback({error: 6, message: 'clan not exists infomation'});
																}
															}
														});
													}
													else{
														if(callback) callback({error: 4, message: 'not exists clan info of user'});
													}
												}
											});
										}
										else{
											if(callback) callback({error: 3, message: 'message not null'});
										}
									}
									else{
										if(callback) callback({error: 2, message: 'message not format json type'});
									}
								}
								else{
									if(callback) callback({error: 1, message: 'message not null'});
								}
							});

							socket.on('ping', (msg,callback) => {
								if (callback && typeof(callback) ==='function') callback({pong: msg});
							});
						}
						else{
							socket.emit('server-message',{
								error: 2,
								message: 'display name not set'
							});
							socket.disconnect();
						}
					}
					else{
						socket.emit('server-message',{
							error: 1,
							message: 'username not found'
						});
						socket.disconnect();
						logger.error(user_name,'=> DisplayName null');
					}
				}
			});
	// 	}
	// });

	socket.on('disconnect', () => {
		console.log(colors.cyan('Socket: '), 'disconnect:',colors.green(socket_id), 'IP:', colors.green(ip), 'user:', colors.yellow(user_name));
		userService.updateLogout(user_name, last_api_login);

		//save location
		let user = socket.user;
		if(user){
			let DisplayName = user.DisplayName;
			if(DisplayName){
				connectMgr.disconnect(socket_id, DisplayName, io);
				// console.log(DisplayName, 'list new connect =>', connectMgr.getConnect(DisplayName));
			}

			let data_location = user.location;
			if(data_location){
				data_location.name = user_name;
				let new_date = new Date();
				let old_post = user.position;

				//update last logout mini second
				data_location.logout_at = new_date;

				//calculator old position mini second
				data_location[old_post] += new_date - user.last_position_at;

				//calculator total online mini second
				if(data_location.login_at) data_location.total_online = new_date - data_location.login_at;
				userLocationService.save(data_location,(err,reply)=>{
					if(err){
						logger.error(err, reply);
					}
				});

				if(old_post=='game') RoomMgr.out(user.game_mode.room_id);

				//update position
				// connectMgr.UpdatePosition(socket_id, undefined, old_post);
				// socket.leave(old_post);
			}
			if(socket.interdepend && socket.interdepend.length>0){
				for(let i=0, display_name; display_name = socket.interdepend[i]; i++){
					if(display_name != DisplayName){
						findDisplayName(display_name, connectMgr, io, (err, list_socket)=>{
							if(list_socket && list_socket.length>0){
								for(let j=0, client; client = list_socket[j]; j++){
									client.emit('disconnect-interdepend',{
										DisplayName: DisplayName
									});
								}
							}
						});
					}
				}
			}
			else{
				logger.info(user_name,'list interdepend null');
			}
		}
	});
}

let findDisplayName = (displayName, connectMgr, io, callback) => {
	try{
		connectMgr.getConnect(displayName, (err, list_id)=>{
			if(err){
				logger.error(err);
			}
			else{
				if(list_id && list_id.length>0){
					let clients = io.sockets.clients().connected;
					let list_socket = [];
					for(let j=0, sid; sid = list_id[j]; j++){
						let client = clients[sid];
						let user = client.user;
						if(user){
							list_socket.push(client);
						}
					}
					if(callback && typeof(callback) === 'function') callback(list_socket);
				}
			}
		});
	}
	catch(e){
		logger.error(e);
	}
	return null;
};

module.exports = SocketClient;