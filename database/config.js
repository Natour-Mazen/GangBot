const { Sequelize } = require("sequelize");
require("dotenv").config(); // Load .env file

let alreadyInitialized = false;
let sequelize;
let models;

async function initDatabase() {
  // Config Sequelize for PostgreSQL
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      dialect: "postgres",
      port: process.env.DB_PORT, // Optional, default: 5432
    }
  );

  try {
    await sequelize.authenticate();
    console.log("Connection to database has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    process.exit(1);
  }

  const initModels = require("./models/init-models");
  models = initModels(sequelize);

  alreadyInitialized = true;
}

async function getDatabase() {
  if (!alreadyInitialized) {
    await initDatabase();
  }
  return { sequelize, models };
}

module.exports = getDatabase;
