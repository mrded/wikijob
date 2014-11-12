'use strict';

angular.module('wj.services').factory('CompanyService', function($q, PouchService, ENV) {
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
      angular.forEach(companies, function(company) {
        var logo = (ENV === 'dev') ? '/mocks/300x150.gif' : company.logo;

        // Add attachments.
        convertImgToBase64(logo, function(base64Img) {
          company['_attachments'] = {
            "logo": {
              "content_type": 'image/png',
              "data": base64Img
            }
          };

          PouchService.db().post(company, function(err) {
            if (err) console.log('Cannot save the company', err);
          });
        });
      });
    }
  };
});
