import { Sequelize } from 'sequelize';
import { config } from './config.js';

export const sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  port: config.port,
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: config.useSSL,
      rejectUnauthorized: config.rejectUnauthorized
    }
  },
  logging: config.logging
});
