'use strict';

angular.module('wj.services').factory('CompanyService', function($q, PouchService) {
  return {
    all: function() {
      var deferred = $q.defer();

      PouchService.db().query(function(doc) { emit(doc.type); }, {key: 'company', include_docs: true, attachments: true}, function(err, response) {
        if (err) console.log('Cannot load companies', err);

        deferred.resolve(response.rows.map(function(row) {
          return row.doc;
        }));
      });

      return deferred.promise;
    },

    get: function(companyId) {
      var deferred = $q.defer();

      PouchService.db().get(companyId, {attachments: true}, function(err, response) {
        if (err) console.log('Cannot get the company', err);

        deferred.resolve(response);
      });

      return deferred.promise;
    },

    save: function(companies) {
      var deferred = $q.defer();

      PouchService.db().bulkDocs({docs: companies}, function(err, response) {
        if (err) console.log('Cannot save companies', err);

        // Add attachments.
        angular.forEach(response, function(doc) {
          convertImgToBase64('/mocks/300x150.gif', function(base64Img) {
            PouchService.db().putAttachment(doc.id, 'logo', doc.rev, base64Img, 'image/png', function(err) {
              if (err) console.log('Cannot save attachment', err);
            });
          });
        });

        deferred.resolve(response);
      });

      return deferred.promise;
    }
  };
});
