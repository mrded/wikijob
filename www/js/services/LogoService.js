'use strict';

angular.module('wj.services').factory('LogoService', function($q) {
  //@TODO: Save attachments.
  var _getLogos = function(jobs) {
    return jobs.map(function(job) {
      return {
        _id: job.company,
        type: 'logo',
        path: job.logo
      }
    }).unique();
  };

  return {
    all: function() {},
    save: function() {}
  };
});



