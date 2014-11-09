'use strict';

angular.module('wj.services').service('PouchService', function($q) {
  var db_name = 'wikijob';
  var _db = new PouchDB(db_name);

  var WJ = this;

  WJ.db = _db;

  this.reset = function() {
    var deferred = $q.defer();

    _db.destroy(function() {
      _db = new PouchDB(db_name);
      WJ.db = _db;

      deferred.resolve(_db);
    });

    return deferred.promise;
  };
});
