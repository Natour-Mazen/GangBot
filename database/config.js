const { Sequelize } = require('sequelize');
require('dotenv').config(); // Load .env file

// Config Sequelize for PostgreSQL
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    port: process.env.DB_PORT, // Optional, default: 5432
});

module.exports = sequelize;
