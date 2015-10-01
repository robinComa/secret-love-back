var Q = require('q');
var db = require('../db');
var settings = require('../../settings');
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
        database.temporaryView({
            map: function (doc) {
                emit(doc.email, doc);
            }
        }, function (err, res) {
            if(err){
                deferred.reject(err);
            }else{
                var filterList = res.filter(function(item){
                    return item.key === email;
                });
                deferred.resolve(filterList[0] ? filterList[0].value : null);
            }
        });
        return deferred.promise;
    }
};