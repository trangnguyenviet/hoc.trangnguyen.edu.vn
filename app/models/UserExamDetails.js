'use strict';
let mongoose = require ("mongoose");
let Schema = mongoose.Schema;
let BasePlugins = require ("./plugins/BasePlugins");

/* Type: String Number Date Buffer Boolean Mixed Objectid Array */
// create a schema
let schema = new Schema({
	_id: { type: Number, inc: true},
	user_exam_id: { type: Number, required: true},
	answer: Schema.Types.Mixed,
});

let col_name = 'user_exam_details';
schema.set('autoIndex', false);
schema.plugin(BasePlugins, {col_name: col_name});
module.exports = mongoose.model(col_name, schema);