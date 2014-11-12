'use strict';

angular.module('wj.controllers').controller('JobsCtrl', function(
  $rootScope, $scope, $ionicLoading, $http,
  JobService, IndustryService, CompanyService, PouchService,
  JOBS_URL, COMPANIES_URL, INDUSTRIES_URL) {
  $scope.reload = function() {
    $ionicLoading.show({template: 'Download jobs'});
    $rootScope.jobs = [];
    $rootScope.industries = [];

    // Reset database.
    PouchService.reset().then(function() {
      $http.get(COMPANIES_URL).success(function(response) {
        console.log('** Downloaded ' + response.length + ' companies **');

        var companies = response.map(function(company) {
          company['_id'] = company.id;
          company.type = 'company';

          return company;
        });

        CompanyService.save(companies);
      });

      $http.get(INDUSTRIES_URL).success(function(response) {
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

      $http.get(JOBS_URL).success(function(response) {
        console.log('** Downloaded ' + response.length + ' jobs **');

        var jobs = response.map(function(job) {
          job['_id'] = job.id;
          job.type = 'job';
          job.industry_ids = job.industry_ids.split(", ");

          return job;
        });

        JobService.save(jobs).then(function() {
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
    });
  };
});
