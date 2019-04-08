'use strict';
let mongoose = require ("mongoose");
let Schema = mongoose.Schema;

// create a schema
let schema = new Schema({
	// _id: { type: Number, default: 0},
	user_id: Number,
	fullname: String,
	event_id: Number,
	class_id: Number,
	score: Number,
	time: Number,
});

let col_name = 'user_score_event_ranks';
schema.set('autoIndex', false);

module.exports = mongoose.model(col_name, schema);