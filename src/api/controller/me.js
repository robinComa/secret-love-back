var Q = require('q');
var MeDao = require('../../data/dao/me');
var mailService = require('../../service/mail');
var passwordService = require('../../service/password');
var Session = require('../session');

module.exports = {

    get: function (userId) {
        var deferred = Q.defer();
        MeDao.get(userId).then(function(model){
            var dto = {
                id: model._id,
                login: model.login,
                email: model.email,
                socials: model.socials,
                pin: model.pin,
                basket: model.basket,
                secretBox: []
            };
            deferred.resolve(dto);
        }).catch(deferred.reject);
        return deferred.promise;
    },

    create: function (user, req) {
        var deferred = Q.defer();
        MeDao.findByEmail(user.email).then(function(u){
            if(!u){
                user.password = passwordService.encodePassword(user.password);
                user.secretBox = [];
                user.socials = [];
                user.pin = '';
                user.basket = {
                    loves: 10
                };
                MeDao.create(user).then(function(u){
                    Session.setUserId(u.id, req).then(function(){
                        deferred.resolve();
                    });
                }, deferred.reject);
            }else{
                deferred.reject({status: 409});
            }
        });
        return deferred.promise;
    },

    update: function (userId, user) {
        var deferred = Q.defer();
        MeDao.get(userId).then(function(u){
            if(u){
                u.login = user.login;
                u.pin = user.pin;
                MeDao.update(u).then(function(){
                    deferred.resolve(user);
                }, deferred.reject);
            }else{
                deferred.reject({status: 404});
            }
        });
        return deferred.promise;
    },

    authenticate: function (user, req) {
        var deferred = Q.defer();
        MeDao.findByEmail(user.email).then(function(u){
            if(u){
                if(passwordService.equals(user.password, u.password)){
                    Session.setUserId(u._id, req).then(function(){
                        deferred.resolve();
                    });
                }else{
                    deferred.reject({status: 403});
                }
            }else{
                deferred.reject({status: 404});
            }
        });
        return deferred.promise;
    },

    logout: function(userId, body, req){
        return Session.reset(userId, req);
    },

    forgotPassword: function (user) {
        var deferred = Q.defer();
        MeDao.findByEmail(user.email).then(function(u){
            if(u){
                var newPassword = passwordService.generatePassword();
                u.password = passwordService.encodePassword(newPassword);
                MeDao.update(u).then(function(){
                    mailService.send(null, null, null, null, newPassword).then(function(){
                        deferred.resolve();
                    });
                }).catch(deferred.reject);
            }else{
                deferred.reject({status: 404});
            }
        });
        return deferred.promise;
    },

    unique: function (user) {
        var deferred = Q.defer();
        MeDao.findByEmail(user.email).then(function(u){
            deferred.resolve({
                unique: !u
            });
        }, deferred.reject);
        return deferred.promise;
    },

    disconnect: function(userId, socialMe){
        var deferred = Q.defer();
        MeDao.get(userId).then(function(u){
            if(u){
                u.socials = u.socials.filter(function(s){
                    return socialMe.type !== s.type;
                });
                MeDao.update(u).then(function(){
                    deferred.resolve();
                }, deferred.reject);
            }else{
                deferred.reject({status: 404});
            }
        });
        return deferred.promise;
    },

    connect: function(userId, socialMe){
        var deferred = Q.defer();
        MeDao.get(userId).then(function(u){
            if(u){
                u.socials.push(socialMe);
                MeDao.update(u).then(function(){
                    deferred.resolve();
                }, deferred.reject);
            }else{
                deferred.reject({status: 404});
            }
        });
        return deferred.promise;
    }
};