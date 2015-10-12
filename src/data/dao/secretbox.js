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
    var deferred = Q.defer();
    meDao.getUsersBySocial(secret.friend.id, secret.friend.type).then(function(users){
        Q.all(users.map(function(otherUser){
            secret.friend.verified = true;
            secret.friend.hasNews = true;
            secret.friend.lastUpdate = new Date().getTime();
            for(var i in otherUser.secretbox){
                if(otherUser.secretbox[i].friend.id === secret.friend.id && otherUser[i].friend.type === secret.friend.type){
                    secret.inLove = true;
                    otherUser[i].friend.hasNews = true;
                    otherUser[i].friend.lastUpdate = new Date().getTime();
                    otherUser[i].friend.inLove = true;
                    return meDao.update(otherUser);
                }
            }
            return Q.when();
        })).then(function(){
            deferred.resolve(secret);
        }, deferred.reject);
    }, deferred.reject);
    return deferred.promise;
};
/**
 * map :
 * function(doc) {
 *  doc.secretbox.forEach(function(secret){
 * 		emit([secret.friend.id, secret.friend.type], doc);
 *	});
 * }
 * */
var informIamVerified = function(socialMe){
    var deferred = Q.defer();
    database.view('secretbox/loves', {
        key: [socialMe.id, socialMe.type]
    }, function (err, res) {
        if(err){
            deferred.reject(err);
        }else{
            var subPromises = [];
            res.forEach(function(item){
                var user = item.value;
                for(var i in user.secretbox){
                    var otherSecret = user.secretbox[i];
                    if(otherSecret.id === socialMe.id && otherSecret.type === socialMe.type){
                        otherSecret.friend.hasNews = true;
                        otherSecret.friend.lastUpdate = new Date().getTime();
                        otherSecret.friend.verified = true;
                        subPromises.push(meDao.update(user));
                        break;
                    }
                }
            });
            Q.all(subPromises).then(deferred.resolve, deferred.reject);
        }
    });
    return deferred.promise;
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
            updateSecretStatus(doc, secret).then(function(updatedSecret){
                doc.secretbox.push(updatedSecret);
                deferred.resolve({
                    doc: doc,
                    res: doc.secretbox
                });
                database.save(userId, doc, function(err, response){
                    if(err){
                        deferred.reject(err);
                    }else {
                        deferred.resolve(updatedSecret);
                    }
                });
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
    },
    informIamVerified: informIamVerified
};