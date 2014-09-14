angular.module('wj.controllers', [])

.controller('JobsCtrl', function($rootScope, $scope, $ionicLoading, Jobs) {
  $ionicLoading.show({template: 'Download jobs'});
  
  Jobs.reload().then(function() {
    $ionicLoading.show({template: 'Load jobs'});
    
    Jobs.all().then(function(jobs) {
      $rootScope.jobs = jobs;
      $ionicLoading.hide();
    });
  });
  
})

.controller('JobDetailCtrl', function($scope, $stateParams, Jobs) {
  Jobs.get($stateParams.jobId).then(function(job) {
    $scope.job = job;
  });
});
