'use strict';
let mongoose = require ("mongoose");
let Schema = mongoose.Schema;
let BasePlugins = require ("./plugins/BasePlugins");

// create a schema
let schema = new Schema({
	_id: { type: Number, inc: true},
	user_id: Number,
	type_id: {type: Number, default: 4},
	round_id: {type: Number, min: 1, max: 19},
	score: {type: Number, min: 0, max: 300},
	time: {type: Number, min: 0, max: 12000},
	luot: {type: Number, default:1},
	code: String,
});

let col_name = 'scores';
schema.set('autoIndex', false);
schema.plugin(BasePlugins, {col_name: col_name});
module.exports = mongoose.model(col_name, schema);