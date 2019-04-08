'use strict';
let mongoose = require ("mongoose");
let Schema = mongoose.Schema;
let BasePlugins = require ("./plugins/BasePlugins");

/*
Type: String,Number,Date,Buffer,Boolean,Mixed,Objectid,Array
*/

// create a schema
let schema = new Schema({
	_id: { type: Number, inc: true},
	name: String,
	username: { type: String, index: true, required: true, unique: true },
	password: { type: String, index: true, select: false, required: true },
	email: String,
	mobile: String,
	sex: Boolean,
	birthday:Date,

	province_id: Number,
	province_name:String,
	district_id: Number,
	district_name: String,
	school_id: Number,
	school_name: String,
	class_id: {type: Number, min: 0, max: 6},
	class_name: String,
	address: String,

	award: Number,
	vip_expire: Date,

	active_email: {type: Boolean, default: false},
	active_phone: {type: Boolean, default: false},

	banned: {type: Boolean, default: false},
	deleted: {type: Boolean, default: false},

	exam_school: {type: Boolean, default: false},
	exam_district: {type: Boolean, default: false},
	exam_province: {type: Boolean, default: false},
	exam_national: {type: Boolean, default: false},

	marks: [String]
});

schema.virtual('fullName')
	.get(function () {
		return this.name.first + ' ' + this.name.last;
	})
	.set(function(fullname){
		this.name.first = fullname.substr(0, fullname.indexOf(' '));
		this.name.last = fullname.substr(fullname.indexOf(' ') + 1);
	});

schema.statics.findAndModify = function (query, sort, doc, options, callback) {
	return this.collection.findAndModify(query, sort, doc, options, callback);
};

let col_name = 'users';
schema.set('autoIndex', false);
schema.plugin(BasePlugins, {col_name: col_name});
module.exports = mongoose.model(col_name, schema);