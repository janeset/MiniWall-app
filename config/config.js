require('dotenv/config'); // Load environment variables from .env file

module.exports = {
    PORT: process.env.PORT || 3000, //default to 3000 if PORT is not defined in .env
    DB_CONNECTION: process.env.DB_CONNECTION,
    DB_NAME: process.env.DB_NAME,
    TOKEN_SECRET: process.env.TOKEN_SECRET
};