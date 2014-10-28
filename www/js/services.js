angular.module('wj.services', [])

.factory('Jobs', function($http, $q, DatabaseService) {
  return {
    reload: function() {
      var deferred = $q.defer();

      DatabaseService.then(function(db) {
        $http.get('/jobs.json').success(function(jobs) {
          console.log('** Downloaded ' + jobs.length + ' jobs **');

          jobs = jobs.map(function(job) {
            job['_id'] = job.id;
            job['key'] = 'jobs';

            job.job_role = job.job_role.split("\n");

            return job;
          });

          db.bulkDocs({docs: jobs}).then(function(response) {
            deferred.resolve(response)
          });
        });
      });

      return deferred.promise;
    },

    all: function() {
      var deferred = $q.defer();

      //WAT?: DatabaseService is empty O_o
      DatabaseService.then(function(db) {
        db.allDocs({
          include_docs: true,
          descending: true
        }, function(err, doc) {
          if (err) alert(err.message);

          deferred.resolve(doc.rows.map(function(row) {
            return row.doc;
          }));
        });
      });

      return deferred.promise;
    },

    load: function(industry) {
      var deferred = $q.defer();

      DatabaseService.then(function(db) {
        var map = function(doc) {
          for (var i = 0; i < doc.job_role.length; ++i) {
            emit(doc.job_role[i]);
          }
        };

        db.query(map, {key: industry, include_docs: true}).then(function(response) {
          deferred.resolve(response.rows.map(function(row) {
            return row.doc;
          }));
        });
      });

      return deferred.promise;
    },

    get: function(jobId) {
      var deferred = $q.defer();

      DatabaseService.then(function(db) {
        db.get(jobId, function(err, doc) {
          if (err) alert(err.message);

          deferred.resolve(doc);
        });
      });

      return deferred.promise;
    }
  };
})

.factory('DatabaseService', function($q, pouchdb) {
  var ready = $q.defer();

  document.addEventListener("deviceready", function() {
    console.log('** Device is ready **');
    ready.resolve(pouchdb.create('wikijob'));
  }, false);

  return ready.promise;
});
