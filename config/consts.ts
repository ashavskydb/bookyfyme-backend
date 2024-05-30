import { Dialect } from 'sequelize';

export const config = {
  database: process.env.DB_NAME || 'your_db_name',
  username: process.env.DB_USER || 'your_db_user',
  password: process.env.DB_PASS || 'your_db_password',
  host: process.env.DB_HOST || 'your_db_host',
  dialect: 'postgres' as Dialect,
  jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret',
};

