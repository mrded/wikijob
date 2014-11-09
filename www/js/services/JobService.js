'use strict';

angular.module('wj.services').factory('JobService', function($http, $q, PouchService) {
  return {
    all: function(db) {
      var deferred = $q.defer();
      db = db || PouchService.db();

      db.query(function(doc) { emit(doc.type); }, {key: 'job', include_docs: true}, function(err, response) {
        if (err) console.log('Cannot load jobs', err);

        deferred.resolve(response.rows.map(function(row) {
          return row.doc;
        }));
      });

      return deferred.promise;
    },

    load: function(industry, db) {
      var deferred = $q.defer();
      db = db || PouchService.db();

      var map = function(doc) {
        for (var i = 0; i < doc.job_role.length; ++i) {
          emit(doc.job_role[i]);
        }
      };

      db.query(map, {key: industry, include_docs: true}, function(err, response) {
        if (err) console.log('Cannot get jobs by industry', err);

        deferred.resolve(response.rows.map(function(row) {
          return row.doc;
        }));
      });

      return deferred.promise;
    },

    get: function(jobId, db) {
      var deferred = $q.defer();
      db = db || PouchService.db();

      db.get(jobId, function(err, response) {
        if (err) console.log('Cannot get the job', err);

        deferred.resolve(response);
      });

      return deferred.promise;
    },

    save: function(jobs, db) {
      var deferred = $q.defer();
      db = db || PouchService.db();

      db.bulkDocs({docs: jobs}, function(err) {
        if (err) console.log('Cannot save jobs', err);

        deferred.resolve();
      });

      return deferred.promise;
    }
  };
});
