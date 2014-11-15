'use strict';

angular.module('wj.services').factory('JobService', function($http, $q, PouchService, ENV) {
  return {
    all: function() {
      var deferred = $q.defer();

      PouchService.db().query(function(doc) { emit(doc.type); }, {key: 'job', include_docs: true}, function(err, response) {
        if (err) console.log('Cannot load jobs', err);

        deferred.resolve(response.rows.map(function(row) {
          return row.doc;
        }));
      });

      return deferred.promise;
    },

    load: function(industryId) {
      var deferred = $q.defer();

      var map = function(doc) {
        if (doc.type === 'job') {
          for (var i = 0; i < doc.industry_ids.length; ++i) {
            emit(doc.industry_ids[i]);
          }
        }
      };

      PouchService.db().query(map, {key: industryId, include_docs: true}, function(err, response) {
        if (err) console.log('Cannot get jobs by industry', err);

        deferred.resolve(response.rows.map(function(row) {
          return row.doc;
        }));
      });

      return deferred.promise;
    },

    get: function(jobId) {
      var deferred = $q.defer();

      PouchService.db().get(jobId, function(err, response) {
        if (err) console.log('Cannot get the job', err);

        deferred.resolve(response);
      });

      return deferred.promise;
    },

    save: function(jobs) {
      var deferred = $q.defer();

      jobs = jobs.map(function(job) {
        job['_id'] = job.id;
        job.type = 'job';
        job.industries = job.industries.split('&amp; ');

        return job;
      });

      PouchService.db().bulkDocs({docs: jobs}, function(err) {
        if (err) console.log('Cannot save jobs', err);

        deferred.resolve();
      });

      return deferred.promise;
    }
  };
});
