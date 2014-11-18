'use strict';

angular.module('wj.controllers').controller('MenuCtrl', function($rootScope, $scope, $ionicLoading, JobService, IndustryService) {
  $scope.load = function(industryId) {
    $ionicLoading.show({template: 'Loading'});

    JobService.load(industryId).then(function(jobs) {
      $rootScope.jobs.length = 0;

      //@TODO: refactor loading of logo.
      angular.forEach(jobs, function(job) {
        JobService.getLogo(job.id).then(function(logo) {
          job.logo = logo;

          $rootScope.jobs.push(job);
        });
      });

      $ionicLoading.hide();
    });
  };

  $ionicLoading.show({template: 'Loading'});
  $rootScope.jobs = [];

  IndustryService.all().then(function(industries) {
    $rootScope.industries = industries;
  });

  JobService.all().then(function(jobs) {

    //@TODO: refactor loading of logo.
    angular.forEach(jobs, function(job) {
      JobService.getLogo(job.id).then(function(logo) {
        job.logo = logo;

        $rootScope.jobs.push(job);
      });
    });

    $ionicLoading.hide();
  });
});
