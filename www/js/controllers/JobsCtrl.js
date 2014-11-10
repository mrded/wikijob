'use strict';

angular.module('wj.controllers').controller('JobsCtrl', function($rootScope, $scope, $ionicLoading, $http, JobService, IndustryService, CompanyService, PouchService) {
  $scope.reload = function() {
    $ionicLoading.show({template: 'Download jobs'});
    $rootScope.jobs = [];
    $rootScope.industries = [];

    // Reset database.
    PouchService.reset().then(function() {

      // http://www.wikijob.co.uk/api/companies
      $http.get('/mocks/companies.json').success(function(response) {
        console.log('** Downloaded ' + response.length + ' companies **');

        var companies = response.map(function(company) {
          company['_id'] = company.id;
          company.type = 'company';

          return company;
        });

        CompanyService.save(companies);
      });

      // http://www.wikijob.co.uk/api/industries
      $http.get('/mocks/industries.json').success(function(response) {
        console.log('** Downloaded ' + response.length + ' industries **');

        var industries = response.map(function(industry) {
          industry['_id'] = industry.id;
          industry.type = 'industry';

          return industry;
        });

        IndustryService.save(industries).then(function() {
          IndustryService.all().then(function(industries) {
            $rootScope.industries = industries;
          });
        });
      });

      // http://www.wikijob.co.uk/api/jobs
      $http.get('/mocks/jobs.json').success(function(response) {
        console.log('** Downloaded ' + response.length + ' jobs **');

        var jobs = response.map(function(job) {
          job['_id'] = job.id;
          job.type = 'job';
          job.industry_ids = job.industry_ids.split(", ");

          return job;
        });

        JobService.save(jobs).then(function() {
          JobService.all().then(function(jobs) {
            $rootScope.jobs = jobs;

            $ionicLoading.hide();
          });
        });
      });
    });
  };
});
