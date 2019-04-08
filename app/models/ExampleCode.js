'use strict';

let mongoose = require ("mongoose");
let Schema = mongoose.Schema;
let BasePlugins = require ("./plugins/BasePlugins");

// create a schema
let schema = new Schema({
	_id: String,
	type: String,
	province_id: Number,
	district_id: Number,
	school_id: Number,
	begin_use: Number,
	end_use: Number,
	active: Boolean
});

let col_name = 'example_codes';
schema.set('autoIndex', false);
schema.plugin(BasePlugins, {col_name: col_name});
module.exports = mongoose.model(col_name, schema);