'use strict';
let mongoose = require ("mongoose");
let Schema = mongoose.Schema;
let BasePlugins = require ("./plugins/BasePlugins");

// create a schema
let schema = new Schema({
	_id: { type: Number, inc: true},
	name: { type: String, required: true },
	name_ko_dau: { type: String, required: true },
	active: Boolean,
	time_begin: Number,
	time_end: Number,
	type: Number
});
let col_name = 'exam_event_types';
schema.set('autoIndex', false);
schema.plugin(BasePlugins, {col_name: col_name});
module.exports = mongoose.model(col_name, schema);