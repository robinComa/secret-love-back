var Q = require('q');
var fs = require('fs');
var cradle = require('cradle');
var dbSettings = require('./db-settings.json');

var connection = new(cradle.Connection)(settings.database.domain, settings.database.port, {
    auth: settings.database.auth
});

var createViews = function(db, alias, views){
  var deferred = Q.defer();
  for(var name in views){
    views[name].map = fs.readFileSync(views[name].map, 'utf8');
    if(views[name].reduce){
      views[name].reduce = fs.readFileSync(views[name].reduce, 'utf8');
    }
  }
  db.save('_design/' + alias, views, function(err){
    if(err){
      deferred.reject();
    }else{
      for(var name in views){
        console.info('View %s was created into %s database.', name, databaseAlias);
      }
      deferred.resolve();
    }
  });
  return deferred.promise;
};

var createDesign = function(db, views){
  var designPromises = [];
  for(var alias in views){
    designPromises.push(createViews(db, alias, views[alias]));
  }
  return Q.all(designPromises);
};

var createDatabase = function(alias, config){
  var databaseName = settings.database.name[alias];
  var deferred = Q.defer();
  var db = connection.database(databaseName);

  db.exists(function (err, exists) {
    if (err) {
        console.error('Fail to connect the database %s" : \n', databaseName, err);
        deferred.reject();
    } else if (exists) {
        console.info('Database %s already exist.', databaseName);
        createDesign(db, config.views).then(deferred.resolve, deferred.reject);
    } else {
        console.error('Database %s does not exists.', databaseName);
        db.create(function(){
          console.error('Database %s was created.', databaseName);
          createDesign(db, config.views).then(deferred.resolve, deferred.reject);
        }, deferred.reject);
    }
  });
  return deferred.promise;
};

var databasesPromises = [];
for(var databaseAlias in dbSettings){
  databasesPromises.push(createDatabase(databaseAlias, dbSettings[databaseAlias]));
}

module.exports = Q.all(databasesPromises);
