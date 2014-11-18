'use strict';

angular.module('wj.controllers').controller('MenuCtrl', function($rootScope, $scope, $ionicLoading, JobService, IndustryService) {
  $scope.load = function(industryId) {
    $ionicLoading.show({template: 'Loading'});

    JobService.load(industryId).then(function(jobs) {
      $rootScope.jobs = jobs;
      $ionicLoading.hide();
    });
  };

  $ionicLoading.show({template: 'Loading'});
  $rootScope.jobs = [];

  IndustryService.all().then(function(industries) {
    $rootScope.industries = industries;
  });

  JobService.all().then(function(jobs) {
    angular.forEach(jobs, function(job) {
      JobService.getLogo(job.id).then(function(logo) {
        job.logo = logo;

        $rootScope.jobs.push(job);
      });
    });

    $ionicLoading.hide();
  });
});
