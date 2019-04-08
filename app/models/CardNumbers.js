'use strict';
let mongoose = require ("mongoose");
let Schema = mongoose.Schema;
let BasePlugins = require ("./plugins/BasePlugins");

let schema = new Schema({
	//_id: { type: Number, default: 0},
	number: {type: String, index: true},
	serial: {type: String, index: true},
	money: Number,
	day: Number,
	active: {type: Boolean, index: true},
	is_used: {type: Boolean, index: true},
	used_at: Date,
	user_used: Number
});

let col_name = 'cards';
schema.set('autoIndex', false);
schema.plugin(BasePlugins, {col_name: col_name});
module.exports = mongoose.model(col_name, schema);