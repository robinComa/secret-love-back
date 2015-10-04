var Q = require('q');
var db = require('../db');

var MeDao = require('./me');

var database = db.dialog;

var getSocialIdByType = function(userId, type){
    var deferred = Q.defer();
    MeDao.get(userId).then(function(user){
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
};

module.exports = {
    /**
     * map :
     *  function (doc) {
	 *      var who = [doc.who.id, doc.to.id].sort();
	 *      emit(who, {
	 *          who: doc.who.id,
	 *          when: doc.when,
	 *          what: doc.what
	 *      });
     *  }
     * reduce :
     *  function(key, values, rereduce){
	 *      return values;
     *  }
     * */
    query: function(userId, type, id){
        var deferred = Q.defer();
        getSocialIdByType(userId, type).then(function(mySocialId){
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
        getSocialIdByType(userId, dialog.to.type).then(function(mySocialId){
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