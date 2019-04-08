'use strict';
let logger = require('tracer').colorConsole();
let express = require('express');
let fs = require('fs');
let path = require('path');
let request = require('request');
let router = express.Router();

router.get('/:s?', function(req, res) {
	try{
		if(req.params.s){
			res.redirect('https://latex.codecogs.com/png.latex?\\inline&space;\\dpi{200}&space;\\LARGE&space' + req.params.s);
		}
	}
	catch (e){
		logger.error(e);
		if(!res.headersSent){
			// res.json({
			// 	error:10000,
			// 	message: "server đang bận, bạn hãy thử lại sau"
			// });
			res.sendStatus(500);
		}
		logger.error(e);
	}
});

// router.get('/:s?', function(req, res) {
// 	try{
// 		if(req.params.s){
// 			let dir_root = req.dir_root;
// 			let filename = req.params.s.replace('\\','_');
// 			let fullpath = path.join(dir_root,'http_public','latex', filename);
// 			fullpath+='.png';
// 			if(fs.existsSync(fullpath)){
// 				res.sendFile(fullpath);
// 			}
// 			else{
// 				let url = 'https://latex.codecogs.com/png.latex?\\inline&space;\\dpi{200}&space;\\LARGE&space;' + req.params.s;
// 				download(url,fullpath,function(err,fullpath){
// 					if(err){
// 						res.sendStatus(404);
// 					}
// 					else{
// 						if(fs.existsSync(fullpath)){
// 							res.sendFile(fullpath);
// 						}
// 						else{
// 							res.sendStatus('400');
// 						}
// 					}
// 				});
// 			}
// 		}
// 		else{
// 			res.send('vcc');
// 		}
// 	}
// 	catch (e){
// 		logger.error(e.stack);
// 		res.send('error');
// 	}
// });

// function download(uri, filename, callback){
// 	try{
// 		request.head(uri, function(err, res, body){
// 			if(err){
// 				logger.error(err);
// 			}
// 			else{
// 				request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
// 			}
// 		});
// 	}
// 	catch(e){
// 		logger.error(e.stack);
// 		callback(e,filename);
// 	}
// };
module.exports = router;