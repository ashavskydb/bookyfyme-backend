import { Sequelize, Dialect } from 'sequelize';
import dotenv from 'dotenv';
import { config } from '../config/consts';

dotenv.config();

const dialect: Dialect = 'postgres';

export const sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  dialect: dialect,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, 
    },
  },
});