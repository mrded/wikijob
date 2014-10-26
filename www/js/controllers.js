angular.module('wj.controllers', [])

.controller('AppCtrl', function() {})

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

  $ionicLoading.show({template: 'Loading'});
  Jobs.all().then(function(jobs) {
    $rootScope.jobs = jobs;
    $ionicLoading.hide();
  });
})

.controller('JobDetailCtrl', function($scope, $stateParams, Jobs) {
  Jobs.get($stateParams.jobId).then(function(job) {
    $scope.job = job;
  });
});
