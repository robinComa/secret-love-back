var Q = require('q');

var service = {
    send: function(to, cc, cci, object, content){
        var deferred = Q.defer();
        console.log(to, cc, cci, object, content);
        deferred.resolve();
        return deferred.promise;
    }
};

module.exports = service;