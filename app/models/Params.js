'use strict';
let mongoose = require ("mongoose");
let Schema = mongoose.Schema;

let schema = new Schema({
	_id: { type: String, index: true, unique: true},
	name: String,
	value: Schema.Types.Mixed
});

let col_name = 'params';
schema.set('autoIndex', false);
module.exports = mongoose.model(col_name, schema);