'use strict';
let mongoose = require ("mongoose");
let Schema = mongoose.Schema;
let schema = new Schema({
	_id: { type: String, index: true, unique: true},
	name: String,
	type: {type: String, enum: ['int', 'string','array','object']},
	value: Schema.Types.Mixed
});
let col_name = 'variables';
schema.set('autoIndex', false);
module.exports = mongoose.model(col_name, schema);