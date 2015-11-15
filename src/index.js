global.settings = global.settings || require('./settings.json');

var bootstrap = require('./data/bootstrap/index');

bootstrap.then(function(){
  var server = require('./api/server');
  var routes = require('./api/routes');

  routes.init(server);
});
