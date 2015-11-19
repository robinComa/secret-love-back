global.settings = global.settings || require('./settings.json');
var winston = require('winston');
global.LOGGER = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({
      timestamp: function() {
        return new Date(Date.now()).toISOString();
      },
      formatter: function(options) {
        return options.timestamp() +' '+ options.level.toUpperCase() +' '+ (undefined !== options.message ? options.message : '') +
          (options.meta && Object.keys(options.meta).length ? '\n\t'+ JSON.stringify(options.meta) : '' );
      }
    })
  ]
});


LOGGER.info('**************************************************');
LOGGER.info('***********   Bootstrap job started  *************');
LOGGER.info('**************************************************');

require('./data/bootstrap/index').then(function(){

  LOGGER.info('**************************************************');
  LOGGER.info('*********   Bootstrap job terminated  ************');
  LOGGER.info('**************************************************');

  var server = require('./api/server');
  var routes = require('./api/routes');

  routes.init(server);
}, function(error){
  LOGGER.error(error)
});
