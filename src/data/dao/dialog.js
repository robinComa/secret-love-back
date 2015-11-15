var Q = require('q');
var db = require('../db');

var MeDao = require('./me');

var database = db.dialog;

module.exports = {
    query: function(userId, type, id){
        var deferred = Q.defer();
        MeDao.getSocialIdByType(userId, type).then(function(mySocialId){
            database.view('dialogs/by_user', {
                key: [mySocialId, id].sort()
            }, function (err, res) {
                if(err){
                    deferred.reject(err);
                }else{
                    var dialogs = res[0]? res[0].value: [];
                    deferred.resolve(dialogs.map(function(item){
                        return {
                            me: item.who === mySocialId,
                            when: item.when,
                            what: item.what
                        };
                    }));
                }
            });
        }, deferred.reject);
        return deferred.promise;
    },
    create: function (userId, dialog) {
        var deferred = Q.defer();
        MeDao.getSocialIdByType(userId, dialog.to.type).then(function(mySocialId){
            var me = {
                id: mySocialId,
                type: dialog.to.type
            };
            var model = {
                who: me,
                to: dialog.to,
                when: new Date().getTime(),
                what: dialog.what
            };
            database.save(model, function(err, doc){
                if(err){
                    deferred.reject(err);
                }else {
                    deferred.resolve(model);
                }
            });
        }, deferred.reject);
        return deferred.promise;
    }
};
