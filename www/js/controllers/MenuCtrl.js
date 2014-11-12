'use strict';

angular.module('wj.controllers').controller('MenuCtrl', function($rootScope, $scope, $ionicLoading, JobService, IndustryService, CompanyService) {
  $scope.load = function(industryId) {
    $ionicLoading.show({template: 'Loading'});

    JobService.load(industryId).then(function(jobs) {
      $rootScope.jobs.length = 0;

      angular.forEach(jobs, function(job) {
        CompanyService.get(job.company_id).then(function(company) {
          job.company = company;
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

    JobService.all().then(function(jobs) {
      angular.forEach(jobs, function(job) {
        CompanyService.get(job.company_id).then(function(company) {
          job.company = company;
          $rootScope.jobs.push(job);
        });
      });

      $ionicLoading.hide();
    });
  });
});
