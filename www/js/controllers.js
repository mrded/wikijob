angular.module('wj.controllers', [])

.controller('JobsCtrl', function($rootScope, $scope, Jobs) {
  Jobs.all().then(function(jobs) {
    $rootScope.jobs = jobs;    
  });
})

.controller('JobDetailCtrl', function($scope, $stateParams, Jobs) {
  Jobs.get($stateParams.jobId).then(function(job) {
    $scope.job = job;
  });
});
