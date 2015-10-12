var Session = require('./session');

var errorHandler = function(res, error){
    var status = 500;
    if(error.headers){ // CouchBD error
        status = error.headers.status;
    } else if(error.status){ // App error
        status = error.status;
    }
    console.error(error);
    res.status(status).end();
};

module.exports = {
    unknown: function(controller) {
        return function(req, res){
            controller(req.body, req).then(function (response) {
                res.status(200).json(response).end();
            }).catch(function(error){
                errorHandler(res, error);
            });
        };
    },
    auth: function(controller) {
        return function (req, res) {
            Session.getUserId(req).then(function(userId){
                var input = req.body;
                if(Object.keys(input).length === 0){
                    input = req.params;
                }
                controller(userId, input, req).then(function (response) {
                    res.status(200).json(response).end();
                }).catch(function(error){
                    errorHandler(res, error);
                });
            }).catch(function(error){
                errorHandler(res, error);
            });
        }
    }
};