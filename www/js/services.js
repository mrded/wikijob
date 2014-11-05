angular.module('wj.services', [])

.factory('Jobs', function($http, $q) {
  var db_name = 'wikijob';
  var pouchdb = new PouchDB(db_name);

  var _all = function() {
    var deferred = $q.defer();

    pouchdb.allDocs({include_docs: true, descending: true}, function(err, response) {
      if (err) {
        deferred.reject(err);
      } else {
        deferred.resolve(response.rows.map(function(row) {
          return row.doc;
        }));
      }
    });

    return deferred.promise;
  };

  return {
    all: _all,
    reload: function() {
      var deferred = $q.defer();

      //$http.get('http://www.wikijob.co.uk/api/jobs').success(function(jobs) {
      $http.get('/jobs.json').success(function(jobs) {
        console.log('** Downloaded ' + jobs.length + ' jobs **');

        jobs = jobs.map(function(job) {
          job['_id'] = job.id;
          job.job_role = job.job_role.split("\n");
          return job;
        });

        pouchdb.destroy(function() {
          pouchdb = new PouchDB(db_name);

          pouchdb.bulkDocs({docs: jobs, include_docs: true}, function(err, response) {
            if (err) {
              deferred.reject(err);
            } else {
              deferred.resolve(_all());
            }
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

      pouchdb.query(map, {key: industry, include_docs: true}, function(err, response) {
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

      pouchdb.get(jobId, function(err, response) {
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
