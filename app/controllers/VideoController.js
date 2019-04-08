'use strict';
const async = require('async');
const logger = require('tracer').colorConsole();
const express = require('express');
const util = require('../helpers/util');

let router = express.Router();

router.get('/', function(req, res) {
	try{
		//
	}
	catch(e){
		logger.error(e.stack);
	}
});

router.post('/list/:category_id', (req, res) => {
	try{
		//
	}
	catch(e){
		logger.error(e.stack);
	}
});

router.post('/list-other', (req, res) => {
	try{
		//
	}
	catch(e){
		logger.error(e.stack);
	}
});

router.get('/:name_ko_dau?.:id?', (req, res) => {
	try{
		//
	}
	catch(e){
		logger.error(e.stack);
	}
});

router.post('/random-list', (req, res) => {
	try{
		//
	}
	catch(e){
		logger.error(e.stack);
	}
});

module.exports = router;