'use strict';
let mongoose = require ("mongoose");
let Schema = mongoose.Schema;
let BasePlugins = require ("./plugins/BasePlugins");

// create a schema
let schema = new Schema({
	_id: { type: Number, inc: true},
	type_id: Number,
	class_id: Number,
	game_id: Number,
	spq: {type: Number, default: 10},
	play: Number,
	time: Number,

	answers: [Schema.Types.Mixed],
	content: [Schema.Types.Mixed],
});

let col_name = 'exam_events';
schema.set('autoIndex', false);
schema.plugin(BasePlugins, {col_name: col_name});
module.exports = mongoose.model(col_name, schema);