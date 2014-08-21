'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	phantom = require('phantom'),
	crawler = require('../../app/services/web-crawler'),
	Bookmark = mongoose.model('Bookmark'),
	_ = require('lodash');

Bookmark.setKeywords(function(err) {
	if (err) {
		console.log(err);
	}
});

/**
 * Get the error message from error object
 */
var getErrorMessage = function(err) {
	var message = '';

	if (err.code) {
		switch (err.code) {
			case 11000:
			case 11001:
				message = 'Bookmark already exists';
				break;
			default:
				message = 'Something went wrong';
		}
	} else {
		for (var errName in err.errors) {
			if (err.errors[errName].message) message = err.errors[errName].message;
		}
	}

	return message;
};

/**
 * Create a Bookmark
 */
exports.create = function(req, res) {
	var bookmark = new Bookmark(req.body);
	bookmark.user = req.user;

	bookmark.save(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(bookmark);
		}
	});
	if (!bookmark.content) {
		crawler.fetch(bookmark.url)
		.then(function(content) {
			bookmark.content = content;
			bookmark.save(function(err) {
				if (err) {
					console.log(err);
				}
			});
		})
		.fail(function(status) {
			console.log('Cannot get ' + bookmark.url + ' status: ' + status);
		});
		/*
		phantom.create(function(ph) {
			ph.createPage(function(page) {
				page.open(bookmark.url, function(status) {
					page.evaluate(function() {
						return document.body.innerText;
					},function(content) {
						bookmark.content = content;
						bookmark.save(function(err) {
							if (err) {
								console.log(err);
							}
						});
					});
				});
			});
		});
		*/
	}
};

/**
 * Show the current Bookmark
 */
exports.read = function(req, res) {
	res.jsonp(req.bookmark);
};

/**
 * Update a Bookmark
 */
exports.update = function(req, res) {
	var bookmark = req.bookmark ;
	var oldUrl = bookmark.url;

	bookmark = _.extend(bookmark , req.body);
	if (oldUrl !== bookmark.url) {
		crawler.fetch(bookmark.url)
		.then(function(content) {
			bookmark.content = content;
			bookmark.save(function(err) {
				if (err) {
					console.log(err);
				}
			});
		})
		.fail(function(status) {
			console.log('Cannot get ' + bookmark.url + ' status: ' + status);
		});
		/*
		phantom.create(function(ph) {
			ph.createPage(function(page) {
				page.open(bookmark.url, function(status) {
					if (status !== 'success') {
						console.log('Failed to fetch ' + bookmark.url + ' status is ' + status);
						return;
					}
					page.evaluate(function() {
						return document.body.innerText;
					},
					function(content) {
						bookmark.content = content;
						bookmark.save(function(err) {
							if (err) {
								console.log(err);
							} else {
								console.log('Bookmark updated');
								console.log(bookmark.content);
							}
						});
					});
				});
			});
		});
		*/
	}
	bookmark.save(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(bookmark);
		}
	});
};

/**
 * Delete an Bookmark
 */
exports.delete = function(req, res) {
	var bookmark = req.bookmark ;

	bookmark.remove(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(bookmark);
		}
	});
};

/**
 * List of Bookmarks
 */
exports.list = function(req, res) {
	if (req.query.q) {
		// Search-plugin
		Bookmark.search(req.query.q,
			{_id: 1, name: 1, url: 1, description: 1},
			{
				conditions: {
					'user': req.user._id
				}
			}, function(err, bookmarks) {
				if (err) {
					console.log(err);
					return res.send(400, {
						message: getErrorMessage(err)
					});
				} else {
					res.jsonp(bookmarks.results);
				}
			});
	} else {
		Bookmark.find().where({'user': req.user._id}).sort('-created').populate('user', 'displayName').exec(function(err, bookmarks) {
			if (err) {
				return res.send(400, {
					message: getErrorMessage(err)
				});
			} else {
				res.jsonp(bookmarks);
			}
		});
	}
};

/**
 * Bookmark middleware
 */
exports.bookmarkByID = function(req, res, next, id) { Bookmark.findById(id).populate('user', 'displayName').exec(function(err, bookmark) {
		if (err) return next(err);
		if (! bookmark) return next(new Error('Failed to load Bookmark ' + id));
		req.bookmark = bookmark ;
		next();
	});
};

/**
 * Bookmark authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.bookmark.user.id !== req.user.id) {
		return res.send(403, 'User is not authorized');
	}
	next();
};
