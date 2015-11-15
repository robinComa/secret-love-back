var Q = require('q');
var cradle = require('cradle');
var views = require('./views.json');

var connection = new(cradle.Connection)(settings.database.domain, settings.database.port, {
    auth: settings.database.auth
});

var createView = function(name, map, reduce){
  var deferred = Q.defer();
  setTimeout(function(){
    console.log(name, map, reduce);
    deferred.resolve();
  }, 1000);
  return deferred.promise;
};

var promises = [];
for(var name in views){
  var view = views[name];
  promises.push(createView(name, view.map, view.reduce));
}

module.exports = Q.all(promises);
