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

.controller('JobsCtrl', function($rootScope, $scope, $ionicLoading, JobService) {
  $scope.reload = function() {
    $ionicLoading.show({template: 'Download jobs'});

    JobService.reload().then(function(jobs) {
      $rootScope.jobs.length = 0;

      // Reload menu.
      angular.forEach(jobs, function(job) {
        $rootScope.jobs.push(job);
        $rootScope.industries = $rootScope.industries.concat(job.job_role).unique().filter(Boolean);
      });

      $ionicLoading.hide();
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
