'use strict';

angular.module('wj.services').factory('JobService', function($http, $q, PouchService) {
  return {
    all: function() {
      var deferred = $q.defer();

      PouchService.db().query(function(doc) { emit(doc.type); }, {key: 'job', include_docs: true, attachments: true}, function(err, response) {
        if (!err) {
          deferred.resolve(response.rows.map(function(row) {
            return row.doc;
          }));
        } else deferred.reject(err.message);
      });

      return deferred.promise;
    },

    load: function(industry) {
      var deferred = $q.defer();

      var map = function(doc) {
        if (doc.type === 'job') {
          for (var i = 0; i < doc.industries.length; ++i) {
            emit(doc.industries[i]);
          }
        }
      };

      PouchService.db().query(map, {key: industry, include_docs: true, attachments: true}, function(err, response) {
        if (!err) {
          deferred.resolve(response.rows.map(function(row) {
            return row.doc;
          }));
        } else deferred.reject(err.message);
      });

      return deferred.promise;
    },

    get: function(jobId) {
      var deferred = $q.defer();

      PouchService.db().get(jobId, {attachments: true}, function(err, response) {
        if (!err) deferred.resolve(response)
          else deferred.reject(err.message);
      });

      return deferred.promise;
    },

    save: function(jobs) {
      var deferred = $q.defer();

      angular.forEach(jobs, function(job) {
        job['_id'] = job.id;
        job.type = 'job';

        job.industries = job.industries.split(',');

        PouchService.db().post(job, function(err, response) {
          if (!err) deferred.resolve(response)
            else deferred.reject(err.message);
        });
      });

      return deferred.promise;
    }
  };
});
