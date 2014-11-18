'use strict';

angular.module('wj.services').factory('IndustryService', function($q, PouchService) {
  return {
    all: function() {
      var deferred = $q.defer();

      PouchService.db().query(function(doc) { emit(doc.type); }, {key: 'job', include_docs: true}, function(err, response) {
        if (err) console.log('Cannot load industries', err);

        var industies = [];

        for (var i=0; i<response.rows.length; ++i) {
          for (var j=0; j<response.rows[i].doc.industries.length; ++j) {
            var industry = response.rows[i].doc.industries[j];

            if ((typeof(industry) == 'string') && (industry.length > 0) && (industies.indexOf(industry) == -1)) {
              industies.push(industry);
            }
          }
        }

        deferred.resolve(industies);
      });

      return deferred.promise;
    },

    save: function(industries) {
      var deferred = $q.defer();

      PouchService.db().bulkDocs({docs: industries}, function(err) {
        if (err) console.log('Cannot save industries', err);

        deferred.resolve();
      });

      return deferred.promise;
    }
  };
});
