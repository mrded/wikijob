angular.module('wj.controllers', [])

.controller('JobsCtrl', function($rootScope, $scope, Jobs) {
  $scope.jobs = [];
})

.controller('JobDetailCtrl', function($scope, $stateParams, Jobs) {
  Jobs.get($stateParams.jobId).then(function(job) {
    $scope.job = job;
  });
});
