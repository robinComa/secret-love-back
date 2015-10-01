var DialogDao = require('../../data/dao/dialog');

module.exports = {
    query: function (userId, dialog) {
        return DialogDao.query(userId, dialog.type, dialog.id);
    },
    create: function (userId, dialog) {
        return DialogDao.create(userId, dialog);
    }
};