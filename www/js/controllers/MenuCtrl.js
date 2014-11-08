'use strict';

angular.module('wj.controllers').controller('MenuCtrl', function($rootScope, $scope, $ionicLoading, JobService) {
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
});
