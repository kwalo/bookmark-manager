'use strict';

/**
 * Module dependencies.
 */
var phantom = require('phantom'),
    Q = require('q');

exports.fetch = function(url) {
  var deferred = Q.defer();

  phantom.create(function(ph) {
    ph.createPage(function(page) {
      page.open(url, function(status) {
        if (status !== 'success') {
          deferred.reject(new Error(status));
        }
        page.evaluate(function() {
          return document.body.innerText;
        }, function(content) {
          deferred.resolve(content);
        });
      });
    });
  });

  return deferred.promise;
};
