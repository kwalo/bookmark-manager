'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Bookmark = mongoose.model('Bookmark');

/**
 * Globals
 */
var user, bookmark;

/**
 * Unit tests
 */
describe('Bookmark Model Unit Tests:', function() {
	beforeEach(function(done) {
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: 'username',
			password: 'password'
		});

		user.save(function() {
			bookmark = new Bookmark({
				url: 'http://example.org/',
				name: 'Example bookmark',
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return bookmark.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without url', function(done) {
			bookmark.url = '';
			return bookmark.save(function(err) {
				should.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) {
			bookmark.name = '';

			return bookmark.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) {
		Bookmark.remove().exec();
		User.remove().exec();

		done();
	});
});
