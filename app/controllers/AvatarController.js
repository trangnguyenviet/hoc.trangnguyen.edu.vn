'use strict';

const logger = require('tracer').colorConsole(),
	fs = require('fs'),
	request = require('request'),
	// util = require('../helpers/util'),
	path = require('path');
let express = require('express'),
	router = express.Router();

router.get('/:id?', function(req, res) {
	try{
		if(req.params.id){
			let id = req.params.id;
			if(util.isOnlyNumber(id)){
				let fullpath = path.join(root_dir,'app','public','avatar', id);
				fullpath+='.jpg';
				if(fs.existsSync(fullpath)){
					res.sendFile(fullpath);
				}
				else{
					fullpath = path.join(root_dir, config.no_avatar);
					res.sendFile(fullpath);
				}
			}
			else{
				res.send('vcc');
			}
		}
		else{
			res.send('vcc');
		}
	}
	catch(e){
		logger.error(e.stack);
	}
});
module.exports = router;