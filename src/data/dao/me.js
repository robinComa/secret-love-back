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

    /**
     * map :
     *  function (doc) {
	 *      emit(doc.email, doc);
     *  }
     * */
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
    }
};