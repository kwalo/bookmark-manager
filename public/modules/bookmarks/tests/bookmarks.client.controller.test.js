'use strict';

(function() {
	// Bookmarks Controller Spec
	describe('Bookmarks Controller Tests', function() {
		// Initialize global variables
		var BookmarksController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Bookmarks controller.
			BookmarksController = $controller('BookmarksController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Bookmark object fetched from XHR', inject(function(Bookmarks) {
			// Create sample Bookmark using the Bookmarks service
			var sampleBookmark = new Bookmarks({
				name: 'New Bookmark',
				url: 'http://example.com'
			});

			// Create a sample Bookmarks array that includes the new Bookmark
			var sampleBookmarks = [sampleBookmark];

			// Set GET response
			$httpBackend.expectGET('bookmarks?q=').respond(sampleBookmarks);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.bookmarks).toEqualData(sampleBookmarks);
		}));

		it('$scope.findOne() should create an array with one Bookmark object fetched from XHR using a bookmarkId URL parameter', inject(function(Bookmarks) {
			// Define a sample Bookmark object
			var sampleBookmark = new Bookmarks({
				name: 'New Bookmark'
			});

			// Set the URL parameter
			$stateParams.bookmarkId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/bookmarks\/([0-9a-fA-F]{24})$/).respond(sampleBookmark);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.bookmark).toEqualData(sampleBookmark);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Bookmarks) {
			// Create a sample Bookmark object
			var sampleBookmarkPostData = new Bookmarks({
				name: 'New Bookmark',
				url: 'http://example.org/',
				description: 'Example bookmark'
			});

			// Create a sample Bookmark response
			var sampleBookmarkResponse = new Bookmarks({
				_id: '525cf20451979dea2c000001',
				name: 'New Bookmark',
				url: 'http://example.org/',
				description: 'Example bookmark'
			});

			// Fixture mock form input values
			scope.name = 'New Bookmark';
			scope.url = 'http://example.org/';
			scope.description = 'Example bookmark';

			// Set POST response
			$httpBackend.expectPOST('bookmarks', sampleBookmarkPostData).respond(sampleBookmarkResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');
			expect(scope.url).toEqual('');
			expect(scope.description).toEqual('');


			// Test URL redirection after the Bookmark was created
			expect($location.path()).toBe('/bookmarks');
		}));

		it('$scope.update() should update a valid Bookmark', inject(function(Bookmarks) {
			// Define a sample Bookmark put data
			var sampleBookmarkPutData = new Bookmarks({
				_id: '525cf20451979dea2c000001',
				name: 'New Bookmark',
				url: 'http://example.org/',
				description: 'Sample bookmark'
			});

			// Mock Bookmark in scope
			scope.bookmark = sampleBookmarkPutData;

			// Set PUT response
			$httpBackend.expectPUT(/bookmarks\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/bookmarks/' + sampleBookmarkPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid bookmarkId and remove the Bookmark from the scope', inject(function(Bookmarks) {
			// Create new Bookmark object
			var sampleBookmark = new Bookmarks({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Bookmarks array and include the Bookmark
			scope.bookmarks = [sampleBookmark];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/bookmarks\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleBookmark);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.bookmarks.length).toBe(0);
		}));

		it('$scope.refreshQuery() should send GET request after timeout', inject(function(Bookmarks, $timeout) {
			// Create sample Bookmark using the Bookmarks service
			var sampleBookmark = new Bookmarks({
				name: 'New Bookmark',
				url: 'http://example.com'
			});

			// Create a sample Bookmarks array that includes the new Bookmark
			var sampleBookmarks = [sampleBookmark];

			// Set GET response
			$httpBackend.expectGET('bookmarks?q=example').respond(sampleBookmarks);

			scope.searchTerm = 'example';
			scope.refreshQuery();
			$timeout.flush();
			$httpBackend.flush();

			expect(scope.bookmarks.length).toBe(1);
		}));
	});
}());
