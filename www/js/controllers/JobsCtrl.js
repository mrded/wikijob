'use strict';

angular.module('wj.controllers').controller('JobsCtrl', function(
  $rootScope, $scope, $ionicLoading, $http,
  JobService, PouchService, IndustryService, JOBS_URL) {

  $scope.reload = function() {
    $ionicLoading.show({template: 'Download jobs'});
    $rootScope.jobs = [];
    $rootScope.industries = [];

    // Reset database.
    PouchService.reset().then(function() {
      $http.get(JOBS_URL).success(function(jobs) {
        console.log('** Downloaded ' + jobs.length + ' jobs **');

        JobService.save(jobs).then(function() {
          JobService.all().then(function(jobs) {
            $rootScope.jobs.length = 0;

            //@TODO: refactor loading of logo.
            angular.forEach(jobs, function(job) {
              JobService.getLogo(job.id).then(function(logo) {
                job.logo = logo;

                $rootScope.jobs.push(job);
              });
            });

            IndustryService.all().then(function(industries) {
              $rootScope.industries = industries;
              $ionicLoading.hide();
            });
          });
        });
      });
    });
  };
});
