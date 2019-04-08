'use strict';
let mongoose = require ("mongoose");
let Schema = mongoose.Schema;
let BasePlugins = require ("./plugins/BasePlugins");

/* Type: String Number Date Buffer Boolean Mixed Objectid Array */
// create a schema
let schema = new Schema({
	_id: { type: Number, inc: true},
	name: { type: String, required: true },

	province_id: { type: Number, required: true },
	province_name: String,
});

let col_name = 'districts';
schema.set('autoIndex', false);
schema.plugin(BasePlugins, {col_name: col_name});
module.exports = mongoose.model(col_name, schema);