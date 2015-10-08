const settings = {
    server: {
        port: 3000,
        cors: {
            origin: 'http://localhost:9000',
            credentials: true
        }
    },
    database: {
        domain: 'http://localhost',
        port: 5984,
        name: {
            user: 'app_prod_user',
            dialog: 'app_prod_dialog'
        },
        auth: {
            username: 'secretlove',
            password: 'P@$$w0rd'
        }
    }
};

module.exports = settings;