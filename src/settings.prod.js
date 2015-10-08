const settings = {
    server: {
        port: 80,
        cors: {
            origin: 'http://localhost:9000',
            credentials: true
        }
    },
    database: {
        domain: 'http://ec2-52-18-20-168.eu-west-1.compute.amazonaws.com',
        port: 80,
        name: {
            user: 'app_prod_user',
            dialog: 'app_prod_dialog'
        },
        auth: {
            username: 'secret-love',
            password: 'P@$$w0rd'
        }
    }
};

module.exports = settings;