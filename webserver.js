/**
 * Created by tanmv on 19/05/2017.
 */
const cluster = require('cluster'),
	os = require('os');

global.async = require('async');
global.logger = require('tracer').colorConsole();
global.colors = require('colors');
global.util = require('./app/helpers/util');
global.utilModule = require('util');
global.config = require('./config/config');
global.hostname = os.hostname();
global.root_dir = __dirname;
global.auth = require('./app/middleware/auth');

let dbConnect = require('./app/helpers/Mongodb');
let connectRedis = require('./app/helpers/IoRedis');
let AutoLoadServices = require('./app/helpers/AutoLoadServices');

if (cluster.isMaster) {
	let numCPUs = os.cpus().length;
	let workers = [];

	let LibFunction ={
		'get-variables': (args,callback)=>{
			if(callback) callback(null, global.variables);
		},
		'get-category': (args, callback)=>{
			if(callback) callback(null, categorys);
		}
	};

	let CPUWORK = {
		count_work: new Array(numCPUs).fill(0),
		list_function: {},
		get_index: () => {
			let index = 0;
			let value = CPUWORK.count_work[index];
			for(let i=1; i < numCPUs; i++){
				if(CPUWORK.count_work[i] < value){
					index = i;
					value = CPUWORK.count_work[i];
				}
			}
			CPUWORK.count_work[index]++;
			return index;
		},
		decr_index: (index) => {
			if(CPUWORK.count_work[index]){
				CPUWORK.count_work[index]--;
			}
		},
		result_done: (msg)=>{
			let key = msg.key;
			let cid = msg.cid;
			CPUWORK.decr_index(cid);
			CPUWORK.list_function[key](msg.error, msg.results);
			delete CPUWORK.list_function[key];
		},
		sendMsg: (funName, args, callback) => {
			let key = util.randomString(10);
			if(callback && typeof(callback) === 'function'){
				CPUWORK.list_function[key] = callback;
			}
			let index = CPUWORK.get_index();
			workers[index].send({
				action: 'exec',
				key: key,
				funName: funName,
				args: args
			});
		},
		sendAll: (funName, args) => {
			workers.forEach((worker)=>{
				worker.send({
					action: 'exec',
					funName: funName,
					args: args
				});
			});
		},
		master_exec: (message, index) =>{
			if(message.funName){
				let funName = message.funName;
				let key = message.key;
				let args = message.args;
				if(LibFunction[funName]){
					LibFunction[funName](args,(err, results)=>{
						workers[index].send({
							action: message.action,
							key: key,
							error: err,
							results: results
						});
					});
				}
				else{
					logger.error('not exists function:',message.funName);
				}
			}
		}
	};

	let initCluster = (callbacks) => {
		let spawn = (i,callback) => {
			let worker = cluster.fork();
			workers[i] = worker;
			worker.on('online', () => {
				if(callback) callback();
			});
			worker.on('exit', (worker, code, signal) => {
				setTimeout(() => {
					spawn(i);
				},1500);
			});
			worker.on('message', (msg) => {
				if(msg.action === 'exec') {
					CPUWORK.result_done(msg, i);
				}
				if(msg.action === 'master_exec') {
					CPUWORK.master_exec(msg, i);
				}
			});
		};
		let i = 0;
		async.doWhilst(
			callback => {spawn(i, () => {i++; callback(); });},
			() => {return i < numCPUs;},
			() => {callbacks();}
		);
	};

	//init master
	async.waterfall([
		//connect redis
		(callback) => {
			connectRedis(config.redis, (err, redis_client) => {
				if(err) {
					logger.error(err);
				} else {
					global.redis = redis_client;
					callback(null, true);
				}
			});
		},

		(data, callback) => {
			connectRedis(config.redis_token, (err, redis_token) => {
				if(err) {
					logger.error(err);
				} else {
					global.redis_token = redis_token;
					callback(null, data);
				}
			});
		},

		(data, callback) => {
			connectRedis(config.redis, (err,redis_ex) => {
				if(err) {
					logger.error(err);
				} else {
					callback(err,data);
					//https://redis.io/topics/notifications
					redis_ex.config('SET','notify-keyspace-events','Ex',(err,reply)=>{
						logger.info(err,reply);
					});
					redis_ex.subscribe('__keyevent@0__:expired', function (err, count) {
						logger.info(err, count);
					});
					redis_ex.on('message', function (channel, message) {
						// logger.info(channel,message);
					});
					// redis_ex.psubscribe('__keyevent@*__:expired', function (err, count) {
					// 	logger.info(err, count);
					// });
					// redis_ex.on('pmessage', function (pattern, channel, message) {
					// 	logger.info(pattern, channel, message);
					// });
				}
			});
		},

		//connect db
		(data, callback) => {
			dbConnect(config.mongodb, () => {
				// AutoLoadServices(redis);
				callback(null,data);
			});
		},

		// load param
		(data, callback) => {
			const VariableService = require('./app/services/VariableService');
			let variableService = new VariableService();
			variableService.loadData((err,vars)=>{
				if(err){
					logger.error(err);
				}
				else{
					global.variables = vars || {};
					callback(null,data);
				}
			});
		},

		//load category
		(data, callback) => {
			const CategoryService = require('./app/services/CategoryService');
			let categoryService = new CategoryService();
			categoryService.getAll((err,list)=>{
				if(err){
					logger.error(err);
				}
				else{
					global.categorys = list;
					// console.log(list);
					callback(null, data);
				}
			});
		}
	],()=>{

		initCluster(()=>{
			console.log(colors.cyan('Application: ') + '(' + hostname + ') ' + 'runing...');
			redis.subscribe('update-variable',(err,count)=>{
				if(err){
					logger.error(err,count);
				}
			});
			redis.on('message', function (channel, message) {
				if(channel=='update-variable' && message!=''){
					console.log(colors.cyan('Redis: '), colors.yellow('update-variable'),colors.green(message));
					let newData = util.parseJson(message);
					if(newData){
						if(newData && Object.keys(newData).length>0){
							for(let key in newData){
								global.variables[key] = newData[key];
							}
						}
						CPUWORK.sendAll('UpdateVariable',newData);
					}
				}
			});
		});
	});
}
//child process
else {
	let cluster_id = cluster.worker.id;
	let process_id = cluster.worker.process.pid;
	console.log(colors.cyan('Application: ') + 'cluster id: ' + colors.yellow(cluster_id) +' process id: ' + colors.yellow(process_id));

	let LibFunction = {
		POST: (args, callback)=>{
			//
		},
		UpdateVariable: (args)=>{
			if(args && Object.keys(args).length>0){
				for(let key in args){
					global.variables[key] = args[key];
				}
			}
		}
	};

	let MASTERS = {
		list_function: {},
		callFunction: (funName, args, callback) => {
			let key = util.randomString(10);
			if(callback && typeof(callback) === 'function'){
				MASTERS.list_function[key] = callback;
			}
			process.send({
				cid: cluster_id,
				funName: funName,
				action: 'master_exec',
				key: key,
				args: args
			});
		},
		result_done: (msg)=>{
			let key = msg.key;
			MASTERS.list_function[key](msg.error, msg.results);
			delete MASTERS.list_function[key];
		},
		cluster_exe: (message)=>{
			if(LibFunction[message.funName]){
				LibFunction[message.funName](message.args,(err, results)=>{
					process.send({
						action: message.action,
						key: message.key,
						error: err,
						results: results
					});
				});
			}
		}
	};

	process.on('message', (message) => {
		if(message.action === 'exit') {
			process.exit(0);
		}
		if(message.action === 'exec') {
			MASTERS.cluster_exe(message);
		}
		if(message.action === 'master_exec') {
			MASTERS.result_done(message);
		}
	});

	//init
	async.waterfall([
		callback=>{
			MASTERS.callFunction('get-variables', {}, (err, data) => {
				global.variables = data;
				callback(null, true);
			});
		},

		(data, callback) => {
			MASTERS.callFunction('get-category', {}, (err, data) => {
				global.categorys = data;
				callback(null, data);
			});
		},

		(data, callback) => {
			connectRedis(config.redis, (err, redis_client) => {
				if(err) {
					logger.error(err);
				} else {
					global.redis = redis_client;
					callback(null, data);
				}
			});
		},

		(data, callback) => {
			connectRedis(config.redis_token, (err, redis_token) => {
				if(err) {
					logger.error(err);
				} else {
					global.redis_token = redis_token;
					callback(null, data);
				}
			});
		},

		(data, callback) => {
			dbConnect(config.mongodb, () => {
				//autoload services
				AutoLoadServices(redis);
				callback(null, data);
			});
		}
	],() => {
		// UserService.info('name',(err,info)=>{
		// 	logger.info(err,info);
		// });
		//init webserver
		let port = config.web_port;
		global.auth = require('./app/middleware/auth');
		let http = require('http');
		let webserver = require('./app/express');
		let app = webserver();
		let server = http.createServer(app);
		server.listen(port, config.server_name);
		console.log(colors.cyan('Webserver: ') + '(' + hostname + ') ' + 'listen: ' + colors.yellow(config.server_name) +':' + colors.green(port));
	});
}

process.on('SIGINT', () => {
	setTimeout(()=>{
		process.exit(0);
	},1000);
});