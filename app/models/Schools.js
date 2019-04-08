'use strict';
let mongoose = require ("mongoose");
let Schema = mongoose.Schema;
let BasePlugins = require ("./plugins/BasePlugins");

/* Type: String Number Date Buffer Boolean Mixed Objectid Array */
// create a schema
let schema = new Schema({
	_id: { type: Number, inc: true},
	name: String,

	province_id: { type: Number, required: true },
	province_name: String,
	district_id: { type: Number, required: true },
	district_name: String,
});

let col_name = 'schools';
schema.set('autoIndex', false);
schema.plugin(BasePlugins, {col_name: col_name});
module.exports = mongoose.model(col_name, schema);