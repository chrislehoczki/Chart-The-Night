'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Bar = new Schema({
	name: String,
	date: Array
});

module.exports = mongoose.model('Bar', Bar);