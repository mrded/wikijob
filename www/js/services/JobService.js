'use strict';

angular.module('wj.services').factory('JobService', function($http, $q, PouchService) {
  var _getJobs = function(jobs) {
    return jobs.map(function(job) {
      job['_id'] = job.id;
      job.type = 'job';
      job.job_role = job.job_role.split("\n");

      return job;
    });
  };

  return {
    all: function() {
      var deferred = $q.defer();

      PouchService.db.query(function(doc) { emit(doc.type); }, {key: 'job', include_docs: true}, function(err, response) {
        if (err) console.log('Cannot load jobs', err);

        deferred.resolve(response.rows.map(function(row) {
          return row.doc;
        }));
      });

      return deferred.promise;
    },

    reload: function() {
      var deferred = $q.defer();

      //$http.get('http://www.wikijob.co.uk/api/jobs').success(function(jobs) {
      $http.get('/jobs.json').success(function(response) {
        console.log('** Downloaded ' + response.length + ' jobs **');

        PouchService.reset().then(function(db) {
          db.bulkDocs({docs: _getJobs(response)}, function(err) {
            if (err) console.log('Cannot add jobs', err);

            db.query(function(doc) { emit(doc.type); }, {key: 'job', include_docs: true}, function(err, response) {
              if (err) console.log('Cannot load jobs', err);

              deferred.resolve(response.rows.map(function(row) {
                return row.doc;
              }));
            });
          });
        });
      });

      return deferred.promise;
    },

    load: function(industry) {
      var deferred = $q.defer();


      var map = function(doc) {
        for (var i = 0; i < doc.job_role.length; ++i) {
          emit(doc.job_role[i]);
        }
      };

      PouchService.db.query(map, {key: industry, include_docs: true}, function(err, response) {
        if (err) {
          deferred.reject(err);
        } else {
          deferred.resolve(response.rows.map(function(row) {
            return row.doc;
          }));
        }
      });

      return deferred.promise;
    },

    get: function(jobId) {
      var deferred = $q.defer();

      PouchService.db.get(jobId, function(err, response) {
        if (err) {
          deferred.reject(err);
        } else {
          deferred.resolve(response);
        }
      });

      return deferred.promise;
    }
  };
});
