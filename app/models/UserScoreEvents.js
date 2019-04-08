'use strict';
let mongoose = require ("mongoose");
let Schema = mongoose.Schema;
let BasePlugins = require ("./plugins/BasePlugins");

// create a schema
let schema = new Schema({
	// _id: { type: Number, inc: true},
	// _id: Schema.Types.ObjectId,
	user_id: Number,
	// fullname: String,
	event_id: Number,
	// class_id: Number,
	score: Number,
	time: Number,
	// exam_no: {type:Number, default:1},
});

let col_name = 'user_score_events';
schema.set('autoIndex', false);
schema.plugin(BasePlugins, {col_name: col_name});
module.exports = mongoose.model(col_name, schema);