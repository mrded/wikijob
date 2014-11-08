angular.module('wj.controllers', [])

.controller('MenuCtrl', function($rootScope, $scope, $ionicLoading, JobService) {
  $scope.load = function(industry) {
    $ionicLoading.show({template: 'Loading'});

    JobService.load(industry).then(function(jobs) {
      $rootScope.jobs = jobs;
      $ionicLoading.hide();
    });
  };

  $ionicLoading.show({template: 'Loading'});

  $rootScope.industries = [];

  JobService.all().then(function(jobs) {
    $rootScope.jobs = jobs;

    angular.forEach(jobs, function(job) {
      $rootScope.industries = $rootScope.industries.concat(job.job_role).unique().filter(Boolean);
    });

    $ionicLoading.hide();
  });
})

.controller('JobsCtrl', function($rootScope, $scope, $ionicLoading, $http, JobService, PouchService) {
  $scope.reload = function() {
    $ionicLoading.show({template: 'Download jobs'});
    $rootScope.jobs = [];
    $rootScope.industries = [];

    //$http.get('http://www.wikijob.co.uk/api/jobs').success(function(jobs) {
    $http.get('/jobs.json').success(function(response) {
      console.log('** Downloaded ' + response.length + ' jobs **');

      var _jobs = response.map(function(job) {
        job['_id'] = job.id;
        job.type = 'job';
        job.job_role = job.job_role.split("\n");

        return job;
      });

      // Reset database.
      PouchService.reset().then(function(db) {
        JobService.save(_jobs, db).then(function() {
          JobService.all(db).then(function(jobs) {
            $rootScope.jobs = jobs;

            // Reload menu.
            angular.forEach(jobs, function(job) {
              $rootScope.industries = $rootScope.industries.concat(job.job_role).unique().filter(Boolean);
            });

            $ionicLoading.hide();
          });
        });
      });
    });
  };
})

.controller('JobDetailCtrl', function($scope, $stateParams, JobService) {
  JobService.get($stateParams.jobId).then(function(job) {
    $scope.job = job;
  });
});

Array.prototype.unique = function() {
  var a = this.concat();

  for (var i=0; i<a.length; ++i) {
    for (var j=i+1; j<a.length; ++j) {
      if (JSON.stringify(a[i]) === JSON.stringify(a[j])) {
        a.splice(j, 1);
      }
    }
  }

  return a;
};
