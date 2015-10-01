var express = require('express');
var bodyParser = require('body-parser');
var namespace = require('express-namespace');
var clientSession = require('client-sessions');
var cors = require('cors');
var settings = require('../settings');

var app = express();

app.use(cors(settings.server.cors));

app.use(bodyParser.json());

app.use(clientSession({
    secret: 'HGFU6HGPJHijhhkbYVG865NUHBGfvftrfvtdRFDRD546'
}));

app.use(function(req, res, next) {
    if (req.session && req.session.userId) {
        next();
    } else {
        next();
    }
});

var server = app.listen(settings.server.port, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log("Secret Love API listening at http://%s:%s", host, port);
});

module.exports = app;
