'use strict';
let mongoose = require ("mongoose");
let Schema = mongoose.Schema;
let BasePlugins = require ("./plugins/BasePlugins");

/* Type: String Number Date Buffer Boolean Mixed Objectid Array */
// create a schema
let schema = new Schema({
	_id: { type: Number, inc: true},
	name: String,
	parent_id: Number,
	parent_name: String,
	name_ko_dau: String,
	active: Boolean,
	sort: Number
});

let col_name = 'categorys';
schema.set('autoIndex', false);
schema.plugin(BasePlugins, {col_name: col_name});
module.exports = mongoose.model(col_name, schema);