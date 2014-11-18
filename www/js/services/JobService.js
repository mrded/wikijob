'use strict';

angular.module('wj.services').factory('JobService', function($http, $q, PouchService, ENV) {
  return {
    all: function() {
      var deferred = $q.defer();

      PouchService.db().query(function(doc) { emit(doc.type); }, {key: 'job', include_docs: true, attachments: true}, function(err, response) {
        if (err) console.log('Cannot load jobs', err);

        deferred.resolve(response.rows.map(function(row) {
          return row.doc;
        }));
      });

      return deferred.promise;
    },

    load: function(industry) {
      var deferred = $q.defer();

      var map = function(doc) {
        if (doc.type === 'job') {
          for (var i = 0; i < doc.industries.length; ++i) {
            emit(doc.industries[i]);
          }
        }
      };

      PouchService.db().query(map, {key: industry, include_docs: true, attachments: true}, function(err, response) {
        if (err) console.log('Cannot get jobs by industry', err);

        deferred.resolve(response.rows.map(function(row) {
          return row.doc;
        }));
      });

      return deferred.promise;
    },

    get: function(jobId) {
      var deferred = $q.defer();

      PouchService.db().get(jobId, {attachments: true}, function(err, response) {
        if (err) console.log('Cannot get the job', jobId, err);

        deferred.resolve(response);
      });

      return deferred.promise;
    },

    save: function(jobs) {
      var deferred = $q.defer();

      angular.forEach(jobs, function(job) {
        job['_id'] = job.id;
        job.type = 'job';

        job.industries = job.industries.split(',');

        // Add attachments.
        var logo = (ENV === 'dev') ? '/mocks/300x150.gif' : job.logo;
        convertImgToBase64(logo, function(base64Img) {
          job['_attachments'] = {
            "logo": {
              "content_type": 'image/png',
              "data": base64Img
            }
          };

          PouchService.db().post(job, function(err) {
            if (err) console.log('Cannot save the job', job, err);
          });
        });
      });

      deferred.resolve();

      return deferred.promise;
    }
  };
});
