'use strict';

angular.module('wj.controllers').controller('JobsCtrl', function($rootScope, $scope, $ionicLoading, $http, JobService, PouchService) {
  $scope.reload = function() {
    $ionicLoading.show({template: 'Download jobs'});
    $rootScope.jobs = [];
    $rootScope.industries = [];

    //$http.get('http://www.wikijob.co.uk/api/jobs').success(function(jobs) {
    $http.get('/jobs.json').success(function(response) {
      console.log('** Downloaded ' + response.length + ' jobs **');

      var _jobs = response.map(function(job) {
        job['_id'] = job.id;
        job.type = 'job';
        job.job_role = job.job_role.split("\n");

        return job;
      });

      // Reset database.
      PouchService.reset().then(function(db) {
        JobService.save(_jobs, db).then(function() {
          JobService.all(db).then(function(jobs) {
            $rootScope.jobs = jobs;

            // Reload menu.
            angular.forEach(jobs, function(job) {
              $rootScope.industries = $rootScope.industries.concat(job.job_role).unique().filter(Boolean);
            });

            $ionicLoading.hide();
          });
        });
      });
    });
  };
});
