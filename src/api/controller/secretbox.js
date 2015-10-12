var Q = require('q');
var SecretBoxDao = require('../../data/dao/secretbox');
var MeDao = require('../../data/dao/me');

module.exports = {
    query: function (userId) {
        return SecretBoxDao.query(userId);
    },
    create: function (userId, secret) {
        var deferred = Q.defer();
        SecretBoxDao.create(userId, secret).then(function(secret){
            MeDao.get(userId).then(function(user){
                var loves = user.basket.loves;
                if(loves > 0){
                    user.basket.loves = loves -1;
                    MeDao.update(user).then(function(){
                        deferred.resolve(secret);
                    });
                }else{
                    deferred.reject();
                }
            });
        }).catch(deferred.reject);
        return deferred.promise;
    },
    delete: function (userId, secret) {
        return SecretBoxDao.delete(userId, secret.type, secret.id);
    }
};