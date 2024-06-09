import { Sequelize, DataTypes } from 'sequelize';
import { sequelize } from '../database/db.js';

export class Bandsintown extends Sequelize.Model {}
Bandsintown.init({
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
  modelName: 'Bandsintown'
});

export default Bandsintown;