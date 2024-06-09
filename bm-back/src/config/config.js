import dotenv from 'dotenv';
dotenv.config();

export const config = {
  database: process.env.PGDATABASE,
  jwtSecret: process.env.JWT_SECRET,
  dialect: 'postgres',
  useSSL: process.env.USE_SSL === 'true',
  sslRequired: true, 
  rejectUnauthorized: process.env.REJECT_UNAUTHORIZED !== 'false',
  logging: process.env.SQL_LOGGING === 'true',
  host: process.env.PGHOST,
  username: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT || 5432,
  googleHotelsClientId: process.env.GOOGLE_HOTELS_CLIENT_ID,
  googleHotelsClientSecret: process.env.GOOGLE_HOTELS_CLIENT_SECRET
};

export default config;