import { Sequelize, DataTypes } from 'sequelize';
import { sequelize } from '../database/db.js';

export class Ticketm extends Sequelize.Model {}
Ticketm.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  details: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  sequelize,
  modelName: 'Ticketm'
});

export default Ticketm;
