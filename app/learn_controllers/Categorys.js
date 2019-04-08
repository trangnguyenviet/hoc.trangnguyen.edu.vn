'use strict';
let logger = require('tracer').colorConsole();
let express = require('express');
let router = express.Router();

router.get('/', (req, res) => {
	res.render('categorys', {layout:'layout', title: 'Danh mục tin - Trạng Nguyên', categorys})
});

module.exports = router;