'use strict';

//Setting up route
angular.module('bookmarks').config(['$stateProvider',
	function($stateProvider) {
		// Bookmarks state routing
		$stateProvider.
		state('listBookmarks', {
			url: '/bookmarks',
			templateUrl: 'modules/bookmarks/views/list-bookmarks.client.view.html'
		}).
		state('createBookmark', {
			url: '/bookmarks/create',
			templateUrl: 'modules/bookmarks/views/create-bookmark.client.view.html'
		}).
		state('editBookmark', {
			url: '/bookmarks/:bookmarkId/edit',
			templateUrl: 'modules/bookmarks/views/edit-bookmark.client.view.html'
		});
	}
]);
