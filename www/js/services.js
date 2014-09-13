angular.module('wj.services', [])

.factory('Jobs', function($http, $q, $ionicLoading, DatabaseService) {
  var jobs = [
    {
      id: '1',
      title: 'foo',
      summary: 'Pellentesque auctor pretium lorem, ac.',
      description: 'Vivamus ac libero eget nisi venenatis aliquet. Maecenas feugiat blandit nibh sit amet fermentum. Etiam viverra euismod ultrices. In dignissim augue ut sem tincidunt, euismod congue nulla egestas. Pellentesque et dolor turpis. Praesent eu turpis blandit, maximus lectus nec, rhoncus diam. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.',
      url: 'http://demenchuk.me',
    },
    {
      id: '2',
      title: 'bar',
      summary: 'Suspendisse nec massa ipsum. Nulla.',
      description: 'Nulla vehicula rhoncus porttitor. Fusce in risus hendrerit eros tempor sagittis. Sed vulputate, augue quis posuere volutpat, dolor libero iaculis nulla, at vehicula risus nibh ac turpis. In imperdiet ante sed mauris sollicitudin molestie. Cras sagittis, turpis eget accumsan auctor, tellus mauris dignissim justo, vitae euismod orci nisi vitae nibh. Interdum et malesuada fames ac ante ipsum primis in faucibus. Aliquam vel elementum est. Proin ut leo est. Ut tincidunt gravida scelerisque. In interdum, risus pulvinar egestas vehicula, risus lorem ullamcorper dui, ac varius libero ante sed lacus. Cras pulvinar nunc sit amet eros dictum rhoncus. Donec pharetra tincidunt erat at mattis. Cras eros ligula, accumsan ut lorem eu, sollicitudin laoreet lectus.',
      url: 'http://www.wikijob.co.uk',
    },
    {
      id: '3',
      title: 'baz',
      summary: 'Nullam pellentesque sapien ipsum, sit.',
      description: 'Aliquam erat volutpat. Nulla ac porta tellus. Ut faucibus, sem ac eleifend pellentesque, mi arcu varius enim, ac vehicula sapien metus a justo. Phasellus id neque pharetra, faucibus tellus vel, imperdiet quam. Integer hendrerit et nisi id ornare. Donec vitae convallis augue. Vestibulum vehicula nulla finibus, aliquam erat sit amet, finibus elit. Nunc vehicula ante metus, vel aliquet nunc laoreet et. Integer ut arcu venenatis, interdum lacus in, condimentum sem. Proin ac neque urna. Integer ante nibh, convallis et tellus non, pulvinar pulvinar arcu. Sed vel leo nec metus ornare tempus et gravida tellus. Interdum et malesuada fames ac ante ipsum primis in faucibus. Suspendisse at nisi mi. Curabitur pulvinar, neque a sollicitudin tristique, turpis nunc ultrices eros, non condimentum neque eros id ante.',
      url: 'http://google.com',
    }
  ];
  
  DatabaseService.then(function(db) {
    angular.forEach(jobs, function(job) {
      db.remove(job.id).then(function() {
        db.put(job, job.id, function callback(err, result) {
          if (err) alert(err.message);
        });
      });
    });
  });
  
  return {
    all: function() {
      var deferred = $q.defer();
      
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

.service('DatabaseService', function($q) {
  var db = $q.defer();

  document.addEventListener("deviceready", function() {
    console.log('Database is ready');
    db.resolve(new PouchDB('storage'));
  }, false);

  return db.promise;
});

