'use strict';

const util = require('../helpers/util'),
	colors = require('colors'),
	logger = require('tracer').colorConsole();

function LoginController(CPUWORK, socket, io, query){
	socket.on('disconnect', () => {
		console.log(colors.cyan('Socket: '), 'disconnect:',colors.green(socket_id), 'IP:', colors.green(ip), 'query:', colors.yellow(query));
	});
}

module.exports = LoginController;