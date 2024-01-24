require('dotenv').config();

const config = {
    db: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT || 3306,
        database: process.env.DB_NAME,
        connectTimeout: 60000
    },
    listPerPage: process.env.LIST_PER_PAGE || 10,
}
module.exports = config;
