angular.module('wj.services', [])

.factory('Jobs', function($http, $q, DatabaseService) {
  return {
    reload: function() {
      var deferred = $q.defer();
      
      DatabaseService.then(function(db) {
        console.log('** Database is ready **');
        
        $http.get('/jobs.json').success(function(jobs) {
          console.log('** Downloaded ' + jobs.length + ' jobs **');
            
          db.bulkDocs(jobs, function(err, response) {
            deferred.resolve(response); 
            err ? deferred.reject(err.message) : deferred.resolve(response)
          });
        });
        
      });
      
      return deferred.promise;
    },
    
    all: function() {
      var deferred = $q.defer();
      
      //WAT?: DatabaseService is empty O_o
      DatabaseService.then(function(db) {
        db.allDocs({include_docs: true, descending: true}, function(err, doc) {
          if (err) alert(err.message);
          
          deferred.resolve(doc.rows.map(function(row) {
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

.factory('DatabaseService', function($q) {
  var ready = $q.defer();

  // document.addEventListener("deviceready", function() {
    console.log('** Device is ready **');
    
    PouchDB.destroy('storage', function(err, info) {
      ready.resolve(new PouchDB('storage'));
    });
  // }, false);

  return ready.promise;
});

