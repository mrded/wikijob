angular.module('wj.controllers', [])

.controller('MenuCtrl', function($rootScope, $scope, $ionicLoading, Jobs) {
  $scope.load = function(industry) {
    $ionicLoading.show({template: 'Loading'});

    Jobs.load(industry).then(function(jobs) {
      $rootScope.jobs = jobs;
      $ionicLoading.hide();
    });
  };

  $ionicLoading.show({template: 'Loading'});

  Jobs.all().then(function(jobs) {
    $rootScope.jobs = jobs;

    $scope.industries = [];
    angular.forEach(jobs, function(job) {
      $scope.industries = $scope.industries.concat(job.job_role).unique().filter(Boolean);
    });

    $ionicLoading.hide();
  });
})

.controller('JobsCtrl', function($rootScope, $scope, $ionicLoading, Jobs) {
  $scope.reload = function() {
    $ionicLoading.show({template: 'Download jobs'});

    Jobs.reload().then(function(jobs) {
      Jobs.all().then(function(jobs) {
        $rootScope.jobs = jobs;
        $ionicLoading.hide();
      });
    });
  };
})

.controller('JobDetailCtrl', function($scope, $stateParams, Jobs) {
  Jobs.get($stateParams.jobId).then(function(job) {
    $scope.job = job;
  });
});

Array.prototype.unique = function() {
  var a = this.concat();

  for (var i=0; i<a.length; ++i) {
    for (var j=i+1; j<a.length; ++j) {
      if (a[i] === a[j]) a.splice(j, 1);
    }
  }

  return a;
};
