import { Sequelize, DataTypes } from 'sequelize';
import { sequelize } from '../database/db.js';

export class Trip extends Sequelize.Model {}
Trip.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  destination: {
    type: DataTypes.STRING,
    allowNull: false
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  comment: {
    type: DataTypes.TEXT
  }
}, {
  sequelize,
  modelName: 'Trip'
});
