angular.module('wj.controllers', [])

.controller('JobsCtrl', function($rootScope, $scope, $ionicLoading, Jobs, DatabaseService) {
  console.log('DatabaseService', DatabaseService);
  
  DatabaseService.then(function(db) {
    alert('works!');
  });
  
  $scope.reload = function() {
    DatabaseService.then(function(db) {
      alert("Doesn't work :(");
    });
  };
  
  $rootScope.jobs = []; 
})

.controller('JobDetailCtrl', function($scope, $stateParams, Jobs) {
  Jobs.get($stateParams.jobId).then(function(job) {
    $scope.job = job;
  });
});
