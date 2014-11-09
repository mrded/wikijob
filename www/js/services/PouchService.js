'use strict';

angular.module('wj.services').service('PouchService', function($q) {
  var db_name = 'wikijob';
  var _db = new PouchDB(db_name);

  this.db = function() {
    return _db;
  };

  this.reset = function() {
    var deferred = $q.defer();

    _db.destroy(function() {
      _db = new PouchDB(db_name);

      deferred.resolve(_db);
    });

    return deferred.promise;
  };
});
