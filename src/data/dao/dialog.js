var Q = require('q');
var db = require('../db');

var database = db.dialog;

var getSocialIdByType = function(type){
    return 'jojijijijioj';
};

module.exports = {
    query: function(userId, dialog){
        var deferred = Q.defer();
        database.temporaryView({
            map: function(doc) {
                var who = [doc.who.id, doc.to.id].sort();
                emit(who, {
                    when: doc.when,
                    what: doc.what
                });
            },
            reduce: function(keys, values, rereduce){
                return values;
            },
            key: [getSocialIdByType(dialog.type), dialog.id].sort().toString()
        }, function (err, res) {
            if(err){
                deferred.reject(err);
            }else{
                deferred.resolve((res[0] && res[0].value) || res);
            }
        });
        return deferred.promise;
    },
    create: function (userId, dialog) {
        var deferred = Q.defer();
        console.log(dialog)
        var me = {
            id: getSocialIdByType(dialog.to.type),
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
        return deferred.promise;
    }
};