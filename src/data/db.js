var cradle = require('cradle');
var settings = require('../settings');

var connection = new(cradle.Connection)(settings.database.domain, settings.database.port, {
    auth: settings.database.auth
});

var getDatabase = function(name){
    var db = connection.database(name);

    db.exists(function (err, exists) {
        if (err) {
            console.log('error', err);
        } else if (exists) {
            console.info('Database %s connection ok.', name);
        } else {
            console.error('Database %s does not exists.', name);
        }
    });
    return db;
};

module.exports = {
    user: getDatabase(settings.database.name.user),
    dialog: getDatabase(settings.database.name.dialog)
};