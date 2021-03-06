'use strict';
// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('wj', ['ionic', 'wj.controllers', 'wj.services'])

.run(function($ionicPlatform, $ionicLoading, $http) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.constant('JOBS_URL', 'http://www.wikijob.co.uk/api/jobs')

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

    .state('app', {
      url: "/app",
      abstract: true,
      templateUrl: "templates/menu.html",
      controller: 'MenuCtrl'
    })

    // Each tab has its own nav history stack:
    .state('app.jobs', {
      url: '/jobs',
      views: {
        'menuContent' :{
          templateUrl: "templates/jobs.html",
          controller: 'JobsCtrl'
        }
      }
    })
    .state('app.job-detail', {
      url: '/job/:jobId',
      views: {
        'menuContent' :{
          templateUrl: "templates/job-detail.html",
          controller: 'JobDetailCtrl'
        }
      }
    });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/jobs');
});

angular.module('wj.services', []);
angular.module('wj.controllers', []);
