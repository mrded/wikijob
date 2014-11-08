'use strict';

angular.module('wj.controllers').controller('JobDetailCtrl', function($scope, $stateParams, JobService) {
  JobService.get($stateParams.jobId).then(function(job) {
    $scope.job = job;
  });
});
