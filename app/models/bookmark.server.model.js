'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	searchPlugin = require('mongoose-search-plugin'),
	Schema = mongoose.Schema;

/**
 * Bookmark Schema
 */
var BookmarkSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Bookmark name',
		trim: true
	},
	url: {
		type: String,
		default: '',
		required: 'Please fill Bookmark url',
		trim: true
	},
	description: {
		type: String,
		default: '',
		trim: true
	},
	content: {
		type: String,
		default: '',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

BookmarkSchema.plugin(searchPlugin, {
	fields: ['name', 'url', 'description', 'content']
});

mongoose.model('Bookmark', BookmarkSchema);
