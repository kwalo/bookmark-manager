'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var bookmarks = require('../../app/controllers/bookmarks');

	// Bookmarks Routes
	app.route('/bookmarks')
		.get(users.requiresLogin, bookmarks.list)
		.post(users.requiresLogin, bookmarks.create);

	app.route('/bookmarks/:bookmarkId')
		.get(users.requiresLogin, bookmarks.hasAuthorization, bookmarks.read)
		.put(users.requiresLogin, bookmarks.hasAuthorization, bookmarks.update)
		.delete(users.requiresLogin, bookmarks.hasAuthorization, bookmarks.delete);

	// Finish by binding the Bookmark middleware
	app.param('bookmarkId', bookmarks.bookmarkByID);
};
