var Q = require('q');
var db = require('../db');
var passwordService = require('../../service/password');

var database = db.user;

module.exports = {

    get: function(userId){
        var deferred = Q.defer();
        database.get(userId, {
            include_docs: true
        }, function (err, doc) {
            if(err){
                deferred.reject(err);
            }else{
                deferred.resolve(doc);
            }
        });
        return deferred.promise;
    },

    update: function (user) {
        var deferred = Q.defer();
        database.save(user._id, user, function (err) {
            if(err){
                deferred.reject(err);
            }else {
                deferred.resolve(user);
            }
        });
        return deferred.promise;
    },

    create: function (user) {
        var deferred = Q.defer();
        database.save(user, function (err, res) {
            if(err){
                deferred.reject(err);
            }else {
                user.id = res.id;
                deferred.resolve(user);
            }
        });
        return deferred.promise;
    },

    findByEmail: function (email) {
        var deferred = Q.defer();
        database.view('user/by_email', {
            key: email || ''
        }, function (err, res) {
            if(err){
                deferred.reject(err);
            }else{
                deferred.resolve(res[0] ? res[0].value : null);
            }
        });
        return deferred.promise;
    },

    getSocialIdByType : function(userId, type){
        var deferred = Q.defer();
        this.get(userId).then(function(user){
            var socials = user.socials.filter(function(social){
                return social.type === type;
            });
            if(socials.length > 0){
                deferred.resolve(socials[0].id);
            }else{
                deferred.reject();
            }
        }, deferred.reject);
        return deferred.promise;
    },

    getUsersBySocial: function(id, type){
        var deferred = Q.defer();
        database.view('user/by_social', {
            key: [id, type]
        }, function (err, res) {
            if(err){
                deferred.reject(err);
            }else{
                deferred.resolve(res.map(function(item){
                    return item.value;
                }));
            }
        });
        return deferred.promise;
    }
};
