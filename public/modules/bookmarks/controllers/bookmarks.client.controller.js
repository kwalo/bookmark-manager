'use strict';

// Bookmarks controller
angular.module('bookmarks').controller('BookmarksController', ['$scope', '$http', '$stateParams', '$location', 'Authentication', 'Bookmarks',
	function($scope, $http, $stateParams, $location, Authentication, Bookmarks ) {
		$scope.authentication = Authentication;
		$scope.searchTerm = '';

		// Create new Bookmark
		$scope.create = function() {
			// Create new Bookmark object
			var bookmark = new Bookmarks ({
				url: this.url,
				name: this.name,
				description: this.description
			});

			// Redirect after save
			bookmark.$save(function(response) {
				$location.path('bookmarks');
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});

			// Clear form fields
			this.url = '';
			this.name = '';
			this.description = '';
		};

		// Remove existing Bookmark
		$scope.remove = function( bookmark ) {
			if ( bookmark ) { bookmark.$remove();

				for (var i in $scope.bookmarks ) {
					if ($scope.bookmarks [i] === bookmark ) {
						$scope.bookmarks.splice(i, 1);
					}
				}
			} else {
				$scope.bookmark.$remove(function() {
					$location.path('bookmarks');
				});
			}
		};

		// Update existing Bookmark
		$scope.update = function() {
			var bookmark = $scope.bookmark ;

			bookmark.$update(function() {
				$location.path('bookmarks/' + bookmark._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Bookmarks
		$scope.find = function() {
				$scope.bookmarks = Bookmarks.query({q: $scope.searchTerm});
		};

		// Find existing Bookmark
		$scope.findOne = function() {
			$scope.bookmark = Bookmarks.get({
				bookmarkId: $stateParams.bookmarkId
			});
		};
	}
]);
