/**
 * Created by tanmv on 13/05/2017.
 */
'use strict';
let mongoose = require ("mongoose");
let Schema = mongoose.Schema;
let BasePlugins = require ("./plugins/BasePlugins");

let schema = new Schema({
	user_id: Number,
	round_id: Number
});

let col_name = 'res_exams';
schema.set('autoIndex', false);
schema.plugin(BasePlugins, {col_name: col_name});
module.exports = mongoose.model(col_name, schema);