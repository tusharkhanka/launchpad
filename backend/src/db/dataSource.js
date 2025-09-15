const { Sequelize } = require('sequelize');
const config = require('../utils/environment');

const AppDataSource = new Sequelize({
  dialect: 'mysql',
  replication: {
    read: [
      {
        host: config.DB_READER_HOST,
        port: Number(config.DB_PORT),
        username: config.DB_USERNAME,
        password: config.DB_PASSWORD,
        database: config.DB_NAME,
      },
    ],
    write: {
      host: config.DB_MASTER_HOST,
      port: Number(config.DB_PORT),
      username: config.DB_USERNAME,
      password: config.DB_PASSWORD,
      database: config.DB_NAME,
    },
  },
  pool: {
    max: Number(config.DB_POOL_MAX) || 10,
    acquire: Number(config.DB_POOL_LOCK_ACQUIRE) || 30000,
  },
  logging: config.DB_LOGGING === 'true' ? console.log : false,
  define: {
    freezeTableName: true, 
    timestamps: true, 
  },
});

module.exports = AppDataSource;
