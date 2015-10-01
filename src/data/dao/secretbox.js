var Q = require('q');
var db = require('../db');
var meDao = require('./me');

var database = db.user;

var createSecretFromDto = function(secret){
    var doc = {
        friend: {
            id: secret.id,
            type: secret.type,
            inLove: false,
            hasNews: false,
            verified: false
        },
        lastUpdate: new Date().getTime()
    };
    return doc;
};
var updateSecretStatus = function(user, secret){
  return secret;
};

module.exports = {
    query: function(userId){
        var deferred = Q.defer();
        meDao.get(userId).then(function(doc){
            deferred.resolve(doc.secretbox || []);
        }).catch(deferred.reject);
        return deferred.promise;
    },
    create: function (userId, secret) {
        var deferred = Q.defer();
        meDao.get(userId).then(function(doc){
            secret = createSecretFromDto(secret);
            secret = updateSecretStatus(doc, secret);
            doc.secretbox.push(secret);
            database.save(userId, doc, function(err, response){
                if(err){
                    deferred.reject(err);
                }else {
                    deferred.resolve(secret);
                }
            });
        }).catch(deferred.reject);
        return deferred.promise;
    },
    delete: function (userId, type, id) {
        var deferred = Q.defer();
        meDao.get(userId).then(function(doc){
            if(!doc.secretbox){
                deferred.reject();
            }
            doc.secretbox = doc.secretbox.filter(function(secret){
                return secret.friend.id !== id || secret.friend.type !== type;
            });
            database.save(userId, doc, function(err, response){
                if(err){
                    deferred.reject(err);
                }else {
                    deferred.resolve();
                }
            });
        }).catch(deferred.reject);
        return deferred.promise;
    }
};