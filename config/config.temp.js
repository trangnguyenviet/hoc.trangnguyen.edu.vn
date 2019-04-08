/**
 * Created by tanmv on 19/05/2017.
 */
'use strict';
module.exports = {
	web_port: 8010,
	socket_port: 2510,
	server_name: '0.0.0.0',
	site_type: 0, //0: default | 1: luyện | 2: bài giảng
	log_request: true,
	publish: true,
	ads: true,
	server_static: 'http://static.trangnguyen.edu.vn', //http://static.trangnguyen.edu.vn
	server_upload: 'http://static.trangnguyen.edu.vn', //http://admins.trangnguyen.edu.vn',

	//db config
	mongodb:{
		connect:'mongodb://10.0.0.200/trangnguyen',
		option: {
			useMongoClient: true, //false by default, set to true to use new mongoose connection logic
			poolSize: 10,
			autoReconnect: true,
			// user: null,
			// pass: null,
			//replset: { rs_name: 'HorusRS', auto_reconnect: true, poolSize: 100, connectWithNoPrimary: true,},
			server: {
				//ssl: false,
				//sslValidate: false,
				// poolSize: 100,
				auto_reconnect: true,
				socketOptions: {
					keepAlive: 1000,
					connectTimeoutMS: 30000
				}
			},
			config: {
				autoIndex: false
			}
		},
		debug: true
	},

	//redis cache for nodejs app
	redis: {
		connect: 'default', //default, sentinel, cluster
		monitor: false,
		'default': {
			port: 6379,
			host: '10.0.0.50',
			db: 0,
			// password: null
			family: 4 // 4 (IPv4) or 6 (IPv6)
		},
		'sentinel': {
			sentinels: [
				{ host: '10.0.0.50', port: 26379 },
				{ host: '10.0.0.51', port: 26380 }
			],
			name: 'mymaster',
			role: 'slave'
		},
		'cluster': [{
				host: '10.0.0.51',
				port: 6379
			},{
				host: '10.0.0.52',
				port: 6379
			},{
				host: '10.0.0.53',
				port: 6379
			}
		]
	},

	redis_token: {
		connect: 'default', //default, sentinel, cluster
		monitor: false,
		'default': {
			port: 6379,
			host: '10.0.0.50',
			db: 1,
			// password: null
			family: 4 // 4 (IPv4) or 6 (IPv6)
		}
	},

	//socket redis adapter for load balancer socket.io
	sra:{
		connect: 'cluster', //default, sentinel, cluster
		monitor: true,
		'default': {
			port: 6379,
			host: '10.0.0.50',
			db: 1,
			// password: null
			family: 4 // 4 (IPv4) or 6 (IPv6)
		},
		'sentinel': {
			sentinels: [
				{ host: '10.0.0.50', port: 26379 },
				{ host: '10.0.0.51', port: 26380 }
			],
			name: 'mymaster',
			role: 'slave'
		},
		'cluster': [
			{
				host: '10.0.0.51',
				port: 6379
			},{
				host: '10.0.0.52',
				port: 6380
			},
			{
				host: '10.0.0.53',
				port: 6381
			}
		]
	},

	session:{
		type: 'client', //client, redis
		client: {
			cookieName: 'tndata', // cookie name dictates the key name added to the request object
			secret: '$&38t_$+f52fdgdASF*^', // should be a large unguessable string
			duration: 60 * 60 * 1000, // how long the session will stay valid in ms
			activeDuration: 1000 * 60 * 60, // if expiresIn < activeDuration, the session will be extended by activeDuration milliseconds
			cookie: {
				domain: '.trangnguyen.edu.vn',
				path: '/', // cookie will only be sent to requests under '/api'
				maxAge: null, // duration of the cookie in milliseconds, defaults to duration above
				ephemeral: true, // when true, cookie expires when the browser closes
				httpOnly: true, // when true, cookie is not accessible from javascript
				secure: false // when true, cookie will only be sent over SSL. use key 'secureProxy' instead if you handle SSL not in your node process
			}
		},
		redis: {
			secret:'$&38t_$+f52fdgdASF*^',
			name: 'PHP_SESSION_ID',
			saveUninitialized: false,
			resave: false,
			cookie: {
				domain: '.trangnguyen.edu.vn',
				path: '/',
				httpOnly: true,
				secure: false,
				maxAge: null
			}
		},
		redis_store: {
			host: '10.0.0.55',
			port: 6379,
			db: 1,
			pass: null,
			ttl: 7200000
		}
	},

	redis_key:{
		update_param: 'update-param',
		count_member: 'count_member',

	},

	password_prefix: 'mvt-',

	subjects: {
		'toan': {
			id: 1,
			name: 'Luyện Toán',
			max_round: 19,
			test_count: 3,
			free: true
		},
		'tieng-anh': {
			id: 2,
			name: 'Luyện Tiếng Anh',
			max_round: 19,
			test_count: 3,
			free: true
		},
		'tieng-viet': {
			id: 3,
			name: 'Luyện Tiếng Việt',
			max_round: 19,
			test_count: 3,
			free: true
		},
		// 'tv': {
		// 	id: 4,
		// 	name: 'Tiếng Việt',
		// 	max_round: 19,
		// 	test_count: 3,
		// 	free: false
		// },
		'khoa-hoc-tu-nhien': {
			id: 5,
			name: 'Luyện Khoa học - tự nhiên',
			max_round: 19,
			test_count: 3,
			free: true
		},
		'su-dia-xa-hoi': {
			id: 6,
			name: 'Luyện Sử - địa -xã hội',
			max_round: 19,
			test_count: 3,
			free: true
		},
		'iq-toan-tieng-anh': {
			id: 7,
			name: 'Luyện IQ - Toán tiếng anh',
			max_round: 19,
			test_count: 3,
			free: true
		}
	}
};