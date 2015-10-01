var bcrypt = require('bcrypt-nodejs');
var passwordGenerator = require('password-generator');

var service = {
    encodePassword : function(password){
        return bcrypt.hashSync(password);
    },
    generatePassword : function(){
        return passwordGenerator(8, false, /[A-Za-z0-9]/);
    },
    equals: function(password, hash){
        return bcrypt.compareSync(password, hash);
    }
};

module.exports = service;