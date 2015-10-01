const settings = {
    server: {
        port: 9001,
        cors: {
            origin: 'http://localhost:9000',
            credentials: true
        }
    },
    database: {
        domain: 'http://localhost',
        port: 5984,
        name: {
            user: 'app_dev_user',
            dialog: 'app_dev_dialog'
        },
        auth: {
            username: 'secretlove',
            password: 'P@$$w0rd'
        }
    }
};

module.exports = settings;