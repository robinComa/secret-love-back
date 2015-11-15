global.settings = global.settings || require('./settings.json');


console.log('\n**************************************************');
console.log('***********   Bootstrap job started  *************');
console.log('**************************************************\n');

require('./data/bootstrap/index').then(function(){

  console.log('\n**************************************************');
  console.log('*********   Bootstrap job terminated  ************');
  console.log('**************************************************\n');

  var server = require('./api/server');
  var routes = require('./api/routes');

  routes.init(server);
}, function(error){
  console.error(error)
});
