'use strict';

angular.module('wj.services').factory('IndustryService', function($q, PouchService) {
  return {
    all: function() {
      var deferred = $q.defer();

      PouchService.db().query(function(doc) { emit(doc.type); }, {key: 'industry', include_docs: true}, function(err, response) {
        if (err) console.log('Cannot load industries', err);

        deferred.resolve(response.rows.map(function(row) {
          return row.doc;
        }));
      });

      return deferred.promise;
    },

    save: function(industries) {
      var deferred = $q.defer();

      PouchService.db().bulkDocs({docs: industries}, function(err) {
        if (err) console.log('Cannot save industries', err);

        deferred.resolve();
      });

      return deferred.promise;
    }
  };
});
