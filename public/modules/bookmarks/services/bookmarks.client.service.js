'use strict';

//Bookmarks service used to communicate Bookmarks REST endpoints
angular.module('bookmarks').factory('Bookmarks', ['$resource',
	function($resource) {
		return $resource('bookmarks/:bookmarkId', { bookmarkId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);