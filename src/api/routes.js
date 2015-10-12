var HttpHandler = require('./http-handler');
var MeController = require('./controller/me');
var SecretBoxController = require('./controller/secretbox');
var DialogController = require('./controller/dialog');
var ViadeoController = require('./controller/viadeo');

module.exports = {
    init: function(app){

        app.namespace('/rest-api', function () {

            app.get(    '/me',                      HttpHandler.auth(MeController.get));
            app.put(    '/me',                      HttpHandler.auth(MeController.update));
            app.post(   '/me',                      HttpHandler.unknown(MeController.create));
            app.post(   '/me/authenticate',         HttpHandler.unknown(MeController.authenticate));
            app.get(    '/me/logout',               HttpHandler.auth(MeController.logout));
            app.post(   '/me/forgot-password',      HttpHandler.unknown(MeController.forgotPassword));
            app.post(   '/me/unique',               HttpHandler.unknown(MeController.unique));
            app.put(    '/me/disconnect',           HttpHandler.auth(MeController.disconnect));
            app.post(   '/me/connect',              HttpHandler.auth(MeController.connect));

            app.get(    '/secretbox',               HttpHandler.auth(SecretBoxController.query));
            app.post(   '/secretbox',               HttpHandler.auth(SecretBoxController.create));
            app.delete( '/secretbox/:type/:id',     HttpHandler.auth(SecretBoxController.delete));

            app.get(    '/dialogs/:type/:id',       HttpHandler.auth(DialogController.query));
            app.post(   '/dialogs',                 HttpHandler.auth(DialogController.create));

            app.post(   '/proxy/viadeo-friends',    HttpHandler.auth(ViadeoController.getFriends));
            app.post(   '/proxy/viadeo-me',         HttpHandler.auth(ViadeoController.getMe));

        });

    }
};