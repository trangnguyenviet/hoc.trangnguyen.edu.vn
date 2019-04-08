/**
 * Created by tanmv on 14/04/2017.
 */
'use strict';
const colors = require('colors');
let mongoose = require ("mongoose");
const fs = require('fs');
const join = require('path').join;

module.exports = (conf, callbackDone) => {
	let tMongodbConnect;
	let bFirst = true;
	let connect = ()=> {
		mongoose.connect(conf.connect, conf.option);
		mongoose.set('debug', conf.debug);
		mongoose.Promise = global.Promise;
	};

	mongoose.connection.on('error', () => {
		console.log(colors.cyan('MongoDB: ') + colors.red('error'));
	});

	mongoose.connection.on('disconnected', () => {
		console.log(colors.cyan('MongoDB: ') + colors.red('disconnected'));
		if(tMongodbConnect) clearTimeout(tMongodbConnect);
		tMongodbConnect = setTimeout(() => {
			connect();
		},1000);
	});

	mongoose.connection.on('connected', () => {
		console.log(colors.cyan('MongoDB: ')+ colors.green('connected'));
		if(bFirst && callbackDone){
			bFirst = false;
			callbackDone();
		}
		tMongodbConnect = null;
	});
	connect();
};

process.on('SIGINT', () => {
	mongoose.connection.close();
});