angular.module('wj.controllers', [])

.controller('MenuCtrl', function($rootScope, $ionicLoading, Jobs) {
  $ionicLoading.show({template: 'Loading'});

  Jobs.all().then(function(jobs) {
    $rootScope.jobs = jobs;
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
