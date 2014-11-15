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
    $rootScope.jobs = jobs;
    $ionicLoading.hide();
  });
});
