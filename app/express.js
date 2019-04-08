/**
 * Created by tanmv on 19/05/2017.
 */
'use strict';

const express = require('express'),
	client_sessions = require("client-sessions"),
	express_session = require('express-session'),
	redisStore = require('connect-redis')(express_session),
	methodOverride = require('method-override'),
	cookieParser = require('cookie-parser'),
	bodyParser = require('body-parser'),
	hogan = require('hogan-express'),
	compression = require('compression'),
	morgan = require('morgan'),
	path = require('path'),
	routes = require("./routes"),
	partials = require("./partials");

module.exports = (callback) => {
	let app = new express();
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({extended: false}));
	app.use(cookieParser());
	app.use(express.static(path.join(__dirname, 'public'),{ maxAge: 129600000}));//1.5d
	app.use(methodOverride('X-HTTP-Method-Override'));
	app.use(compression());

	//session config
	if(config.session.type=='client'){
		app.use(client_sessions(config.session.client));
	}
	else if(config.session.type=='redis'){
		let session_config = config.session.redis;
		session_config.store = new redisStore(config.session.redis_store);
		app.use(express_session(session_config));
	}

	switch (config.site_type) {
		case 1:
			app.set('views', path.join(__dirname, 'practice_views'));
			break;
		case 2:
			app.set('views', path.join(__dirname, 'answer_views'));
			break;
		case 3:
			app.set('views', path.join(__dirname, 'learn_views'));
			break;
		default:
			app.set('views', path.join(__dirname, 'views'));
			break;
	}

	app.engine('html', hogan);
	app.set('view engine', 'html');
	partials(app);
	if(config.log_request){
		app.use(morgan('dev'));
	}
	app.use(function(req, res, next){
		res.locals.user = req.tndata.user; //set current user
		res.locals.publish = config.publish;
		res.locals.ads = config.ads;
		res.locals.server_static = config.server_static;
		res.locals.server_upload = config.server_upload;
		// res.locals.baseUrl = req.baseUrl;
		res.locals.pathname = req._parsedUrl.pathname;
		res.set('x-powered-by', 'MVTHP-2017');
		next();
	});
	routes(app);
	if(typeof callback === "function") callback(app);
	return app;
};