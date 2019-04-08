/**
 * Created by tanmv on 19/05/2017.
 */
'use strict';

const async = require('async'),
	cluster = require('cluster'),
	os = require('os'),
	logger = require('tracer').colorConsole(),
	colors = require('colors'),
	util = require('./app/helpers/util');
global.config = require('./config/config.temp');
let hostname = os.hostname();
let dbConnect = require('./app/helpers/Mongodb');
let connectRedis = require('./app/helpers/IoRedis');

let variables = {};

if (cluster.isMaster) {
	let numCPUs = os.cpus().length;
	let workers = [];

	let LibFunction ={
		'get-param': (args,callback)=>{
			if(callback) callback(null, variables);
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
				spawn(i);
			});
			worker.on('message', (msg) => {
				if(msg.action=='exec'){
					CPUWORK.result_done(msg, i);
				}
				if(msg.action=='master_exec'){
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

	//init
	async.parallel([
		//connect redis
		(callback)=>{
			connectRedis(config.redis, (err,redis_client)=>{
				if(err){
					logger.error(err);
				}
				else{
					global.redis = redis_client;
					callback(null,true);
				}
			});
		},

		//connect db
		(callback)=>{
			dbConnect(config.mongodb, ()=>{
				callback(null,true);
			});
		}
	],function(){
		// load param
		const VariableService = require('./app/services/VariableService');
		let variableService = new VariableService();
		variableService.loadData(vars=>{
			global.variables = variables = vars;
			initCluster(()=>{
				console.log(colors.cyan('Application: ') + '(' + hostname + ') ' + 'runing...');
				let port = config.port;
				let http = require('http');
				let webserver = require('./webserver');
				let app = webserver(variables);
				let server = http.createServer(app);
				server.listen(port, config.server_name);
				console.log(colors.cyan('Webserver: ') + '(' + hostname + ') ' + 'listen: ' + colors.yellow(config.server_name) +':' + colors.green(port));
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
		UpdateParam: ()=>{
			//
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
		if(message.action=='exit'){
			process.exit(0);
		}
		if(message.action=='exec'){
			MASTERS.cluster_exe(message);
		}
		if(message.action=='master_exec'){
			MASTERS.result_done(message);
		}
	});

	MASTERS.callFunction('get-param',{},(err,data)=>{
		console.log(err,data);
	});
}

process.on('SIGINT', () => {
	setTimeout(()=>{
		process.exit(0);
	},1000);
});