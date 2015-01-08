'use strict';

angular.module('wj.controllers').controller('JobsCtrl', function(
  $rootScope, $scope, $ionicLoading, $http,
  JobService, PouchService, IndustryService, JOBS_URL) {

  $ionicLoading.show({template: 'Loading'});

  JobService.all().then(function(jobs) {
    if (jobs.length > 1) {
      $rootScope.jobs = jobs;

      IndustryService.all().then(function(industries) {
        $rootScope.industries = industries;
        $ionicLoading.hide();
      });
    }
    else $scope.reload();
  });

  $scope.reload = function() {
    $ionicLoading.show({template: 'Downloading'});
    $rootScope.jobs = [];
    $rootScope.industries = [];

    // Reset database.
    PouchService.reset().then(function() {
      $http.get(JOBS_URL).success(function(jobs) {
        console.log('** Downloaded ' + jobs.length + ' jobs **');

        JobService.save(jobs).then(function() {
          JobService.all().then(function(jobs) {
            $rootScope.jobs = jobs;

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
