var Q = require('q');
var requestify = require('requestify');

var getCookies = function(login, password){
    var deferred = Q.defer();
    requestify.request('https://secure.viadeo.com/fr/signin', {
        method: 'POST',
        body: {
            email: login,
            password: password
        },
        dataType: 'form-url-encoded'
    }).then(deferred.reject, function(err){
        if(err.code === 200 || err.code === 302){
            var cookies = err.headers['set-cookie'];
            deferred.resolve(cookies);
        }else{
            deferred.reject(err);
        }
    });
    return deferred.promise;
};

module.exports = {

    getFriends: function (user, req) {
        var deferred = Q.defer();
        console.log(req)
        getCookies(req.login, req.password).then(function(cookies){
            requestify.request('http://www.viadeo.com/r/addressbook/search/', {
                method: 'GET',
                params: {
                    type: 'contact',
                    maxResults: 120,
                    pageNumber: 1
                },
                cookies: cookies
            }).then(function(response){
                var contacts = response.getBody().contacts;
                deferred.resolve(Array.isArray(contacts) ? contacts: [contacts]);
            }, deferred.reject);
        }, deferred.reject);
        return deferred.promise;
    },

    getMe: function(user, req){
        var deferred = Q.defer();
        getCookies(req.login, req.password).then(function(cookies){
            var id = '008ujwnigufe1xb';
            requestify.request('http://www.viadeo.com/v/miniProfile?memberId=' + id, {
                method: 'GET',
                cookies: cookies,
                dataType: 'json'
            }).then(function(response){
                var data = response.getBody().data;
                for(var i in data){
                    var me = data[i];
                    deferred.resolve({
                        id: me.memberId,
                        name: me.fullName,
                        picture: me.photoUrl
                    });
                    break;
                }
            }, deferred.rejec);
        }, deferred.reject);
        return deferred.promise;
    }
};