var Q = require('q');

var service = {
    send: function(to, cc, cci, object, content){
        var deferred = Q.defer();
        setTimeout(function(){
            console.log(to, cc, cci, object, content);
            deferred.resolve();
        }, 1000);
        return deferred.promise;
    }
};

module.exports = service;