/**
 * Created by tanmv on 12/07/2017.
 */
'use strict';
let express = require('express');
let router = express.Router();
let svgCaptcha = require('svg-captcha');

let options = {
	size: 6, // size of random string
	// ignoreChars: '0o1i', // filter out some characters like 0o1i
	noise: 5, // number of noise lines
	color: true, // characters will have distinct colors instead of grey, true if background option is set
	background: '#ffffff', // background color of the svg image
	width: 200, // width of captcha
	height: 100, // height of captcha
	// fontPath: '../fonts/Sears.ttf', // your font path
	fontSize: 80, // captcha text size
	charPreset: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789' // random character preset
};

router.get('/', function(req, res) {
	let captcha = svgCaptcha.create(options);
	req.tndata.captcha = captcha.text.toLowerCase();
	res.set('Content-Type', 'image/svg+xml');
	res.send(captcha.data);
});
module.exports = router;