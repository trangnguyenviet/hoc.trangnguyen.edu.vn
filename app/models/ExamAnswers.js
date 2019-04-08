/**
 * Created by tanmv on 05/06/2017.
 */
'use strict';
let mongoose = require ("mongoose");
let Schema = mongoose.Schema;
let BasePlugins = require ("./plugins/BasePlugins");
let moment = require('moment');
moment.locale('vi');

// create a schema
let schema = new Schema({
	_id: { type: Number, inc: true},
	name: String,
	rewrite: String,
	type_id: Number,
	class_id: Number,
	game_id: Number,
	play: Number,
	time: Number,
	thumb: String,
	description: String,
	// spq: {type: Number, default: 10},
	// answers: [Schema.Types.Mixed],
	active: Boolean,
	subject_id: Number,
	subject_rewrite: String,
	content: [Schema.Types.Mixed],
});

schema.virtual('show_created')
	.get(function () {
		return moment(this.created_at).format('DD/MM/YYYY HH:mm')
	});

let col_name = 'exam_answers';
schema.set('autoIndex', false);
schema.plugin(BasePlugins, {col_name: col_name});
module.exports = mongoose.model(col_name, schema);