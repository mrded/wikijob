'use strict';

angular.module('wj.controllers').controller('MenuCtrl', function($rootScope, $scope, $ionicLoading, JobService, IndustryService) {

  $scope.all = function() {
    $ionicLoading.show({template: 'Loading'});

    JobService.all().then(function(jobs) {
      $rootScope.jobs = jobs;
      $ionicLoading.hide();
    }, function() {
      $ionicLoading.hide();
    });
  };

  $scope.load = function(industryId) {
    $ionicLoading.show({template: 'Loading'});

    JobService.load(industryId).then(function(jobs) {
      $rootScope.jobs = jobs;
      $ionicLoading.hide();
    });
  };
});
