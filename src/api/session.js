var Q = require('q');

module.exports = {
    getUserId: function(req){
        var deferred = Q.defer();
        setTimeout(function(){
            if(req.session_state && req.session_state.userId){
                deferred.resolve(req.session_state.userId);
            }else{
                deferred.reject({status: 401});
            }
        }, 1);
        return deferred.promise;
    },
    setUserId: function(userId, req){
        var deferred = Q.defer();
        setTimeout(function(){
            req.session_state.userId = userId;
            deferred.resolve();
        }, 1);
        return deferred.promise;
    },
    reset: function(userId, req){
        var deferred = Q.defer();
        setTimeout(function(){
            req.session_state.reset();
            deferred.resolve();
        }, 1);
        return deferred.promise;
    }
};